import prisma from "../lib/prisma";
import { expireBookingsService } from "./booking.service";

export const lockSeats = async (
  eventId: number,
  seatIds: string[],
  userId: number,
  
  
) => {

  return prisma.$transaction(async (tx) => {

    const LOCK_DURATION = 5 * 60 * 1000;
    const now = new Date();

    // 🔓 Step 1: Release expired locks
    await tx.eventSeat.updateMany({
      where: {
        eventId,
        status: "LOCKED",
        lockedAt: {
          lt: new Date(Date.now() - LOCK_DURATION)
        }
      },
      data: {
        status: "AVAILABLE",
        lockedAt: null,
        lockedById: null
      }
    });

    // 🔍 Step 2: Fetch seats
    const seats = await tx.eventSeat.findMany({
      where: {
        eventId,
        seatId: { in: seatIds }
      }
    });

    if (seats.length !== seatIds.length) {
      throw new Error("Some seats not found");
    }

    // 🔒 Step 3: Validate
    for (const seat of seats) {

      if (seat.status === "BOOKED") {
        throw new Error("Seat already booked");
      }

      if (
        seat.status === "LOCKED" &&
        seat.lockedAt &&
        new Date(seat.lockedAt).getTime() + LOCK_DURATION > now.getTime() &&
        seat.lockedById !== userId
      ) {
        throw new Error("Seat already locked by another user");
      }
    }
     await expireBookingsService();
    // 🔒 Step 4: Lock seats
    await tx.eventSeat.updateMany({
      where: {
        eventId,
        seatId: { in: seatIds }
      },
      data: {
        status: "LOCKED",
        lockedAt: now,
        lockedById: userId
      }
    });

    // 📦 Step 5: Return updated seats
    return await tx.eventSeat.findMany({
      where: {
        eventId,
        seatId: { in: seatIds }
      }
    });

  });

};