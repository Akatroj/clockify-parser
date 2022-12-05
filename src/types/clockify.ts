export type ClockifyDate = `${string}/${string}/${string}`;
export type ClockifyTime = `${string}:${string}:${string}`;

export type ClockifySheet = {
  Project?: string;
  Client?: string;
  Description?: string;
  Task?: string;
  User?: string;
  Group: undefined;
  Email: string;
  Tags: undefined;
  Billable: 'Yes' | 'No';
  ['Start Date']: ClockifyDate;
  ['Start Time']: ClockifyTime;
  ['End Date']: ClockifyDate;
  ['End Time']: ClockifyTime;
  ['Duration (h)']: ClockifyTime;
  ['Duration (decimal)']: number;
};
