import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
import { program } from '@commander-js/extra-typings';
import clear from 'console-clear';

import { getDetailedReport } from 'api/clockifyApi';
import type { ClockifyReport } from 'types/clockify';
import type { PaidLeave, PartTimeInterval } from 'types/time';
import { readCSV } from 'input/clockifyReport/readReport';
import { parseDetailedReport } from 'input/clockifyReport/parseReport';
import { toMonthly } from 'output/toMonthly';
import { saveJSON, saveXLSX } from 'output/saveFile';
import { getApiConfig } from 'utils/configureEnv';
import { loadFiles } from 'input/load';

Date.prototype.toTemporalInstant = toTemporalInstant;

const typedProgram = program
  .option(
    '-i, --input <path>',
    'Path to the file with Clockify data. CSV or XLSX. Optional - will use api if not provided.'
  )
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

  let clockifySheet: ClockifyReport[] | undefined,
    partTime: PartTimeInterval[] | undefined,
    vacation: PaidLeave | undefined;

  [clockifySheet, partTime, vacation] = await loadFiles(
    partTimePath,
    paidLeavePath,
    inputPath
  );

  if (!clockifySheet) {
    clockifySheet = await getDetailedReport(
      new Temporal.PlainDate(2024, 1, 1),
      new Temporal.PlainDate(2024, 12, 26),
      'csv',
      await getApiConfig()
    ).then(readCSV);
  }

  const parsedDurations = parseDetailedReport(clockifySheet!);
  const report = toMonthly(parsedDurations, partTime, vacation);
  await saveXLSX(report);
  await saveJSON(parsedDurations, 'timeStore');
}
