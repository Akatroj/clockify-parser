import { Temporal } from '@js-temporal/polyfill';

import type { ClockifyReport } from 'types/clockify';
import type { TimeByDay } from 'types/time';
import { parseClockifyDate, parseClockifyDuration, parseClockifyTime } from 'utils/dates';
import { formatRow } from 'utils/debug';

function useTimeStore() {
  const timeStore: TimeByDay = {};

  const addDuration = (
    date: Temporal.PlainDate,
    duration: Temporal.Duration,
    description: string | undefined
  ) => {
    const actualDescription = description || 'Unspecified';

    const [day, month, year] = [date.day, date.month, date.year];

    // init if undefined
    timeStore[year] ??= {};
    timeStore[year][month] ??= {};

    const target = timeStore[year][month][day];

    if (!target) {
      timeStore[year][month][day] = { duration, comment: actualDescription };
      return;
    } else {
      target.duration = target.duration.add(duration);

      if (!target.comment.includes(actualDescription))
        target.comment += `, ${actualDescription}`;
    }
  };

  return { timeStore, addDuration };
}

export function parseDetailedReport(sheet: ClockifyReport[]): TimeByDay {
  const { timeStore, addDuration } = useTimeStore();

  for (const row of sheet) {
    const {
      ['Start Date']: startDate,
      ['End Date']: endDate,
      ['Duration (h)']: duration,
      ['Description']: description,
      ['Start Time']: startTime,
      ['End Time']: endTime,
    } = row;

    const parsedDuration = parseClockifyDuration(duration);

    const [parsedStartDate, parsedEndDate] = [startDate, endDate].map(parseClockifyDate);
    const [parsedStartTime, parsedEndTime] = [startTime, endTime].map(parseClockifyTime);

    if (parsedStartDate.equals(parsedEndDate)) {
      addDuration(parsedStartDate, parsedDuration, description);
      continue;
    } else {
      console.log('Found a timer spanning multiple days:', formatRow(row));

      if (!parsedEndDate.equals(parsedStartDate.add({ days: 1 })))
        throw new Error(
          `Timers spanning more than 2 days are not supported. ${formatRow(row)}`
        );

      const midnight = Temporal.PlainTime.from({ hour: 0, minute: 0, second: 0 });

      const [durationTillEndOfDay, durationFromStartOfDay] = [
        parsedStartTime.until(midnight).add({ days: 1 }),
        parsedEndTime.since(midnight),
      ];

      if (
        durationTillEndOfDay.add(durationFromStartOfDay).total('seconds') !==
        parsedDuration.total('seconds')
      ) {
        throw new Error(
          `Duration mismatch: ${durationTillEndOfDay
            .add(durationFromStartOfDay)
            .total('seconds')} !== ${parsedDuration.total('seconds')}. Contact the developer.`
        );
      }

      addDuration(parsedStartDate, durationTillEndOfDay, description);
      addDuration(parsedEndDate, durationFromStartOfDay, description);
    }
  }

  return timeStore;
}
