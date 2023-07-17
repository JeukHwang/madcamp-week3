import { exit } from 'process';
import { GameConstant } from '../logic/constant';
import type { GameEvent } from '../logic/event';
import { EventInstance, NoCondition, OptionInstance } from '../logic/event';
import { Language } from '../logic/tile';
import { logAndPrint } from '../logic/util';

const eventList: GameEvent[] = [
  new EventInstance(
    NoCondition,
    '한 해의 마무리',
    '지난 1년 간의 배움이 개발자로 살아남기에 충분했을지 알아보자.',
    [
      new OptionInstance(
        (game) =>
          Language.data.some(
            (lang) =>
              game.player.property.experience[lang] >=
              GameConstant.experienceThreshold,
          ),
        '경력을 인정받자',
        `${GameConstant.experienceThreshold} 이상의 경험치가 있는 언어에 대해 1년의 경력이 인정된다.`,
        (game) => {
          const prop = game.player.property;
          let flag = false;
          Language.data.forEach((lang) => {
            if (prop.experience[lang] >= GameConstant.experienceThreshold) {
              prop.level[lang] += 1;
              prop.experience[lang] -= GameConstant.experienceThreshold;
              flag = true;
            }
          });
          return flag;
        },
      ),
      new OptionInstance(
        (game) =>
          !Language.data.some(
            (lang) =>
              game.player.property.experience[lang] >=
              GameConstant.experienceThreshold,
          ),
        '아쉽지만 포기하자',
        `개발자를 그만둔다.`,
        () => {
          logAndPrint('게임을 종료합니다.');
          exit();
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
];

export function findEventByName(name: string): GameEvent {
  // TODO : find 결과가 undefined일 때 처리 or add type for title
  return eventList.find((e) => e.title === name) as GameEvent;
}
