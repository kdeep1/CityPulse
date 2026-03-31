import {prisma} from "../lib/prisma";
import { razorpayInstance } from "../lib/razorpay";
import { verifyRazorpaySignature } from "../utils/verify";
import { generateQRCode } from "../utils/qrCode";

const TX_TIMEOUT = { timeout: 30000 }; // 30s for Neon serverless

export const createBooking = async (
  userId: number,
  eventId: number,
  seatIds: string[]
) => {
  await expireBookingsService();

  return prisma.$transaction(async (tx) => {
    // Step 1: Fetch seats
    const seats = await tx.eventSeat.findMany({
      where: {
        id: { in: seatIds },
        eventId
      }
    });

    if (seats.length !== seatIds.length) {
      throw new Error("Some seats not found");
    }

    // Step 2: Validate LOCK
    for (const seat of seats) {
      if (seat.status !== "LOCKED") {
        throw new Error("Seat is not locked");
      }
    }

    // Step 3: Calculate total
    const totalAmount = seats.length * 100; // later dynamic pricing

    // Step 4: Create booking
    const booking = await tx.booking.create({
      data: {
        userId,
        eventId,
        totalAmount,
        status: "PENDING_PAYMENT",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min
      }
    });

    // Step 5: Attach seats to booking
    await tx.eventSeat.updateMany({
      where: {
        id: { in: seatIds }
      },
      data: {
        bookingId: booking.id
      }
    });

    return booking;
  }, TX_TIMEOUT);
};

// logic for payment creation
export const createPaymentService = async (
  bookingId: string,
  userId: number
) => {
  await expireBookingsService();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      eventSeats: true
    }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.userId !== userId) throw new Error("Unauthorized");
  if (booking.status !== "PENDING_PAYMENT") throw new Error("Invalid booking status");

  const now = new Date();
  if (booking.expiresAt && booking.expiresAt < now) {
    console.error(`[Booking Expired] ID: ${bookingId}, ExpiresAt: ${booking.expiresAt.toISOString()}, Now: ${now.toISOString()}`);
    throw new Error("Booking expired");
  }

  const order = await razorpayInstance.orders.create({
    amount: booking.totalAmount * 100, // paisa
    currency: "INR",
    receipt: bookingId
  });

  // create payment record
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      userId: booking.userId,
      amount: booking.totalAmount,
      status: "CREATED",
      gateway: "RAZORPAY",
      gatewayOrderId: order.id
    }
  });
  return { payment, order };
};

// logic for payment confirmation
export const confirmPaymentService = async (
  bookingId: string,
  paymentId: string,
  userId: number,
  signature: string
) => {
  // Verify Razorpay signature
  const isSignatureValid = verifyRazorpaySignature(bookingId, paymentId, signature);
  if (!isSignatureValid) {
    throw new Error("Invalid payment signature");
  }

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { eventSeats: true }
    });
    if (!booking) throw new Error("Booking not found");
    if (booking.userId !== userId) throw new Error("Unauthorized");
    if (booking.status !== "PENDING_PAYMENT") throw new Error("Invalid booking status");
    if (booking.expiresAt && booking.expiresAt < new Date()) throw new Error("Booking expired");

    for (const seat of booking.eventSeats) {
      if (seat.status !== "LOCKED") {
        throw new Error("Seat is not locked");
      }
    }

    // update payment status
    await tx.payment.updateMany({
      where: { bookingId: bookingId },
      data: {
        status: "SUCCESS",
        gatewayPaymentId: paymentId,
        completedAt: new Date()
      },
    });

    // confirm booking
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date()
      }
    });

    // mark seats as booked
    await tx.eventSeat.updateMany({
      where: {
        bookingId: bookingId
      },
      data: {
        status: "BOOKED",
        lockedAt: null,
        lockedById: null
      }
    });

    // generate tickets
    const ticketsData = [];

    for (const seat of booking.eventSeats) {
      const ticketCode = `TICKET-${Date.now()}-${seat.id}`;

      const qrData = JSON.stringify({
        ticketCode,
        eventId: booking.eventId,
        userId: booking.userId,
        seatId: seat.id
      });

      const qrCodeImage = await generateQRCode(qrData);

      ticketsData.push({
        bookingId,
        eventSeatId: seat.id,
        userId: booking.userId,
        eventId: booking.eventId,
        ticketCode,
        qrCodeData: qrCodeImage
      });
    }

    await tx.ticket.createMany({
      data: ticketsData
    });
  }, TX_TIMEOUT);
};

export const expireBookingsService = async () => {
  const now = new Date();

  // Step 1: Find expired bookings
  const expiredBookings = await prisma.booking.findMany({
    where: {
      status: "PENDING_PAYMENT",
      expiresAt: {
        lt: now
      }
    },
    include: {
      eventSeats: true
    }
  });

  if (expiredBookings.length === 0) return;

  // Step 2: Process each booking
  for (const booking of expiredBookings) {
    await prisma.$transaction(async (tx) => {
      // Mark booking expired
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: "EXPIRED"
        }
      });

      // Release seats
      await tx.eventSeat.updateMany({
        where: {
          bookingId: booking.id
        },
        data: {
          status: "AVAILABLE",
          lockedAt: null,
          lockedById: null,
          bookingId: null
        }
      });
    }, TX_TIMEOUT);
  }
};