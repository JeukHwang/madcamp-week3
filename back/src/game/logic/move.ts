import { ForbiddenException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { mapSize } from './game';
import { Player } from './player';
import { Tile } from './tile';
import { isArrayUnique } from './util';

export class Position {
  constructor(public x: number, public y: number) {
    if (0 <= x && x < mapSize && 0 <= y && y < mapSize) {
      return;
    }
    throw new ForbiddenException('Invalid x, y to make position');
  }

  toIndex(): number {
    return this.x * mapSize + this.y;
  }

  static fromIndex(index: number) {
    if (0 <= index && index < mapSize * mapSize) {
      return new Position(Math.floor(index / mapSize), index % mapSize);
    }
    throw new ForbiddenException('Invalid index to make position');
  }

  static random() {
    return Position.fromIndex(randomInt(0, mapSize * mapSize));
  }
}

export class Move {
  positions: Position[];
  tiles: Tile[];
  constructor(
    public indices: number[],
    public player: Player,
    public map: Tile[],
  ) {
    this.positions = indices.map(Position.fromIndex);
    this.tiles = this.indices.map((index) => this.map[index]);
    if (!this.isValid()) {
      throw new ForbiddenException('Invalid move');
    }
  }

  isValid(): boolean {
    const isUnique = isArrayUnique([this.player.position, this.indices]);
    const isAdjacentMoving = this.positions.every((index, i, positions) => {
      const { x: x1, y: y1 } = positions[i - 1] || this.player.position;
      const { x: x2, y: y2 } = positions[i];
      return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
    });
    const isPossibleMoveNum = this.indices.length <= this.player.property.move;
    return isUnique && isAdjacentMoving && isPossibleMoveNum;
  }
}
