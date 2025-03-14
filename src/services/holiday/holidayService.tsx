import dayjs, { Dayjs } from "dayjs";
import { getPublicHolidays } from "../nager/nagerService";

export interface LeaveRequest {
  CountryCode: string;
  NumberOfDays: number;
  DateFrom: Date;
  DateTo: Date;
}

export interface LeaveTimelineItem {
  id: string;
  dayType: DayType;
  date: Dayjs;
  publicHolidayName?: string;
}

export class LeaveDay {
  id: string;
  dateFrom: Dayjs;
  dateTo: Dayjs;
  timeline: LeaveTimelineItem[];
  publicHolidayHash: string;

  constructor(dateFrom: Dayjs, dateTo: Dayjs, timeline: LeaveTimelineItem[]) {
    this.id = this.generateGUID();
    this.timeline = timeline;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.publicHolidayHash = this.generatePublicHolidayHash();
  }

  get daysOfLeave(): number {
    return this.timeline.length;
  }

  get daysOfWeekend(): number {
    return (
      this.timeline.filter((t) => t.dayType === DayType.Weekend).length / 2
    );
  }

  get daysOfPublicHolidays(): number {
    return this.timeline.filter((t) => t.dayType === DayType.PublicHoliday)
      .length;
  }

  get daysOfLeaveFriendly(): string {
    return `DAYS ${this.daysOfLeave}`.toUpperCase();
  }

  private generatePublicHolidayHash(): string {
    const publicHolidays = this.timeline
      .filter((item) => item.publicHolidayName)
      .map((item) => item.publicHolidayName)
      .sort();

    return publicHolidays.join("|");
  }

  private generateGUID(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

export enum DayType {
  Weekend,
  PublicHoliday,
  Weekday,
}

export const getBestLeaveDays = async (request: LeaveRequest) => {
  const holidays = await aggregatePublicHolidays(
    request.CountryCode,
    request.DateFrom
  );

  const bestLeaveDays = calculateBestLeaveDays(
    { startDate: dayjs(request.DateFrom), endDate: dayjs(request.DateTo) },
    holidays,
    request.NumberOfDays
  )
    .sort((a, b) => b.daysOfLeave - a.daysOfLeave)
    .filter((x) => x.daysOfLeave >= request.NumberOfDays);

  const uniqueLeaveDays = bestLeaveDays.reduce<LeaveDay[]>((acc, element) => {
    const hasConflict = acc.some(
      (x) => x.publicHolidayHash === element.publicHolidayHash
    );
    if (!hasConflict) {
      acc.push(element);
    }
    return acc;
  }, []);

  return uniqueLeaveDays.slice(0, 10);
};

function calculateBestLeaveDays(
  dateRange: { startDate: Dayjs; endDate: Dayjs },
  publicHolidayDates: { [key: string]: string },
  leaveDays: number
): LeaveDay[] {
  const leaveDaysResults: LeaveDay[] = [];

  for (
    let leaveStartDate = dateRange.startDate;
    leaveStartDate.isBefore(dateRange.endDate) ||
    leaveStartDate.isSame(dateRange.endDate);
    leaveStartDate = leaveStartDate.add(1, "day")
  ) {
    if (isNonWorkingDay(leaveStartDate, publicHolidayDates)) {
      continue;
    }

    const leavePeriod = generateLeavePeriod(
      leaveStartDate,
      leaveDays,
      publicHolidayDates
    );
    leaveDaysResults.push(leavePeriod);
  }

  return leaveDaysResults;
}

function generateLeavePeriod(
  leaveStartDate: Dayjs,
  leaveDays: number,
  publicHolidayDates: { [key: string]: string }
): LeaveDay {
  let remainingLeaveDays = leaveDays;
  let leaveEndDate = leaveStartDate;
  const timeline: LeaveTimelineItem[] = [];

  for (let d = leaveStartDate; remainingLeaveDays > 0; d = d.add(1, "day")) {
    leaveEndDate = d;

    if (d.day() === 6 || d.day() === 0) {
      timeline.push({ id: "", dayType: DayType.Weekend, date: d });
    } else if (publicHolidayDates[d.format("YYYY-MM-DD")]) {
      timeline.push({
        id: "",
        dayType: DayType.PublicHoliday,
        date: d,
        publicHolidayName: publicHolidayDates[d.format("YYYY-MM-DD")],
      });
    } else {
      timeline.push({ id: "", dayType: DayType.Weekday, date: d });
      remainingLeaveDays--;
    }
  }
  return new LeaveDay(leaveStartDate, leaveEndDate, timeline);
}

function isNonWorkingDay(
  date: Dayjs,
  publicHolidays: { [key: string]: string }
): boolean {
  return (
    date.day() === 6 ||
    date.day() === 0 ||
    !!publicHolidays[date.format("YYYY-MM-DD")]
  );
}

const aggregatePublicHolidays = async (countryCode: string, date: Date) => {
  // Gets cached after first request so yolo
  const currentYear = await getPublicHolidays(countryCode, date.getFullYear());
  const nextYear = await getPublicHolidays(countryCode, date.getFullYear() + 1);
  const twoYears = await getPublicHolidays(countryCode, date.getFullYear() + 2);

  const holidays: Record<string, string> = {};

  [...currentYear, ...nextYear, ...twoYears].forEach((holiday) => {
    const dateString = dayjs(holiday.date).format("YYYY-MM-DD");
    holidays[dateString] = holiday.localName;
  });

  return holidays;
};
