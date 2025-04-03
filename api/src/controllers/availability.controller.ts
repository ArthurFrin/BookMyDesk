import { FastifyRequest, FastifyReply } from "fastify";
import {
  startOfWeek,
  addWeeks,
  addDays,
  eachDayOfInterval,
  formatISO,
} from "date-fns";

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isPublicHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const iso = date.toISOString().split("T")[0];
  const fixed = [
    `${year}-01-01`,
    `${year}-05-01`,
    `${year}-05-08`,
    `${year}-07-14`,
    `${year}-08-15`,
    `${year}-11-01`,
    `${year}-11-11`,
    `${year}-12-25`,
  ];
  return fixed.includes(iso);
}

export async function getAvailability(
  request: FastifyRequest<{
    Querystring: {
      userId?: string;
    };
  }>,
  reply: FastifyReply
) {
  const prisma = request.server.prisma;
  const { userId } = request.query;
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const totalDesks = await prisma.desk.count({ where: { isAvailable: true } });

  const weeks = [];

  for (let w = 0; w < 3; w++) {
    const weekStart = addWeeks(start, w);
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6),
    });

    const days = await Promise.all(
      weekDays.map(async (date) => {
        const isDisabled = isWeekend(date) || isPublicHoliday(date);

        let reservedCount = 0;
        let userHasReservation = false;

        if (!isDisabled) {
          // Retrieve all reservations for this date
          const reservations = await prisma.reservation.findMany({
            where: {
              date: {
                gte: new Date(formatISO(date, { representation: "date" })),
                lt: new Date(
                  formatISO(addDays(date, 1), { representation: "date" })
                ),
              },
            },
          });
          
          reservedCount = reservations.length;
          
          // Check if the user already has a reservation for this date
          if (userId) {
            userHasReservation = reservations.some(
              res => res.userId === parseInt(userId)
            );
          }
        }

        return isDisabled
          ? {
              date: formatISO(date, { representation: "date" }),
              isDisabled: true,
              userHasReservation: false,
            }
          : {
              date: formatISO(date, { representation: "date" }),
              availableDesks: totalDesks - reservedCount,
              isDisabled: false,
              userHasReservation,
            };
      })
    );

    weeks.push({
      week: `W${formatISO(weekStart, { representation: "date" }).slice(0, 10)}`,
      days,
    });
  }

  return reply.send(weeks);
}

export async function getAvailableDesksForDay(
  request: FastifyRequest<{
    Params: {
      date: string;
    };
    Querystring: {
      userId?: string;
    };
  }>,
  reply: FastifyReply
) {
  const prisma = request.server.prisma;
  const { date } = request.params;
  const { userId } = request.query;

  if (!date) {
    return reply.status(400).send({ error: "Date is required" });
  }

  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    return reply.status(400).send({ error: "Invalid date format" });
  }

  const isDisabled = isWeekend(selectedDate) || isPublicHoliday(selectedDate);

  if (isDisabled) {
    return reply.send({
      date: formatISO(selectedDate, { representation: "date" }),
      isDisabled: true,
      desks: [],
      userHasReservation: false
    });
  }

  // Retrieve all desks (not just the available ones)
  const desks = await prisma.desk.findMany();

  // Retrieve all reservations for the specified date
  const reservations = await prisma.reservation.findMany({
    where: {
      date: {
        gte: new Date(formatISO(selectedDate, { representation: "date" })),
        lt: new Date(
          new Date(formatISO(selectedDate, { representation: "date" })).setDate(selectedDate.getDate() + 1)
        ),
      },
    },
    include: {
      desk: true,
      user: true,
    },
  });

  // Check if the specified user already has a reservation for this day
  const userReservation = userId 
    ? reservations.find(res => res.userId === parseInt(userId)) 
    : null;

  // Retrieve the IDs of reserved desks with user information
  const reservedDesksInfo = reservations.map(res => ({
    deskId: res.deskId,
    userId: res.userId,
    userName: res.user.firstName + ' ' + res.user.lastName,
  }));

  // Prepare the list of desks with their status
  const desksWithStatus = desks.map(desk => {
    if (!desk.isAvailable) {
      return {
        id: desk.id,
        status: 'disabled',  // Desk is broken or unavailable
      };
    }
    
    const reservation = reservedDesksInfo.find(res => res.deskId === desk.id);
    
    // If reserved by the current user, special status
    if (userId && reservation?.userId === parseInt(userId)) {
      return {
        id: desk.id,
        status: 'user-reserved',  // Reserved by the current user
        userId: reservation.userId,
        userName: reservation.userName
      };
    }
    
    // If reserved by someone else
    if (reservation) {
      return {
        id: desk.id,
        status: 'reserved',  // Reserved by someone else
        userId: reservation.userId,
        userName: reservation.userName
      };
    }
    
    // Otherwise, available
    return {
      id: desk.id,
      status: 'available',  // Available for reservation
    };
  });

  // Count only the available desks (neither reserved nor disabled)
  const availableDesksCount = desksWithStatus.filter(desk => desk.status === 'available').length;

  return reply.send({
    date: formatISO(selectedDate, { representation: "date" }),
    isDisabled: false,
    availableCount: availableDesksCount,
    desks: desksWithStatus,
    userHasReservation: userReservation !== null,
    ...(userReservation && { userReservationDeskId: userReservation.deskId })
  });
}
