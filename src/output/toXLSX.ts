import { utils, write } from 'xlsx';
import { writeFile } from 'fs/promises';
import { MonthlyOutput } from '../types';

export async function toXLSX(data: Record<string, MonthlyOutput>) {
  const flattenedObject = Object.entries(data).map(([date, obj]) => ({ date, ...obj }));
  const worksheet = utils.json_to_sheet(flattenedObject);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: ArrayBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });

  await writeFile(`${process.cwd()}/data/results.xlsx`, Buffer.from(excelBuffer));
}
