import { Temporal } from '@js-temporal/polyfill';

import workhours from '../../resources/workhours.json';

import type {
  HoursByMonth,
  MonthlyOutput,
  TimeByDay,
  PartTimeInterval,
  PaidLeave,
} from '../types';

const usableWorkhours: HoursByMonth = workhours;

export function toMonthly(
  durations: TimeByDay,
  partTime?: PartTimeInterval[],
  paidLeave?: PaidLeave
) {
  const byMonthReport: Record<string, MonthlyOutput> = {};

  const sum = {
    expectedTime: new Temporal.Duration(0),
    yourTime: new Temporal.Duration(0),
  };

  for (const [year, months] of Object.entries(durations)) {
    for (const [month, days] of Object.entries(months)) {
      const yourTime = Object.values(days).reduce<Temporal.Duration>(
        (acc, { duration }) => acc.add(duration),
        new Temporal.Duration()
      );

      const vacation = Temporal.Duration.from({
        hours: 8 * (paidLeave?.[`${year}-${month.padStart(2, '0')}`] ?? 0),
      });

      const partTimeInterval = getIntervalForDate(
        Temporal.PlainYearMonth.from({ year: +year, month: +month }),
        partTime
      );

      const expectedTime = Temporal.Duration.from({
        hours: partTimeInterval
          ? Math.round(usableWorkhours[year][month] * partTimeInterval.value)
          : usableWorkhours[year][month],
      }).subtract(vacation);

      byMonthReport[`${month}/${year}`] = {
        vacation: format(vacation),
        yourTime: format(yourTime),
        expectedTime: format(expectedTime),
        balance: format(yourTime.subtract(expectedTime)),
      };

      sum.expectedTime = sum.expectedTime.add(expectedTime);
      sum.yourTime = sum.yourTime.add(yourTime);
    }
  }

  console.log(JSON.stringify(byMonthReport));

  console.log(`BALANCE\n\n\n ${sum.yourTime.subtract(sum.expectedTime).total('hours')}`);

  return byMonthReport;
}

function getIntervalForDate(
  date: Temporal.PlainYearMonth,
  intervals: PartTimeInterval[] | undefined
) {
  return intervals?.find(({ from, to }) => between(date, from, to));
}

function between(
  date: Temporal.PlainYearMonth,
  start: Temporal.PlainYearMonth,
  end: Temporal.PlainYearMonth
) {
  console.log(`checking if ${date} between ${start} and ${end}`);
  const retval =
    Temporal.PlainYearMonth.compare(date, start) >= 0 &&
    Temporal.PlainYearMonth.compare(date, end) < 0;
  console.log(retval);
  return retval;
}

function format(duration: Temporal.Duration) {
  const numberToStr = (n: number) => n.toFixed(0).padStart(2, '0');
  const [hours, minutes, seconds] = [
    duration.hours,
    Math.abs(duration.minutes),
    Math.abs(duration.seconds),
  ].map(numberToStr);

  return `${hours}:${minutes}:${seconds}`;
}
