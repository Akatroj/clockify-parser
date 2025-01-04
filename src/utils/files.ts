import { readFile, stat } from 'node:fs/promises';

export async function parseJSON<T>(path: string): Promise<T> {
  const file = await readFile(path, 'utf-8');

  return JSON.parse(file) as T;
}

export function exists(path: string): Promise<boolean> {
  return stat(path)
    .then(() => true)
    .catch(() => false);
}

const OUT_DIR = 'out';

export function getOutPath(filename: string) {
  return `${process.cwd()}/${OUT_DIR}/${filename}`;
}
