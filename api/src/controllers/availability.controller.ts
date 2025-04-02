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
  request: FastifyRequest,
  reply: FastifyReply
) {
  const prisma = request.server.prisma;
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
        if (!isDisabled) {
          reservedCount = await prisma.reservation.count({
            where: {
              date: {
                gte: new Date(formatISO(date, { representation: "date" })),
                lt: new Date(
                  formatISO(addDays(date, 1), { representation: "date" })
                ),
              },
            },
          });
        }

        return isDisabled
          ? {
              date: formatISO(date, { representation: "date" }),
              isDisabled: true,
            }
          : {
              date: formatISO(date, { representation: "date" }),
              availableDesks: totalDesks - reservedCount,
              isDisabled: false,
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
