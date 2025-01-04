import { read, utils } from '@e965/xlsx';
import { parse } from 'csv-parse';

import type { ClockifyReport } from 'types/clockify';

export async function readXLSX(data: Buffer) {
  const workbook = read(data, { type: 'buffer', cellDates: true, dateNF: 'dd/mm/yyyy' });

  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];

  const json = utils.sheet_to_json<ClockifyReport>(worksheet, {
    defval: undefined,
    raw: false,
  });

  return json;
}

export async function readCSV(data: string) {
  const records = await new Promise<ClockifyReport[]>((resolve, reject) => {
    parse(data, { columns: true }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  return records;
}
