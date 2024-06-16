import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
import { program } from 'commander';
import clear from 'console-clear';

import { parseIntervals, parseDetailedReport, parseJSON, parseXLSX } from './input';
import { saveJSON, toMonthly, toXLSX } from './output';

import type { Options, PaidLeave, PartTimeInputInterval } from './types';

import 'dotenv/config';

Date.prototype.toTemporalInstant = toTemporalInstant;

program
  .requiredOption('-i, --input <path>', 'Path to the XLSX file')
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

const { input, partTimeRanges, paidLeave } = program.opts<Options>();

const partTime = partTimeRanges
  ? await parseJSON<PartTimeInputInterval[]>(partTimeRanges).then(parseIntervals)
  : undefined;

const vacation = paidLeave ? await parseJSON<PaidLeave>(paidLeave) : undefined;

const clockifySheet = await parseXLSX(input);
const parsedDurations = parseDetailedReport(clockifySheet);

const report = toMonthly(parsedDurations, partTime, vacation);

toXLSX(report);

saveJSON(parsedDurations, 'timeStore');
