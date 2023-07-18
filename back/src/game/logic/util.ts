import { randomInt } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { clearLine, createInterface, moveCursor } from 'readline';
import { GameConstant } from './constant';
import type { RequestInput, ResponseInput } from './game';

export function isArrayUnique<T>(array: Array<T>): boolean {
  return new Set(array).size === array.length;
}

export function getRandomElement<T>(array: Array<T>): T {
  return array[randomInt(0, array.length)];
}

export function range(n: number) {
  return [...Array(n).keys()];
}

export function input(msg: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(msg, (ans) => {
      rl.close();
      logAndPrint(msg + ans);
      resolve(ans);
    }),
  );
}

export function erase() {
  moveCursor(process.stdout, 0, -1); // up one line
  clearLine(process.stdout, 1); // from cursor to end
}

export function countArray<T>(data: T[]): { name: T; count: number }[] {
  return Array.from(new Set(data)).map((value) => ({
    name: value,
    count: data.filter((v) => v === value).length,
  }));
}

// https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node/43370201#43370201
const fileName = GameConstant.uniqueLog
  ? `log_${new Date().toISOString()}.txt`
  : `log.txt`;
const filePath = path.join(__dirname, '../../../log', fileName);
mkdirSync(path.join(__dirname, '../../../log'), { recursive: true });
writeFileSync(filePath, '', { flag: 'w' });
export function log(msg: string) {
  if (GameConstant.preserveLog) {
    console.log(msg);
    writeFileSync(filePath, msg + '\n', { flag: 'a' });
  }
}

export function logAndPrint(msg: string) {
  //   log(msg);
  console.log(msg);
}

export function* requestYield(
  request: RequestInput,
): Generator<RequestInput, ResponseInput, ResponseInput> {
  yield request;
  const data: ResponseInput = yield request;
  logAndPrint('requestYield_data ' + JSON.stringify(data));
  return data;
}

export async function responseYield1(
  generator: AsyncGenerator<RequestInput, any, ResponseInput>,
): Promise<RequestInput> {
  const step = await generator.next();
  return step.value;
}

export async function responseYield2(
  generator: AsyncGenerator<RequestInput, any, ResponseInput>,
  response: ResponseInput,
): Promise<boolean> {
  console.log('Before:', response);
  const result = await generator.next(response);
  await generator.next(); // make sure the generator is done
  console.log('After:', response);
  return result.done ? true : false;
}
