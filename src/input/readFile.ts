import { read, utils } from 'xlsx';
import { readFile, stat } from 'fs/promises';
import { parse } from 'csv-parse';

import type { ClockifySheet } from '../types';

export async function parseXLSX(path: string) {
  const file = await readFile(path);

  const workbook = read(file, { type: 'buffer', cellDates: true, dateNF: 'dd/mm/yyyy' });
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];

  const json = utils.sheet_to_json<ClockifySheet>(worksheet, {
    defval: undefined,
    raw: false,
  });

  return json;
}

export async function parseJSON<T>(path: string) {
  const file = await readFile(path, 'utf-8');

  return JSON.parse(file) as T;
}

export async function parseCSV(path: string) {
  const file = await readFile(path, 'utf-8');

  const records = await new Promise<ClockifySheet[]>((resolve, reject) => {
    parse(file, { columns: true }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  return records;
}

export function exists(path: string) {
  return stat(path)
    .then(() => true)
    .catch(() => false);
}
