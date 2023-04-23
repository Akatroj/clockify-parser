import { read, utils } from 'xlsx';
import { readFile } from 'fs/promises';

import type { ClockifySheet } from '../types';

export async function readSheet(path: string) {
  const file = await readFile(path);

  const workbook = read(file, { type: 'buffer' });
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];

  const json = utils.sheet_to_json<ClockifySheet>(worksheet, { defval: undefined });

  return json;
}

export async function readJSON<T>(path: string) {
  const file = await readFile(path, 'utf-8');

  return JSON.parse(file) as T;
}
