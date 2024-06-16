import { toTemporalInstant } from '@js-temporal/polyfill';
import { program } from '@commander-js/extra-typings';
import clear from 'console-clear';

import {
  parseIntervals,
  parseDetailedReport,
  parseJSON,
  parseXLSX,
  parseCSV,
  exists,
} from './input';
import { saveJSON, toMonthly, toXLSX } from './output';

import type {
  ClockifySheet,
  PaidLeave,
  PartTimeInputInterval,
  PartTimeInterval,
} from './types';

import 'dotenv/config';

Date.prototype.toTemporalInstant = toTemporalInstant;

const typedProgram = program
  .requiredOption('-i, --input <path>', 'Path to the file with Clockify data. CSV or XLSX.')
  .option(
    '--part-time-ranges <path>',
    'Path to a JSON file containing part time ranges',
    './data/partTime.json'
  )
  .option(
    '--paid-leave <path>',
    'Path to a JSON file containing paid leave days',
    './data/paidLeave.json'
  )
  .parse();

clear();
main();

async function main() {
  const {
    input: inputPath,
    partTimeRanges: partTimePath,
    paidLeave: paidLeavePath,
  } = typedProgram.opts();

  const { clockifySheet, partTime, vacation } = await loadFiles(
    inputPath,
    partTimePath,
    paidLeavePath
  );

  const parsedDurations = parseDetailedReport(clockifySheet);

  const report = toMonthly(parsedDurations, partTime, vacation);

  await toXLSX(report);

  await saveJSON(parsedDurations, 'timeStore');
}

export async function loadFiles(
  reportPath: string,
  partTimePath: string,
  paidLeavePath: string
) {
  let clockifySheet: ClockifySheet[],
    partTime: PartTimeInterval[] | undefined,
    vacation: PaidLeave | undefined;

  switch (reportPath.split('.').at(-1)) {
    case 'csv':
      clockifySheet = await parseCSV(reportPath);
      break;
    case 'xlsx':
      clockifySheet = await parseXLSX(reportPath);
      break;
    default:
      throw new Error('Invalid file extension');
  }

  if (await exists(partTimePath)) {
    partTime = await parseJSON<PartTimeInputInterval[]>(partTimePath).then(parseIntervals);
  } else console.log('No part time intervals provided');

  if (await exists(paidLeavePath)) {
    vacation = await parseJSON<PaidLeave>(paidLeavePath);
  } else console.log('No paid leave days provided');

  return { clockifySheet, partTime, vacation };
}
