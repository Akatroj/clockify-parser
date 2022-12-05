import { Temporal } from '@js-temporal/polyfill';

export type TimeByDay = {
  [year in number]: {
    [month in number]: {
      [day in number]: {
        duration: Temporal.Duration;
        comment: string;
      };
    };
  };
};

export type YearMonthInterval = {
  from: Temporal.PlainYearMonth;
  to: Temporal.PlainYearMonth;
};

export type HoursByMonth = {
  [year in string]: {
    [month in string]: number;
  };
};
