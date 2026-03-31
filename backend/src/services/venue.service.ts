import {prisma} from "../lib/prisma";

export const createVenueService = async (data: any) => {
  return await prisma.venue.create({
    data: {
      name: data.name,
      city: data.city,
      address: data.address,
      type: data.type,
      capacity: data.capacity
    }
  });
};

export const getAllVenuesService = async () => {
  return await prisma.venue.findMany();
};



export const updateVenueService = async (id: number, data: any) => {
  return await prisma.venue.update({
    where: { id },
    data
  });
};

export const deleteVenueService = async (id: number) => {
  return await prisma.venue.delete({
    where: { id }
  });
};