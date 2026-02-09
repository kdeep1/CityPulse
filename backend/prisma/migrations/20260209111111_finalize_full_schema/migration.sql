/*
  Warnings:

  - A unique constraint covering the columns `[eventSeatId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ticket_eventSeatId_key" ON "Ticket"("eventSeatId");
