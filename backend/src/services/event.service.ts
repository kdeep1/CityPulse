import prisma from "../lib/prisma";

export const createEventService = async (data: any, organizerId: number) => {

  return await prisma.events.create({
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

};

export const getAllEventsService = async () => {

  return await prisma.events.findMany({
    where: {
      isApproved: true
    },
    include: {
      venue: true,
      organizer: true
    }
  });

};

export const getEventByIdService = async (id: number) => {

  return await prisma.events.findUnique({
    where: { id },
    include: {
      venue: true,
      organizer: true
    }
  });

};

export const updateEventService = async (id: number, data: any) => {

  return await prisma.events.update({
    where: { id },
    data
  });

};

export const deleteEventService = async (id: number) => {

  return await prisma.events.delete({
    where: { id }
  });

}; 