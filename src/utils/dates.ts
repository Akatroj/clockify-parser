import { Temporal } from '@js-temporal/polyfill';
import type { ClockifyDate, ClockifyDuration, ClockifyTime } from '../types';

export function parseClockifyDate(date: ClockifyDate): Temporal.PlainDate {
  const [day, month, year] = date.split('/').map(Number);
  return Temporal.PlainDate.from({ year, month, day });
}

export function parseClockifyDuration(duration: ClockifyDuration): Temporal.Duration {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return Temporal.Duration.from({ hours, minutes, seconds });
}

export function parseClockifyTime(time: ClockifyTime): Temporal.PlainTime {
  const [hour, minute, second] = time.split(':').map(Number);
  return Temporal.PlainTime.from({ hour, minute, second });
}

export function formatPlainDate(date: Temporal.PlainDate): ClockifyDate {
  return `${date.day}/${date.month}/${date.year}`;
}

export function formatDuration(duration: Temporal.Duration): ClockifyDuration {
  const numberToStr = (n: number) => n.toFixed(0).padStart(2, '0');
  const [hours, minutes, seconds] = [
    duration.hours,
    Math.abs(duration.minutes),
    Math.abs(duration.seconds),
  ].map(numberToStr);

  return `${hours}:${minutes}:${seconds}`;
}

export function formatTime(time: Temporal.PlainTime): ClockifyTime {
  return `${time.hour}:${time.minute}:${time.second}`;
}
