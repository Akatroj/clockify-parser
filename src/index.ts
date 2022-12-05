import { toTemporalInstant } from '@js-temporal/polyfill';
import { program } from 'commander';
import clear from 'console-clear';

import { parseIntervals, parseSheet, readSheet } from './input';
import { toMonthly, toXLSX } from './output';

import type { Options } from './types';

Date.prototype.toTemporalInstant = toTemporalInstant;

program
  .requiredOption('-i, --input <path>', 'Path to the XLSX file')
  .option('--part-time-ranges [ranges...]')
  .parse();

const { input, partTimeRanges } = program.opts<Options>();

const partTime = partTimeRanges ? parseIntervals(partTimeRanges) : undefined;

clear();
const json = await readSheet(input);
const durations = parseSheet(json);

const report = toMonthly(durations, partTime);

toXLSX(report);
