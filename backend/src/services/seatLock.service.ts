import {prisma}from "../lib/prisma";
import { expireBookingsService } from "./booking.service";

const TX_TIMEOUT = { timeout: 30000 }; // 30s for Neon serverless

export const lockSeats = async (
  eventId: number,
  seatIds: string[],
  userId: number,
) => {
  await expireBookingsService();

  return prisma.$transaction(async (tx) => {
    const LOCK_DURATION = 15 * 60 * 1000;
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
        id: { in: seatIds }
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

    // 🔒 Step 4: Lock seats
    await tx.eventSeat.updateMany({
      where: {
        eventId,
        id: { in: seatIds }
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
        id: { in: seatIds }
      }
    });

  }, TX_TIMEOUT);
};