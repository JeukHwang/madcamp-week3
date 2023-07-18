import {
  EventInstance,
  MiddleOfWeek,
  NoCondition,
  OptionInstance,
} from '../logic/event';
import type { TileLanguage } from '../logic/tile';
import { getRandomElement } from '../logic/util';

export const 변화의_물결 = new EventInstance(
  MiddleOfWeek,
  '변화의 물결',
  '각종 신기술의 등장과 구기술의 변화로 기존의 지식이 쓸모없어졌다.\n배울 것이 많아졌지만 새로운 기회가 열릴지도 모르겠다.',
  [
    new OptionInstance(
      NoCondition,
      '이런.',
      `한 언어의 경험치가 0이 된다.`,
      (game) => {
        const existLang = (
          Object.entries(game.player.property.experience) as [
            TileLanguage,
            number,
          ][]
        )
          .filter(([string, number]) => number > 0)
          .map(([string, number]) => string);
        if (existLang.length > 0) {
          game.player.property.experience[getRandomElement(existLang)] = 0;
        }
        return true;
      },
    ),
  ],
);
