import { Temporal } from '@js-temporal/polyfill';

import type { ClockifySheet, ClockifyDate, TimeByDay } from '../types';

function useTimeStore() {
  const timeStore: TimeByDay = {};

  const addDuration = (
    date: ClockifyDate,
    duration: Temporal.Duration,
    description: string | undefined
  ) => {
    const actualDescription = description || 'Unspecified';

    const [day, month, year] = date.split('/').map(Number);

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

export function parseSheet(sheet: ClockifySheet[]) {
  const { timeStore, addDuration } = useTimeStore();

  for (const row of sheet) {
    const {
      ['Start Date']: startDate,
      ['End Date']: endDate,
      ['Duration (h)']: duration,
      ['Description']: description,
    } = row;
    if (startDate !== endDate)
      throw new Error('Timers spanning multiple days are not supported');

    const [hours, minutes, seconds] = duration.split(':').map(Number);
    const parsedDuration = Temporal.Duration.from({
      hours,
      minutes,
      seconds,
    });

    addDuration(startDate, parsedDuration, description);
  }

  console.log(JSON.stringify(timeStore));
  return timeStore;
}
