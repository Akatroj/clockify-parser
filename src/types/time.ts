import { Temporal } from '@js-temporal/polyfill';

export type TimeByDay = {
  [year: number]: {
    [month: number]: {
      [day: number]: {
        duration: Temporal.Duration;
        comment: string;
      };
    };
  };
};

type YearMonth = `${string}-${string}`;

export type PaidLeave = {
  [yearMonth: YearMonth]: number;
};

export type PartTimeInterval = {
  from: Temporal.PlainYearMonth;
  to: Temporal.PlainYearMonth;
  value: number;
};

export type PartTimeInputInterval = {
  from: YearMonth;
  to: YearMonth;
  value: number;
};

export type HoursByMonth = {
  [year: string]: {
    [month: string]: number;
  };
};
