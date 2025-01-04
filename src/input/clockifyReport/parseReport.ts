import { Temporal } from '@js-temporal/polyfill';

import type { ClockifyReport } from 'types/clockify';
import type { TimeByDay } from 'types/time';
import { parseClockifyDate, parseClockifyDuration } from 'utils/dates';

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
    } = row;

    const parsedDuration = parseClockifyDuration(duration);

    const [parsedStartDate, parsedEndDate] = [startDate, endDate].map(parseClockifyDate);

    if (!parsedStartDate.equals(parsedEndDate))
      throw new Error(
        `Timers spanning multiple days are not supported. ${JSON.stringify(row)}`
      );

    addDuration(parsedStartDate, parsedDuration, description);
  }

  return timeStore;
}
