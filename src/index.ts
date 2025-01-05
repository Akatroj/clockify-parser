import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
import { Option, program } from '@commander-js/extra-typings';
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

const partTimeOption = new Option(
  '--part-time-ranges <path>',
  'Path to a JSON file containing part time ranges'
).default('./data/partTime.json');
const paidLeaveOption = new Option(
  '--paid-leave <path>',
  'Path to a JSON file containing paid leave days'
).default('./data/paidLeave.json');

program
  .command('local')
  .description('Use local report file to generate the report')
  .requiredOption('-i, --input <path>', 'Path to the file with Clockify data. CSV or XLSX.')
  .addOption(partTimeOption)
  .addOption(paidLeaveOption)
  .action(async (_, options) => {
    const {
      input: inputPath,
      partTimeRanges: partTimePath,
      paidLeave: paidLeavePath,
    } = options.opts();

    const [partTime, vacation, clockifySheet] = await loadFiles(
      partTimePath,
      paidLeavePath,
      inputPath
    );
    await generateMonthlyReport(clockifySheet!, partTime, vacation);
  });

program
  .command('api')
  .description('Fetch Clockify data from the API')
  .requiredOption('--start <date>', 'Start date for the report')
  .requiredOption('--end <date>', 'End date for the report')
  .addOption(partTimeOption)
  .addOption(paidLeaveOption)
  .action(async (_, options) => {
    const {
      start: startDate,
      end: endDate,
      partTimeRanges: partTimePath,
      paidLeave: paidLeavePath,
    } = options.opts();

    const [clockifySheet, [partTime, vacation]] = await Promise.all([
      fetchReportFromApi(startDate, endDate),
      loadFiles(partTimePath, paidLeavePath),
    ]);

    await generateMonthlyReport(clockifySheet, partTime, vacation);
  });

clear();
program.parse();

async function generateMonthlyReport(
  clockifySheet: ClockifyReport[],
  partTime?: PartTimeInterval[],
  vacation?: PaidLeave
) {
  const parsedDurations = parseDetailedReport(clockifySheet!);
  const report = toMonthly(parsedDurations, partTime, vacation);
  await saveXLSX(report);
  await saveJSON(parsedDurations, 'timeStore');
}

async function fetchReportFromApi(startDate: string, endDate: string) {
  const apiConfig = await getApiConfig();

  const clockifySheet = getDetailedReport(
    Temporal.PlainDate.from(startDate),
    Temporal.PlainDate.from(endDate),
    'csv',
    apiConfig
  ).then(readCSV);

  return clockifySheet;
}
