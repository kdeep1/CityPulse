import { prisma } from "../lib/prisma";
import { SeatType } from "@prisma/client";

export interface SeatConfig {
  type: SeatType;
  count: number;
}

export const createVenueSeats = async (
  venueId: number,
  seatConfigs: SeatConfig[]
) => {
  const seats: { seatType: SeatType; venueId: number }[] = [];

  for (const config of seatConfigs) {
    for (let i = 0; i < config.count; i++) {
      seats.push({
        seatType: config.type,
        venueId,
      });
    }
  }

  if (seats.length === 0) return { count: 0 };

  return await prisma.seat.createMany({
    data: seats,
  });
};