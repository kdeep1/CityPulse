import prisma from "../lib/prisma";
// add review
export const addReview = async(userId : number, eventId : number, rating : number, comment : string) => {
    // Check if user attended the event
    const ticket = await prisma.ticket.findFirst({
        where: {
            userId,
            eventId
        }
    });

    if (!ticket) {
        throw new Error("User has not attended this event");
    }const existing = await prisma.review.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId
      }
    }
  });

  if (existing) {
    throw new Error("You already reviewed this event");
  }

    // Create the review
    return await prisma.review.create({
        data: {
            userId,
            eventId,
            rating,
            comment
        }
    });
};
// update review
export const updateReview = async(userId : number, eventId : number, rating : number, comment : string) => {
    const existing = await prisma.review.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });

    if (!existing) {
        throw new Error("Review not found");
    }

    // Update the review
    return await prisma.review.update({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        },
        data: {
            rating,
            comment
        }
    });
};
//get reviews for an event
export const getEventReviews = async (eventId: number) => {

  return await prisma.review.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

};
// delete review
export const deleteReview = async(userId : number, eventId : number) => {
    const existing = await prisma.review.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });

    if (!existing) {
        throw new Error("Review not found");
    }

    // Delete the review
    return await prisma.review.delete({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });
};