import * as clc from 'cli-color';
import { findEventByName } from '../event/events';
import { GameConstant } from './constant';
import type { Position } from './move';
import { Move } from './move';
import type { PlayerJSON } from './player';
import { Player } from './player';
import type { TileJSON, TileLanguage } from './tile';
import { Language, Tile } from './tile';
import { countArray, logAndPrint } from './util';

type EventApplyResult =
  | { applied: false }
  | { applied: true; optionApplied: boolean };
type RequestInput =
  | { type: 'number'; min: number; max: number }
  | { type: 'positions' };
type ResponseInput = number | Position[];

export type GameInstanceJSON = {
  turn: number;
  map: TileJSON[];
  player: PlayerJSON;
};

export class GameInstance {
  constructor(public turn: number, public map: Tile[], public player: Player) {}

  static new() {
    const turn = 0;
    const map = Array(GameConstant.mapSize * GameConstant.mapSize)
      .fill(null)
      .map(Tile.random);
    const player = Player.random();
    return new GameInstance(turn, map, player);
  }

  async getMoveFromPositions(positions: Position[]) {
    return new Move(
      positions.map((p) => p.toIndex()),
      this.player,
      this.map,
    );
  }

  *tryApplyEvent(
    eventName: string,
  ): Generator<RequestInput, EventApplyResult, ResponseInput> {
    const event = findEventByName(eventName);
    if (event.canApply(this)) {
      console.clear();
      this.show();
      event.show(this);
      while (true) {
        //   const choice = await getIntegerFromInput(0, event.options.length - 1);
        const choice: number = (yield {
          type: 'number',
          min: 0,
          max: event.options.length - 1,
        }) as number;
        const result = event.apply(this, choice);
        if (result === null) {
          continue;
        }
        return { applied: true, optionApplied: result };
        // yield {
        //   type: 'return',
        //   data: { applied: true, optionApplied: result },
        // };
      }
    }
    // yield { type: 'return', data: { applied: false } };
    return { applied: false };
  }

  async *playStep(): AsyncGenerator<RequestInput, void, ResponseInput> {
    if (this.turn % 4 === 0) {
      yield* this.tryApplyEvent('새로운 시작');
    }

    console.clear();
    this.show();
    while (true) {
      try {
        const positions: Position[] = (yield {
          type: 'positions',
        }) as Position[];
        const move = await this.getMoveFromPositions(positions);
        this.movePlayer(move);
        this.turn++;
        break;
      } catch (error) {
        continue;
      }
    }

    if (this.turn % 4 === 0) {
      yield* this.tryApplyEvent('한 해의 마무리');
    }
  }

  movePlayer(move: Move) {
    const collectedTile = move.tiles.map((tile) => tile.language);
    this.updateExperience(collectedTile);
    move.tiles.forEach((tile) => tile.reset()),
      (this.player.position = move.positions[move.positions.length - 1]);
  }

  updateExperience(collectedTile: TileLanguage[]) {
    const { experience } = this.player.property;
    countArray(collectedTile).forEach(({ name, count }) => {
      experience[name] += Math.floor(count / GameConstant.experienceThreshold);
    });
  }

  show() {
    const smallCircle = ' \u25CF';
    const circle = '\u2B24 ';
    const colors = [
      clc.red,
      clc.green,
      clc.blue,
      clc.yellow,
      clc.magenta,
      clc.cyan,
    ];
    logAndPrint(
      `[ ${new Date().getFullYear() + Math.floor(this.turn / 4)}년도 ${
        (this.turn % 4) + 1
      }분기 ]`,
    );
    logAndPrint('');
    const id = this.map
      .map((tile) => Language.toId(tile.language))
      .map((id) => colors[id](circle));
    id[this.player.position.toIndex()] = clc.white(smallCircle);
    for (let i = 0; i < GameConstant.mapSize; i++) {
      logAndPrint(
        id
          .slice(i * GameConstant.mapSize, (i + 1) * GameConstant.mapSize)
          .join(''),
      );
    }
    // logAndPrint(this.player);
    logAndPrint('');
    const { experience: exp, level } = this.player.property;
    logAndPrint(
      Language.data
        .map((lang, i) => {
          const language = `${circle} ${lang.padEnd(10)}`;
          const experience_ = `경험치 ${exp[lang].toString().padStart(2)}`;
          const level_ =
            level[lang] === 0
              ? ''
              : `${level[lang].toString().padStart(2)}년차 개발자`;
          return colors[i](`${language} : ${experience_} ${level_}`);
        })
        .join('\n'),
    );
    logAndPrint('');
  }

  static fromJson(json: GameInstanceJSON): GameInstance {
    const game = new GameInstance(
      json.turn,
      json.map.map(Tile.fromJson),
      Player.fromJson(json.player),
    );
    return game;
  }

  toJson(): GameInstanceJSON {
    return {
      turn: this.turn,
      map: this.map.map((tile) => tile.toJson()),
      player: this.player.toJson(),
    };
  }
}
