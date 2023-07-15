import * as clc from 'cli-color';
import { Move, Position } from './move';
import { Player, PlayerJSON } from './player';
import { Language, Tile, TileJSON, TileLanguage } from './tile';
import { countArray, getPositionsFromInput } from './util';

export type GameInstanceJSON = {
  turn: number;
  map: TileJSON[];
  player: PlayerJSON;
};

export class GameInstance {
  static mapSize = 5;
  static defaultHealth = 5;
  static experienceThreshold = 2;

  constructor(public turn: number, public map: Tile[], public player: Player) {}

  static new() {
    const turn = 1;
    const map = Array(GameInstance.mapSize * GameInstance.mapSize)
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

  async playStep(move: Move) {
    this.movePlayer(move);
    this.turn++;
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
      experience[name] = Math.floor(count / GameInstance.experienceThreshold);
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
    console.log(
      `${new Date().getFullYear() + Math.floor(this.turn / 4)}년도 ${
        this.turn % 4
      }분기`,
    );
    console.log('');
    const id = this.map
      .map((tile) => Language.toId(tile.language))
      .map((id) => colors[id](circle));
    id[this.player.position.toIndex()] = clc.white(smallCircle);
    for (let i = 0; i < GameInstance.mapSize; i++) {
      console.log(
        id
          .slice(i * GameInstance.mapSize, (i + 1) * GameInstance.mapSize)
          .join(''),
      );
    }
    // console.log(this.player);
    console.log('');
    const { experience: exp, level } = this.player.property;
    console.log(
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
    console.log('');
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

export async function playGameFromCLI() {
  let game = GameInstance.new();
  while (true) {
    console.clear();
    game.show();
    let move: Move;
    try {
      const positions = await getPositionsFromInput(game.player);
      move = await game.getMoveFromPositions(positions);
    } catch (e) {
      continue;
    }
    await game.playStep(move);
    game = GameInstance.fromJson(game.toJson());
  }
}
