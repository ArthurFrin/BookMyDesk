import { FastifyRequest, FastifyReply } from "fastify";
import { formatISO } from "date-fns";

export async function reserveDesk(
  request: FastifyRequest<{
    Params: {
      deskId: string;
    };
    Body: {
      userId: number;
      date: string;
    };
  }>,
  reply: FastifyReply
) {
  const prisma = request.server.prisma;
  const { deskId } = request.params;
  const { userId, date } = request.body;

  if (!deskId || !userId || !date) {
    return reply.status(400).send({ error: "DeskId, userId, and date are required" });
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return reply.status(400).send({ error: "Invalid date format" });
  }

  try {
    // Check if desk exists and is available
    const desk = await prisma.desk.findUnique({
      where: { id: parseInt(deskId) },
    });

    if (!desk) {
      return reply.status(404).send({ error: "Desk not found" });
    }

    if (!desk.isAvailable) {
      return reply.status(400).send({ error: "Desk is not available" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    // Check if the user has already reserved any desk for this date
    const existingUserReservation = await prisma.reservation.findFirst({
      where: {
        userId: userId,
        date: {
          gte: new Date(formatISO(selectedDate, { representation: "date" })),
          lt: new Date(
            new Date(formatISO(selectedDate, { representation: "date" })).setDate(selectedDate.getDate() + 1)
          ),
        },
      },
    });

    if (existingUserReservation) {
      return reply.status(400).send({ 
        error: "You have already reserved a desk for this date", 
        existingReservation: {
          deskId: existingUserReservation.deskId,
          date: formatISO(existingUserReservation.date, { representation: "date" })
        }
      });
    }

    // Check if desk is already reserved for this date
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        deskId: parseInt(deskId),
        date: {
          gte: new Date(formatISO(selectedDate, { representation: "date" })),
          lt: new Date(
            new Date(formatISO(selectedDate, { representation: "date" })).setDate(selectedDate.getDate() + 1)
          ),
        },
      },
    });

    if (existingReservation) {
      return reply.status(400).send({ error: "Desk is already reserved for this date" });
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(formatISO(selectedDate, { representation: "date" })),
        deskId: parseInt(deskId),
        userId: userId,
      },
      include: {
        desk: true,
        user: true,
      },
    });

    return reply.status(201).send({
      message: "Desk reserved successfully",
      reservation: {
        id: reservation.id,
        date: formatISO(reservation.date, { representation: "date" }),
        deskId: reservation.deskId,
        userId: reservation.userId,
        userName: `${reservation.user.firstName} ${reservation.user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Error reserving desk:", error);
    return reply.status(500).send({ error: "Failed to reserve desk" });
  }
}

export async function unfollowDesk(
  request: FastifyRequest<{
    Params: {
      deskId: string;
    };
    Body: {
      userId: number;
      date: string;
    };
  }>,
  reply: FastifyReply
) {
  const prisma = request.server.prisma;
  const { deskId } = request.params;
  const { userId, date } = request.body;

  if (!deskId || !userId || !date) {
    return reply.status(400).send({ error: "DeskId, userId, and date are required" });
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return reply.status(400).send({ error: "Invalid date format" });
  }

  try {
    // Check if the reservation exists for this user, desk, and date
    const reservation = await prisma.reservation.findFirst({
      where: {
        deskId: parseInt(deskId),
        userId: userId,
        date: {
          gte: new Date(formatISO(selectedDate, { representation: "date" })),
          lt: new Date(
            new Date(formatISO(selectedDate, { representation: "date" })).setDate(selectedDate.getDate() + 1)
          ),
        },
      },
    });

    if (!reservation) {
      return reply.status(404).send({ error: "Reservation not found" });
    }

    // Delete the reservation
    await prisma.reservation.delete({
      where: { id: reservation.id },
    });

    return reply.send({
      message: "Desk reservation cancelled successfully",
      deskId: parseInt(deskId),
      date: formatISO(selectedDate, { representation: "date" }),
    });
  } catch (error) {
    console.error("Error unfollowing desk:", error);
    return reply.status(500).send({ error: "Failed to cancel desk reservation" });
  }
}