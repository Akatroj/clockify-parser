import { Temporal } from '@js-temporal/polyfill';

import workhours from '../../resources/workhours.json';

import type { HoursByMonth, MonthlyOutput, TimeByDay, YearMonthInterval } from '../types';

const usableWorkhours: HoursByMonth = workhours;

export function toMonthly(durations: TimeByDay, partTime?: YearMonthInterval[]) {
  const byMonthReport: Record<string, MonthlyOutput> = {};

  for (const [year, months] of Object.entries(durations)) {
    for (const [month, days] of Object.entries(months)) {
      const yourTime = Object.values(days).reduce<Temporal.Duration>(
        (acc, { duration }) => acc.add(duration),
        new Temporal.Duration()
      );

      const expectedTime = Temporal.Duration.from({
        hours: isInInterval(
          Temporal.PlainYearMonth.from({ year: +year, month: +month }),
          partTime
        )
          ? Math.round((usableWorkhours[year][month] * 3) / 5)
          : usableWorkhours[year][month],
      });

      byMonthReport[`${month}/${year}`] = {
        yourTime: format(yourTime),
        expectedTime: format(expectedTime),
        balance: format(yourTime.subtract(expectedTime)),
      };
    }
  }

  console.log(JSON.stringify(byMonthReport));

  return byMonthReport;
}

function isInInterval(
  date: Temporal.PlainYearMonth,
  intervals: YearMonthInterval[] | undefined
) {
  if (!intervals) return false;
  return intervals.some(({ from, to }) => between(date, from, to));
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
  return `${numberToStr(duration.hours)}:${numberToStr(
    Math.abs(duration.minutes)
  )}:${numberToStr(Math.abs(duration.seconds))}`;
}
