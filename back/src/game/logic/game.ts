import { Move, Position } from './move';
import { Player } from './player';
import { Language, Tile, TileLanguage } from './tile';
import { count, input, inputToMove } from './util';

export const mapSize = 7;

export class Game {
  map: Tile[];
  player: Player;

  constructor() {
    this.map = Array(mapSize * mapSize)
      .fill(null)
      .map(Tile.random);
    this.player = Player.random();
  }

  async play() {
    while (true) {
      console.clear();
      this.show();
      try {
        const str = await input('Move: ');
        const positions: Position[] = inputToMove(str, this.player);
        this.movePlayer(positions);
      } catch (error) {
        continue;
      }
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
    const id: string[] = this.map.map((tile) =>
      Language.toId(tile.language).toString(),
    );
    id[this.player.position.toIndex()] = 'P';
    for (let i = 0; i < mapSize; i++) {
      console.log(id.slice(i * mapSize, (i + 1) * mapSize).join(' '));
    }
    console.log(this.player);
  }
}
