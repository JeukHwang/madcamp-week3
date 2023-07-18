import { GameConstant } from '../logic/constant';
import type { GameEvent } from '../logic/event';
import { EventInstance, NoCondition, OptionInstance } from '../logic/event';
import type { TileLanguage } from '../logic/tile';
import { Language } from '../logic/tile';

const eventList: GameEvent[] = [
  new EventInstance(
    NoCondition,
    '한 주의 마무리',
    '지난 1주 간의 배움이 개발자로 살아남기에 충분했을지 알아보자.',
    [
      new OptionInstance(
        (game) =>
          Object.values(Language.levelUpdatable(game)).some((v) => v),
        '경력을 인정받자',
        `${GameConstant.levelThreshold} 이상의 경험치가 있는 언어에 대해 1주의 경력이 인정된다.`,
        (game) => {
          const prop = game.player.property;
          let flag = false;
          Language.data.forEach((lang) => {
            if (prop.experience[lang] >= GameConstant.levelThreshold) {
              prop.level[lang] += 1;
              prop.experience[lang] -= GameConstant.levelThreshold;
              flag = true;
            }
          });
          return flag;
        },
      ),
      new OptionInstance(
        (game) =>
          !Object.values(Language.levelUpdatable(game)).some((v) => v),
        '아쉽지만 포기하자',
        `개발자를 그만둔다.`,
        (game) => {
          game.finish();
          return true;
        },
      ),
    ],
  ),
  new EventInstance(
    NoCondition,
    '새로운 시작',
    '각종 신기술의 등장과 구기술의 변화로 기존의 지식이 쓸모없어졌다. 배울 것은 다시 많아졌지만 새로운 기회가 열리려나.',
    [
      new OptionInstance(
        NoCondition,
        '힘내보자.',
        '모든 경험치가 0이 된다.',
        (game) => {
          const prop = game.player.property;
          Language.data.forEach((lang) => {
            prop.experience[lang] = 0;
          });
          return true;
        },
      ),
    ],
  ),
  new EventInstance(
    NoCondition,
    '한 주의 마무리와 시작',
    '지난 1주 간의 배움이 개발자로 살아남기에 충분했을지 알아보자.\n다만 각종 신기술의 등장과 구기술의 변화로 기존의 지식이 쓸모없어졌다. 배울 것은 다시 많아졌지만 새로운 기회가 열리려나.',
    [
      new OptionInstance(
        NoCondition,
        '한 주의 노력을 정산해보자.',
        `${GameConstant.levelThreshold} 이상의 경험치가 있는 언어에 대해 1주의 경력이 인정된 후 모든 경험치가 0이 된다.`,
        (game) => {
          const prop = game.player.property;
          const update = Language.levelUpdatable(game);
          prop.levelEnabled = update;
          Object.entries(update).forEach(
            ([lang, updatable]: [TileLanguage, boolean]) => {
              if (updatable) {
                prop.level[lang] += 1;
              }
            },
          );
          prop.experience = Object.fromEntries(
            Language.data.map((lang) => [lang, 0]),
          ) as { [key in TileLanguage]: number };
          return Object.values(update).some((v) => v);
        },
      ),
    ],
  ),
];

export function findEventByName(name: string): GameEvent {
  // TODO : find 결과가 undefined일 때 처리 or add type for title
  return eventList.find((e) => e.title === name) as GameEvent;
}
