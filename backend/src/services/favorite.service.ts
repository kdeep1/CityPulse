import {prisma} from "../lib/prisma";
//add favorite
export const addFavorite = async(userId : number, eventId : number) => {
    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });

    if (existing) {
        throw new Error("Event is already favorited");
    }

    // Create new favorite
    return await prisma.favorite.create({
        data: {
            userId,
            eventId
        }
    });
};
export const removeFavorite = async(userId : number, eventId : number) => {
    // Check if favorite exists
    const existing = await prisma.favorite.findUnique({ 
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });

    if (!existing) {
        throw new Error("Event is not favorited");
    }

    // Delete the favorite
    return await prisma.favorite.delete({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });
};
// Get user's favorite events
export const getUserFavorites = async(userId : number) => {
    const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
            event: true
        }
    });
    return favorites;
};