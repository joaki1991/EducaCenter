import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../config/prisma.js';
import { AuthRequest, getCompanyId } from '../middleware/auth.js';

// Helper to format date range
const formatDateRange = (startDate?: string, endDate?: string) => {
  const where: any = {};
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = new Date(startDate);
    if (endDate) where.timestamp.lte = new Date(endDate);
  }
  return where;
};

// Calculate total hours worked from time entries
const calculateHours = (entries: any[]): number => {
  let totalMinutes = 0;
  
  for (let i = 0; i < entries.length - 1; i += 2) {
    if (entries[i].type === 'IN' && entries[i + 1]?.type === 'OUT') {
      const inTime = new Date(entries[i].timestamp).getTime();
      const outTime = new Date(entries[i + 1].timestamp).getTime();
      totalMinutes += (outTime - inTime) / (1000 * 60);
    }
  }
  
  return Math.round((totalMinutes / 60) * 100) / 100;
};

// Group entries by day
const groupByDay = (entries: any[]) => {
  const grouped: { [key: string]: any[] } = {};
  
  entries.forEach((entry) => {
    const day = entry.timestamp.toISOString().split('T')[0];
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(entry);
  });
  
  return grouped;
};

export const getEmployeeReport = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const { employeeId } = request.params as { employeeId: string };
    const { startDate, endDate } = request.query as {
      startDate?: string;
      endDate?: string;
    };
    const companyId = getCompanyId(request);

    // Verify employee belongs to company
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!employee) {
      reply.status(404).send({ error: 'Employee not found' });
      return;
    }

    // Get time entries
    const whereClause = formatDateRange(startDate, endDate);
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        employeeId,
        companyId,
        ...whereClause,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Group by day and calculate hours
    const byDay = groupByDay(timeEntries);
    const dailySummary = Object.entries(byDay).map(([day, entries]) => ({
      date: day,
      entries,
      hoursWorked: calculateHours(entries),
      complete: entries.length % 2 === 0,
    }));

    const totalHours = dailySummary.reduce((sum, day) => sum + day.hoursWorked, 0);

    reply.send({
      success: true,
      report: {
        employee: {
          id: employee.id,
          email: employee.user.email,
          startDate: employee.startDate,
          workCenter: employee.workCenter,
        },
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present',
        },
        summary: {
          totalDays: dailySummary.length,
          totalHours,
          totalEntries: timeEntries.length,
        },
        dailySummary,
      },
    });
  } catch (error) {
    console.error('Get employee report error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getCompanyReport = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Only admins can view company reports
    if (
      request.user.role !== 'COMPANY_ADMIN' &&
      request.user.role !== 'SUPER_ADMIN'
    ) {
      reply.status(403).send({ error: 'Forbidden' });
      return;
    }

    const { startDate, endDate } = request.query as {
      startDate?: string;
      endDate?: string;
    };
    const companyId = getCompanyId(request);

    // Get company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      reply.status(404).send({ error: 'Company not found' });
      return;
    }

    // Get all employees
    const employees = await prisma.employee.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Get time entries for all employees
    const whereClause = formatDateRange(startDate, endDate);
    const employeeReports = [];

    for (const employee of employees) {
      const timeEntries = await prisma.timeEntry.findMany({
        where: {
          employeeId: employee.id,
          companyId,
          ...whereClause,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      const byDay = groupByDay(timeEntries);
      const dailySummary = Object.entries(byDay).map(([day, entries]) => ({
        date: day,
        hoursWorked: calculateHours(entries),
      }));

      const totalHours = dailySummary.reduce((sum, day) => sum + day.hoursWorked, 0);

      employeeReports.push({
        employeeId: employee.id,
        email: employee.user.email,
        workCenter: employee.workCenter,
        totalHours,
        totalDays: dailySummary.length,
        totalEntries: timeEntries.length,
      });
    }

    const companyTotalHours = employeeReports.reduce((sum, e) => sum + e.totalHours, 0);

    reply.send({
      success: true,
      report: {
        company: {
          id: company.id,
          name: company.name,
          cif: company.cif,
        },
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present',
        },
        summary: {
          totalEmployees: employees.length,
          totalHours: companyTotalHours,
        },
        employees: employeeReports,
      },
    });
  } catch (error) {
    console.error('Get company report error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getMonthlyReport = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const { year, month } = request.query as {
      year?: string;
      month?: string;
    };

    const targetYear = parseInt(year || new Date().getFullYear().toString(), 10);
    const targetMonth = parseInt(month || (new Date().getMonth() + 1).toString(), 10);

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const companyId = getCompanyId(request);

    // Get time entries for the month
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        companyId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Group by employee
    const byEmployee: { [key: string]: any[] } = {};
    timeEntries.forEach((entry) => {
      const empId = entry.employeeId;
      if (!byEmployee[empId]) byEmployee[empId] = [];
      byEmployee[empId].push(entry);
    });

    const employeeMonthly = Object.entries(byEmployee).map(([empId, entries]) => {
      const employee = entries[0].employee;
      const byDay = groupByDay(entries);
      const totalHours = Object.values(byDay).reduce(
        (sum, dayEntries) => sum + calculateHours(dayEntries),
        0
      );

      return {
        employeeId: empId,
        email: employee.user.email,
        daysWorked: Object.keys(byDay).length,
        totalHours,
        totalEntries: entries.length,
      };
    });

    reply.send({
      success: true,
      report: {
        period: {
          year: targetYear,
          month: targetMonth,
          monthName: new Date(targetYear, targetMonth - 1).toLocaleString('es-ES', {
            month: 'long',
          }),
        },
        summary: {
          totalEmployees: employeeMonthly.length,
          totalHours: employeeMonthly.reduce((sum, e) => sum + e.totalHours, 0),
        },
        employees: employeeMonthly,
      },
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getVacationReport = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const { year } = request.query as { year?: string };
    const targetYear = parseInt(year || new Date().getFullYear().toString(), 10);
    const companyId = getCompanyId(request);

    const yearStart = new Date(targetYear, 0, 1);
    const yearEnd = new Date(targetYear, 11, 31, 23, 59, 59);

    // Get all employees
    const employees = await prisma.employee.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        vacationRequests: {
          where: {
            startDate: {
              gte: yearStart,
            },
            endDate: {
              lte: yearEnd,
            },
          },
        },
      },
    });

    const vacationSummary = employees.map((employee) => {
      const approvedDays = employee.vacationRequests
        .filter((vr) => vr.status === 'APPROVED')
        .reduce((sum, vr) => sum + vr.daysRequested, 0);

      const pendingDays = employee.vacationRequests
        .filter((vr) => vr.status === 'PENDING')
        .reduce((sum, vr) => sum + vr.daysRequested, 0);

      const rejectedDays = employee.vacationRequests
        .filter((vr) => vr.status === 'REJECTED')
        .reduce((sum, vr) => sum + vr.daysRequested, 0);

      return {
        employeeId: employee.id,
        email: employee.user.email,
        totalEntitlement: 22,
        approvedDays,
        pendingDays,
        rejectedDays,
        remainingDays: 22 - approvedDays,
        requests: employee.vacationRequests.map((vr) => ({
          id: vr.id,
          startDate: vr.startDate,
          endDate: vr.endDate,
          daysRequested: vr.daysRequested,
          status: vr.status,
          createdAt: vr.createdAt,
        })),
      };
    });

    reply.send({
      success: true,
      report: {
        year: targetYear,
        employees: vacationSummary,
      },
    });
  } catch (error) {
    console.error('Get vacation report error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
