import prisma from "../lib/prisma";

export const createVenueSeats = async (
  venueId: number,
  seatType: "VIP" | "REGULAR" | "BALCONY",
  count: number
) => {

  const seats = [];

  for (let i = 0; i < count; i++) {
    seats.push({
      seatType,
      venueId
    });
  }

  return await prisma.seat.createMany({
    data: seats
  });

};