import { read, utils } from 'xlsx';
import { readFile } from 'fs/promises';

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
