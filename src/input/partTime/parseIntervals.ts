import { Temporal } from '@js-temporal/polyfill';
import type { PartTimeInputInterval, PartTimeInterval } from 'types/time';

export function parseIntervals(intervals: PartTimeInputInterval[]): PartTimeInterval[] {
  return intervals.map<PartTimeInterval>(interval => {
    const { from: fromUnparsed, to: toUnparsed, value } = interval;

    const [from, to] = [fromUnparsed, toUnparsed].map(date =>
      Temporal.PlainYearMonth.from(date)
    );
    return { from, to, value };
  });
}
