import { Temporal } from '@js-temporal/polyfill';
import { YearMonthInterval } from '../types';

export function parseIntervals(intervals: string[]) {
  return intervals.map<YearMonthInterval>(interval => {
    const [from, to] = interval.split(':').map(date => Temporal.PlainYearMonth.from(date));
    return { from, to };
  });
}
