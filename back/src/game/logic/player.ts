import { Inventory, InventoryItem } from './intventory';
import { Position, PositionJSON } from './move';
import { Language, TileLanguage } from './tile';

type PlayerProperty = {
  health: number;
  experience: { [key in TileLanguage]: number };
  level: { [key in TileLanguage]: number };
  inventory: { [key in InventoryItem]: number };
};

export type PlayerJSON = {
  position: PositionJSON;
  property: PlayerProperty;
};

export class Player {
  public property: PlayerProperty;
  constructor(public position: Position) {
    this.property = {
      health: 5,
      experience: Object.fromEntries(Language.data.map((s) => [s, 0])) as {
        [k in TileLanguage]: number;
      },
      level: Object.fromEntries(Language.data.map((s) => [s, 0])) as {
        [k in TileLanguage]: number;
      },
      inventory: Object.fromEntries(Inventory.data.map((s) => [s, 0])) as {
        [k in InventoryItem]: number;
      },
    };
  }

  static random(): Player {
    return new Player(Position.random());
  }

  static fromJson(json: PlayerJSON): Player {
    const player = new Player(Position.fromJson(json.position));
    player.property = json.property;
    return player;
  }

  toJson(): PlayerJSON {
    return {
      position: this.position.toJson(),
      property: this.property,
    };
  }
}
