import { Temporal } from '@js-temporal/polyfill';
import { PaidLeave, PartTimeInputInterval, PartTimeInterval } from '../types';

export function parseIntervals(intervals: PartTimeInputInterval[]) {
  return intervals.map<PartTimeInterval>(interval => {
    const { from: fromUnparsed, to: toUnparsed, value } = interval;

    const [from, to] = [fromUnparsed, toUnparsed].map(date =>
      Temporal.PlainYearMonth.from(date)
    );
    return { from, to, value };
  });
}
