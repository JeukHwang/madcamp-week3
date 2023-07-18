import * as clc from 'cli-color';
import type { EventTitle } from '../event/events';
import { findEventByName } from '../event/events';
import type { WeeklyGoalData } from '../event/주간_목표';
import { randomWeeklyGoal } from '../event/주간_목표';
import { GameConstant } from './constant';
import type { GameEvent, GameEventJSON } from './event';
import { StartOfWeek } from './event';
import type { PositionJSON } from './move';
import { Move, Position } from './move';
import type { PlayerJSON } from './player';
import { Player } from './player';
import type { TileJSON, TileLanguage } from './tile';
import { Language, Tile } from './tile';
import { countArray, logAndPrint, weightedRandom } from './util';

export type EventApplyResult =
  | { applied: false }
  | { applied: true; responseApplied: null }
  | { applied: true; responseApplied: false }
  | { applied: true; responseApplied: true; optionApplied: boolean };

export type RequestInput =
  | { type: 'number'; min: number; max: number; event: GameEventJSON }
  | { type: 'positions' };
export type ResponseInput =
  | { type: 'number'; data: number }
  | { type: 'positions'; data: PositionJSON[] };
export type GameInput = number | Position[];

type GameStatus =
  | {
      type: 'beginTurn' | 'randomEvent' | 'movePlayer' | 'endTurn' | 'endGame';
    }
  | { type: 'applyEvent'; data: EventTitle };

export type GameProperty = {
  turn: number;
  isFinished: boolean;
  requestInput: RequestInput;
  weeklyGoalData: WeeklyGoalData;
  status: GameStatus[];
  input: ResponseInput | null;
};

export type GameInstanceJSON = {
  property: GameProperty;
  map: TileJSON[];
  player: PlayerJSON;
};

export class GameInstance {
  constructor(
    public property: GameProperty,
    public map: Tile[],
    public player: Player,
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
        weeklyGoalData: null as unknown as WeeklyGoalData,
        status: [],
        input: null,
      },
      map,
      player,
    );
  }

  getMoveFromPositions(positions: Position[]) {
    return new Move(
      positions.map((p) => p.toIndex()),
      this.player,
      this.map,
    );
  }

  tryApplyEvent(event: GameEvent): EventApplyResult {
    const requestInput: RequestInput = {
      type: 'number',
      min: 0,
      max: event.options.length - 1,
      event: event.toJson(this),
    };
    if (event.canApply(this)) {
      const response = this.getResponse();
      if (response === null) {
        this.setRequest(requestInput);
        return { applied: true, responseApplied: null };
      }
      const result = event.apply(this, response as number);
      if (result === null) {
        this.setRequest(requestInput);
        return { applied: true, responseApplied: false };
      }
      return { applied: true, responseApplied: true, optionApplied: result };
    }
    return { applied: false };
  }

  playStep() {
    while (true) {
      if (this.property.status.length === 0) {
        this.property.status = [
          { type: 'beginTurn' },
          { type: 'randomEvent' },
          { type: 'movePlayer' },
          { type: 'applyEvent', data: '성장' },
          { type: 'applyEvent', data: '주간 목표' },
          { type: 'endTurn' },
        ];
      }
      const item = this.property.status.shift()!;
      switch (item.type) {
        case 'beginTurn': {
          this.player.property.health = GameConstant.defaultHealth;
          // Set random weekly goal at the start of the week
          if (StartOfWeek(this)) {
            this.property.weeklyGoalData = randomWeeklyGoal(this);
          }
          break;
        }
        case 'movePlayer': {
          // Move player
          const response = this.getResponse();
          if (response === null) {
            this.setRequest({ type: 'positions' });
            this.property.status.unshift(item);
            return 'movePlayer no response';
          }
          try {
            const move = this.getMoveFromPositions(response as Position[]);
            this.movePlayer(move);
          } catch (error) {
            this.setRequest({ type: 'positions' });
            this.property.status.unshift(item);
            return 'movePlaye invalid response';
          }
          break;
        }
        case 'randomEvent': {
          const weight: [EventTitle, number][] = [
            ['변화의 물결', 0.5],
            ['밥은 먹고 다니니', 1],
          ];
          // Random event
          const appliableEvents = weight
            .map((e): [GameEvent, number] => [findEventByName(e[0]), e[1]])
            .filter((e) => e[0].canApply(this));
          if (appliableEvents.length === 0) {
            break;
          }
          const eventTitle =
            appliableEvents[weightedRandom(appliableEvents.map((e) => e[1]))][0]
              .title;
          this.property.status.unshift({
            type: 'applyEvent',
            data: eventTitle,
          });
          break;
        }
        case 'applyEvent': {
          // Apply event
          const eventResult = this.tryApplyEvent(findEventByName(item.data));
          if (eventResult.applied && eventResult.responseApplied !== true) {
            this.property.status.unshift(item);
            return 'event needs response';
          }
          break;
        }
        case 'endTurn': {
          // End turn
          this.property.turn++;
          break;
        }
        case 'endGame': {
          // End game
          this.property.isFinished = true;
          return 'endGame';
        }
        default:
          break;
      }
    }
  }

  movePlayer(move: Move) {
    if (this.player.property.health < move.indices.length) {
      throw new Error('Player health is not enough');
    }
    this.player.property.health -= move.indices.length;
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
    logAndPrint('[ 규칙 ]');
    logAndPrint(
      `- 하루에 타일 ${GameConstant.experienceThreshold}개를 모으면 경험치 +1`,
    );
    logAndPrint(
      `- 경험치 ${GameConstant.levelThreshold} 모은 후 <성장> 이벤트를 통해 경력 +1`,
    );
    logAndPrint('');
    logAndPrint('[ 금주의 목표 ]');
    if (this.property.weeklyGoalData.include.length === 0) {
      console.log(
        `${this.property.weeklyGoalData.number}개 이상의 언어를 활동할 수 있는 개발자가 되자.`,
      );
    } else {
      console.log(
        `${this.property.weeklyGoalData.include.join(', ')}를 포함하여 ${
          this.property.weeklyGoalData.number
        }개 이상의 언어를 활동할 수 있는 개발자가 되자.`,
      );
    }
    logAndPrint('');
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
    logAndPrint(
      `체력 : ${this.player.property.health} | 돈 : ${this.player.property.money}`,
    );
    logAndPrint('');
  }

  static fromJson(json: GameInstanceJSON): GameInstance {
    const game = new GameInstance(
      json.property,
      json.map.map(Tile.fromJson),
      Player.fromJson(json.player),
    );
    return game;
  }

  toJson(): GameInstanceJSON {
    return {
      property: this.property,
      map: this.map.map((tile) => tile.toJson()),
      player: this.player.toJson(),
    };
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
    this.property.input = input;
  }

  private getResponse(): GameInput | null {
    const input = this.property.input;
    this.property.input = null;
    if (input === null) {
      return null;
    }
    switch (input.type) {
      case 'positions':
        return (input.data as PositionJSON[]).map((p) => Position.fromJson(p));
      case 'number':
        return input.data as number;
    }
  }
}
