import type { ClockifyReport } from 'types/clockify';

export function formatRow(row: ClockifyReport) {
  return `Start date: ${row['Start Date']}, End date: ${row['End Date']}, Start time: ${
    row['Start Time']
  }, End time: ${row['End Time']}, Duration: ${row['Duration (h)']}h, Description: ${
    row['Description'] || 'Unspecified'
  }`;
}
