import { Move, Position } from './move';
import { Player, PlayerJSON } from './player';
import { Language, Tile, TileJSON, TileLanguage } from './tile';
import { count, input, inputToMove } from './util';

export const mapSize = 7;

export type GameJSON = {
  turn: number;
  map: TileJSON[];
  player: PlayerJSON;
};

export class Game {
  constructor(public turn: number, public map: Tile[], public player: Player) {}

  static new() {
    const turn = 1;
    const map = Array(mapSize * mapSize)
      .fill(null)
      .map(Tile.random);
    const player = Player.random();
    return new Game(turn, map, player);
  }

  async play() {
    console.clear();
    this.show();
    try {
      const str = await input('Move: ');
      const positions: Position[] = inputToMove(str, this.player);
      this.movePlayer(positions);
      this.turn++;
    } catch (error) {
      return;
    }
  }

  movePlayer(positions: Position[]) {
    const move = new Move(
      positions.map((p) => p.toIndex()),
      this.player,
      this.map,
    );
    const collectedTile: { name: TileLanguage; count: number }[] = count(
      move.tiles.map((tile) => tile.language),
    );
    collectedTile.forEach((group) => {
      if (group.count >= 3) {
        this.player.property.level[group.name]++;
      }
    });
    move.tiles.forEach((tile) => tile.reset()),
      (this.player.position = positions[positions.length - 1]);
  }

  show() {
    console.log('Turn:', this.turn);
    const id: string[] = this.map.map((tile) =>
      Language.toId(tile.language).toString(),
    );
    id[this.player.position.toIndex()] = 'P';
    for (let i = 0; i < mapSize; i++) {
      console.log(id.slice(i * mapSize, (i + 1) * mapSize).join(' '));
    }
    console.log(this.player);
  }

  static fromJson(json: GameJSON): Game {
    const game = new Game(
      json.turn,
      json.map.map(Tile.fromJson),
      Player.fromJson(json.player),
    );
    return game;
  }

  toJson(): GameJSON {
    return {
      turn: this.turn,
      map: this.map.map((tile) => tile.toJson()),
      player: this.player.toJson(),
    };
  }
}
