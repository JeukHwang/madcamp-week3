import { Position } from './move';
import { Language, TileLanguage } from './tile';

type PlayerProperty = {
  move: number;
  level: { [key in TileLanguage]: number };
};
export class Player {
  public property: PlayerProperty;
  constructor(public position: Position) {
    this.property = {
      move: 5,
      level: Object.fromEntries(Language.data.map((s) => [s, 0])) as {
        [k in TileLanguage]: number;
      },
    };
  }

  static random(): Player {
    return new Player(Position.random());
  }
}
