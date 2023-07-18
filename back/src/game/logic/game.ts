import * as clc from 'cli-color';
import { findEventByName } from '../event/events';
import { GameConstant } from './constant';
import type { GameEventJSON } from './event';
import type { PositionJSON } from './move';
import { Move, Position } from './move';
import type { PlayerJSON } from './player';
import { Player } from './player';
import type { TileJSON, TileLanguage } from './tile';
import { Language, Tile } from './tile';
import { countArray, logAndPrint } from './util';

export type EventApplyResult =
  | { applied: false }
  | { applied: true; optionApplied: boolean };

export type RequestInput =
  | { type: 'number'; min: number; max: number; event: GameEventJSON }
  | { type: 'positions' };
export type ResponseInput =
  | { type: 'number'; data: number }
  | { type: 'positions'; data: PositionJSON[] };
export type GameInput = number | Position[];
export type GameInputQueue = ResponseInput[];

export type GameProperty = {
  turn: number;
  isFinished: boolean;
  requestInput: RequestInput;
};

export type GameInstanceJSON = {
  inputQueue: GameInputQueue;
  property: GameProperty;
  map: TileJSON[];
  player: PlayerJSON;
};

export class GameInstance {
  public inputQueueIndex = 0;
  constructor(
    public property: GameProperty,
    public map: Tile[],
    public player: Player,
    public inputQueue: GameInputQueue,
  ) {}

  static new() {
    const map = Array(GameConstant.mapSize * GameConstant.mapSize)
      .fill(null)
      .map(Tile.random);
    const player = Player.random();
    return new GameInstance(
      {
        turn: 0,
        isFinished: false,
        requestInput: null as unknown as RequestInput,
      }, // TODO: neededInputType
      map,
      player,
      [],
    );
  }

  getMoveFromPositions(positions: Position[]) {
    return new Move(
      positions.map((p) => p.toIndex()),
      this.player,
      this.map,
    );
  }

  tryApplyEvent(eventName: string): EventApplyResult | null {
    const event = findEventByName(eventName);
    if (event.canApply(this)) {
      console.clear();
      this.show();
      event.show(this);
      const response = this.getResponse();
      if (response === null) {
        this.setRequest({
          type: 'number',
          min: 0,
          max: event.options.length - 1,
          event: event.toJson(this),
        });
        return null;
      }
      const result = event.apply(this, response as number);
      if (result === null) {
        this.inputQueue.pop();
        this.setRequest({
          type: 'number',
          min: 0,
          max: event.options.length - 1,
          event: event.toJson(this),
        });
        return null;
      }
      return { applied: true, optionApplied: result };
    }
    return { applied: false };
  }

  playStep() {
    while (true) {
      const backup = this.toJson();
      this.inputQueueIndex = 0;
      console.clear();
      this.show();
      try {
        const response = this.getResponse();
        if (!response) {
          this.rewind(backup);
          this.setRequest({
            type: 'positions',
          });
          return 1;
        }
        const move = this.getMoveFromPositions(response as Position[]);
        this.movePlayer(move);
      } catch (error) {
        this.rewind(backup);
        this.inputQueue.pop();
        this.setRequest({
          type: 'positions',
        });
        return 2;
      }

      if (
        this.property.turn % GameConstant.bigTurn ===
        GameConstant.bigTurn - 1
      ) {
        const eventResult = this.tryApplyEvent('한 주의 마무리와 시작');
        if (eventResult === null) {
          this.rewind(backup);
          return 3;
        } else if (!eventResult.applied || !eventResult.optionApplied) {
          this.finish();
          return 4;
        }
      }
      this.property.turn++;
      this.inputQueue = [];
    }
  }

  movePlayer(move: Move) {
    const collectedTile = move.tiles.map((tile) => tile.language);
    this.updateExperience(collectedTile);
    move.tiles.forEach((tile) => tile.reset());
    this.player.position = move.positions[move.positions.length - 1];
  }

  updateExperience(collectedTile: TileLanguage[]) {
    const { experience } = this.player.property;
    countArray(collectedTile).forEach(({ name, count }) => {
      experience[name] += Math.floor(count / GameConstant.experienceThreshold);
    });
  }

  show() {
    logAndPrint('[ 핵심 규칙 ]');
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
    const day = ['월', '화', '수', '목', '금', '토', '일'][
      this.property.turn % GameConstant.bigTurn
    ];
    logAndPrint(
      `[ ${
        Math.floor(this.property.turn / GameConstant.bigTurn) + 1
      }주차 ${day}요일 ]\n`,
    );
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
    const { experience: exp, level, levelEnabled } = this.player.property;
    logAndPrint(
      Language.data
        .map((lang, i) => {
          const language = `${circle} ${lang.padEnd(10)}`;
          const experience_ = `경험치 ${exp[lang].toString().padStart(2)}`;
          const levelColor = levelEnabled[lang] ? colors[i] : clc.blackBright;
          const level_ =
            level[lang] === 0
              ? ''
              : `| ${level[lang].toString().padStart(2)}주차 개발자`;
          return colors[i](
            `${language} : ${experience_} ${levelColor(level_)}`,
          );
        })
        .join('\n'),
    );
    logAndPrint('');
  }

  static fromJson(json: GameInstanceJSON): GameInstance {
    const game = new GameInstance(
      json.property,
      json.map.map(Tile.fromJson),
      Player.fromJson(json.player),
      json.inputQueue,
    );
    return game;
  }

  toJson(): GameInstanceJSON {
    return {
      property: this.property,
      map: this.map.map((tile) => tile.toJson()),
      player: this.player.toJson(),
      inputQueue: this.inputQueue,
    };
  }

  finish() {
    this.property.isFinished = true;
    this.show();
    logAndPrint('개발자로 활동할 수 없게 되었습니다...');
    process.exit();
  }

  private setRequest(requestInput: RequestInput): void {
    this.property.requestInput = requestInput;
  }

  public getRequest(): RequestInput {
    return this.property.requestInput;
  }

  public setResponse(input: ResponseInput): void {
    const request = this.getRequest();
    const isValid = request.type === input.type;
    if (!isValid) {
      throw new Error('Invalid Response');
    }
    this.inputQueue.push(input);
  }
  private getResponse(): GameInput | null {
    if (this.inputQueueIndex >= this.inputQueue.length) {
      return null;
    }
    const response = this.inputQueue[this.inputQueueIndex++];
    switch (response.type) {
      case 'positions':
        return (response.data as PositionJSON[]).map((p) =>
          Position.fromJson(p),
        );
      case 'number':
        return response.data as number;
    }
  }

  private rewind(backup: GameInstanceJSON) {
    // do not handle, inputQueue and property.requestInput
    this.property = {
      ...backup.property,
      requestInput: this.property.requestInput,
    };
    this.map = backup.map.map((tile) => Tile.fromJson(tile));
    this.player = Player.fromJson(backup.player);
  }
}
