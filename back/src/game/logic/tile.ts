import { getRandomElement } from './util';

export class Language {
  static data = [
    'C',
    'Python',
    'Java',
    'JavaScript',
    'TypeScript',
    // 'C#',
    // 'C++',
    // 'Rust',
    // 'Kotlin',
    // 'R',
  ] as const;

  static random(): TileLanguage {
    return getRandomElement(
      Language.data as unknown as string[],
    ) as TileLanguage;
  }

  static toId(language: TileLanguage): number {
    return Language.data.indexOf(language);
  }
}

export type TileLanguage = typeof Language.data[number];

export type TileJSON = { language: TileLanguage };

export class Tile {
  constructor(public language: TileLanguage) {}

  reset(): void {
    this.language = Language.random();
  }

  static random(): Tile {
    return new Tile(Language.random());
  }

  static fromJson(json: TileJSON): Tile {
    return new Tile(json.language);
  }

  toJson(): TileJSON {
    return { language: this.language };
  }
}
