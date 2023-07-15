import * as clc from 'cli-color';
import { Move, Position } from './move';
import { Player, PlayerJSON } from './player';
import { Language, Tile, TileJSON, TileLanguage } from './tile';
import { count, getPositionsFromInput } from './util';
export const mapSize = 5;

export type GameInstanceJSON = {
  turn: number;
  map: TileJSON[];
  player: PlayerJSON;
};

export class GameInstance {
  constructor(public turn: number, public map: Tile[], public player: Player) {}

  static new() {
    const turn = 1;
    const map = Array(mapSize * mapSize)
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
    const collectedTile: { name: TileLanguage; count: number }[] = count(
      move.tiles.map((tile) => tile.language),
    );
    collectedTile.forEach((group) => {
      if (group.count >= 3) {
        this.player.property.level[group.name]++;
      }
    });
    move.tiles.forEach((tile) => tile.reset()),
      (this.player.position = move.positions[move.positions.length - 1]);
  }

  show() {
    const circle = '\u2B24';
    const colors = [
      clc.red,
      clc.green,
      clc.blue,
      clc.yellow,
      clc.magenta,
      clc.cyan,
    ];
    console.log('Turn:', this.turn);
    const id = this.map
      .map((tile) => Language.toId(tile.language))
      .map((id) => colors[id](circle));
    id[this.player.position.toIndex()] = clc.white(circle);
    for (let i = 0; i < mapSize; i++) {
      console.log(id.slice(i * mapSize, (i + 1) * mapSize).join(' '));
    }
    // console.log(this.player);
    console.log(
      Language.data.map(
        (lang, i) =>
          `${colors[i](circle)} : ${this.player.property.level[lang]}`,
      ),
    );
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
