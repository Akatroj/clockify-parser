import { writeFile } from 'fs/promises';
import { utils, write } from '@e965/xlsx';
import type { WorkBook } from '@e965/xlsx';
import type { MonthlyOutput } from '../types';

export async function toXLSX(data: Record<string, MonthlyOutput>) {
  const flattenedObject = Object.entries(data).map(([date, obj]) => ({ date, ...obj }));
  const worksheet = utils.json_to_sheet(flattenedObject);
  const workbook: WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: ArrayBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });

  await writeFile(`${process.cwd()}/out/results.xlsx`, Buffer.from(excelBuffer));
}

export async function saveJSON<T>(data: T, filename: string) {
  await writeFile(`${process.cwd()}/out/${filename}.json`, JSON.stringify(data));
}
