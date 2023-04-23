import { toTemporalInstant } from '@js-temporal/polyfill';
import { program } from 'commander';
import clear from 'console-clear';

import { parseIntervals, parseSheet, readJSON, readSheet } from './input';
import { saveJSON, toMonthly, toXLSX } from './output';

import type { Options, PaidLeave, PartTimeInputInterval } from './types';

import 'dotenv/config';

Date.prototype.toTemporalInstant = toTemporalInstant;

program
  .requiredOption('-i, --input <path>', 'Path to the XLSX file')
  .option('--part-time-ranges <path>', 'Path to a JSON file containing part time ranges')
  .option('--paid-leave <path>', 'Path to a JSON file containing paid leave days')
  .parse();

const { input, partTimeRanges, paidLeave } = program.opts<Options>();

const partTime = partTimeRanges
  ? await readJSON<PartTimeInputInterval[]>(partTimeRanges).then(parseIntervals)
  : undefined;

const vacation = paidLeave ? await readJSON<PaidLeave>(paidLeave) : undefined;

clear();
const clockifySheet = await readSheet(input);
const durations = parseSheet(clockifySheet);

const report = toMonthly(durations, partTime, vacation);

toXLSX(report);

saveJSON(durations, 'timeStore');

// getDetailedReport(
//   Temporal.PlainDate.from('2022-03-14'),
//   Temporal.PlainDate.from('2023-04-22')
// );
