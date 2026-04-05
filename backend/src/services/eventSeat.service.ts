import { prisma as defaultPrisma } from "../lib/prisma";
import { SeatStatus, Prisma } from "@prisma/client";

export const createEventSeats = async (
  eventId: number,
  venueId: number,
  tx?: Prisma.TransactionClient
) => {
  const prisma = tx || defaultPrisma;

  const seats = await prisma.seat.findMany({
    where: { venueId },
  });

  if (!seats.length) {
    throw new Error("No seats found for this venue");
  }

  const eventSeatsData = seats.map((seat, index) => ({
    eventId,
    seatId: seat.id,
    status: SeatStatus.AVAILABLE,
    seatType: seat.seatType,
    seatNumber: index + 1,
  }));

  await prisma.eventSeat.createMany({
    data: eventSeatsData,
  });

  return { message: "Event seats created successfully" };
};