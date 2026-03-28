import prisma from "../lib/prisma";
import { createEventSeats } from "./eventSeat.service";

export const createEventService = async (data: any, organizerId: number) => {

  const event = await prisma.events.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      startDateTime: new Date(data.startDateTime),
      endDateTime: new Date(data.endDateTime),
      city: data.city,
      address: data.address,
      totalTickets: data.totalTickets,
      organizerId: organizerId,
      venueId: data.venueId
    }
  });

  await createEventSeats(event.id, data.venueId);

  return event;
};
export const getAllEventsService = async () => {
  return await prisma.events.findMany({
    include: {
      venue: true,
      organizer: true,
    },
  });
};

export const getEventByIdService = async (id: number) => {
  return await prisma.events.findUnique({
    where: { id },
    include: {
      venue: true,
      organizer: true,
      eventSeats: true,
    },
  });
};

export const updateEventService = async (id: number, data: any) => {
  return await prisma.events.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      startDateTime: data.startDateTime
        ? new Date(data.startDateTime)
        : undefined,
      endDateTime: data.endDateTime
        ? new Date(data.endDateTime)
        : undefined,
      venueId: data.venueId,
    },
  });
};

export const deleteEventService = async (id: number) => {
  return await prisma.events.delete({
    where: { id },
  });
};

export const getEventSeatsService = async (id: number) => {
  const event = await prisma.events.findUnique({
    where: { id },
    select: {
      eventSeats: true,
    },
  });
  return event?.eventSeats || [];
};