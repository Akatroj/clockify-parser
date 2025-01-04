import type { PaidLeave, PartTimeInputInterval, PartTimeInterval } from 'types/time';
import { exists, parseJSON } from 'utils/files';
import { parseIntervals } from './partTime/parseIntervals';
import type { ClockifyReport } from 'types/clockify';
import { readFile } from 'node:fs/promises';
import { readCSV, readXLSX } from './clockifyReport/readReport';

export function loadFiles(
  partTimePath: string,
  paidLeavePath: string,
  reportPath: string | undefined
) {
  const partTimeFile = loadPartTimeFile(partTimePath);
  const vacationFile = loadVacationFile(paidLeavePath);
  const clockifyFile = reportPath ? loadClockifyFile(reportPath) : undefined;

  return Promise.all([clockifyFile, partTimeFile, vacationFile]);
}

async function loadPartTimeFile(
  partTimePath: string
): Promise<PartTimeInterval[] | undefined> {
  if (await exists(partTimePath)) {
    return await parseJSON<PartTimeInputInterval[]>(partTimePath).then(parseIntervals);
  } else console.log('No part time intervals provided');
}

async function loadVacationFile(paidLeavePath: string): Promise<PaidLeave | undefined> {
  if (await exists(paidLeavePath)) {
    return await parseJSON<PaidLeave>(paidLeavePath);
  } else console.log('No paid leave days provided');
}

async function loadClockifyFile(reportPath: string): Promise<ClockifyReport[]> {
  let reportFile: string | Buffer | undefined;

  if (!(await exists(reportPath))) throw new Error('File not found');

  switch (reportPath.split('.').at(-1)) {
    case 'csv':
      reportFile = await readFile(reportPath, 'utf-8');
      return readCSV(reportFile);
    case 'xlsx':
      reportFile = await readFile(reportPath);
      return readXLSX(reportFile);
    default:
      throw new Error('Invalid file extension');
  }
}
