import {prisma} from "../lib/prisma";

export const scanTicketService = async (ticketCode: string) => {

  // Step 1: Find ticket
  const ticket = await prisma.ticket.findUnique({
    where: { ticketCode }
  });

  if (!ticket) {
    throw new Error("Invalid ticket");
  }

  // Step 2: Check status
  if (ticket.status === "SCANNED") {
    throw new Error("Ticket already used");
  }

  if (ticket.status === "CANCELLED") {
    throw new Error("Ticket cancelled");
  }

  if (ticket.status === "EXPIRED") {
    throw new Error("Ticket expired");
  }

  // Step 3: Mark scanned
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: "SCANNED",
      scannedAt: new Date()
    }
  });

  return {
    message: "Entry allowed",
    ticket: updatedTicket
  };
};