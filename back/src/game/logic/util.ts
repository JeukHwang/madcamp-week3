import { ForbiddenException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { createInterface } from 'readline';
import { Position } from './move';
import { Player } from './player';

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
      resolve(ans);
    }),
  );
}

export async function getPositionsFromInput(
  player: Player,
): Promise<Position[]> {
  const str = await input('Move: ');
  const positions: Position[] = [];
  const chars = str.split('');
  for (const char of chars) {
    const pos = positions[positions.length - 1] || player.position;
    switch (char) {
      case 'w':
        positions.push(new Position(pos.x - 1, pos.y));
        break;
      case 'a':
        positions.push(new Position(pos.x, pos.y - 1));
        break;
      case 's':
        positions.push(new Position(pos.x + 1, pos.y));
        break;
      case 'd':
        positions.push(new Position(pos.x, pos.y + 1));
        break;
      default:
        throw new ForbiddenException('Invalid input');
    }
  }
  return positions;
}

export function count<T>(data: T[]): { name: T; count: number }[] {
  return Array.from(new Set(data)).map((value) => ({
    name: value,
    count: data.filter((v) => v === value).length,
  }));
}
