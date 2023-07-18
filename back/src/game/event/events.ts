import { GameConstant } from '../logic/constant';
import type { GameCondition, GameEvent } from '../logic/event';
import {
  EndOfWeek,
  EventInstance,
  NoCondition,
  NoEffect,
  OptionInstance,
} from '../logic/event';
import type { GameInstance } from '../logic/game';
import type { TileLanguage } from '../logic/tile';
import { Language } from '../logic/tile';
import { getRandomElement } from '../logic/util';

export type WeeklyGoalData = {
  type: 'language';
  include: TileLanguage[];
  number: number;
  string: string;
};

export function randomWeeklyGoal(game: GameInstance): WeeklyGoalData {
  const week = Math.floor(game.property.turn / 7);
  const playerLevelSum = Object.values(game.player.property.level).reduce(
    (partialSum, a) => partialSum + a,
    0,
  );
  let currentLevel = Math.max(
    week + (playerLevelSum - week) * 0.05 + (Math.random() - 0.6) * 0.1,
    0,
  );
  const option: WeeklyGoalData = {
    type: 'language',
    include: [],
    number: 0,
    string: '',
  };
  while (currentLevel >= 0) {
    if (option.number === Language.data.length) {
      break;
    }
    const r = Math.random();
    if (r > 0.7) {
      const lang =
        Language.data[Math.floor(Math.random() * Language.data.length)];
      if (!option.include.includes(lang)) {
        option.include.push(lang);
        option.number += 1;
        currentLevel -= 1;
      }
    } else {
      option.number += 1;
      currentLevel -= 0.8;
    }
  }

  if (option.include.length === 0) {
    option.string = `${option.number}개 이상의 언어로 활동할 수 있는 개발자가 되자.`;
  } else if (option.include.length === option.number) {
    option.string = `${option.include.join(
      ', ',
    )}로 활동할 수 있는 개발자가 되자.`;
  } else {
    option.string = `${this.property.weeklyGoalData.include.join(
      ', ',
    )}를 포함하여 ${
      this.property.weeklyGoalData.number
    }개 이상의 언어를 활동할 수 있는 개발자가 되자.`;
  }
  return option;
}

function weeklyGoalEvent(): GameEvent {
  const succeed: GameCondition = (game: GameInstance): boolean => {
    const levelEnabled = game.player.property.levelEnabled;
    switch (game.property.weeklyGoalData.type) {
      case 'language':
        return (
          game.property.weeklyGoalData.include.every(
            (lang) => levelEnabled[lang],
          ) &&
          Object.values(levelEnabled).filter((v) => v === true).length >=
            game.property.weeklyGoalData.number
        );
    }
  };
  return new EventInstance(
    EndOfWeek,
    '주간 목표',
    '개발자로 살아남을 수 있을까?', // TODO : add description same as game.show()
    [
      new OptionInstance(succeed, '야호!', `개발자로 살아남았다.`, NoEffect),
      new OptionInstance(
        (game) => !succeed(game),
        '아쉽군... 한 판 더 하자.',
        `개발자를 그만둔다.`,
        (game) => {
          game.property.status = [{ type: 'endGame', data: '' }];
          return true;
        },
      ),
    ],
  );
}

const eventList: GameEvent[] = [
  new EventInstance(NoCondition, '성장', '한 주의 노력을 정산해보자.', [
    new OptionInstance(
      EndOfWeek,
      '좋아.',
      `${GameConstant.levelThreshold} 이상의 경험치가 있는 언어에 대해 1주의 경력이 인정된다.`,
      (game) => {
        const prop = game.player.property;
        const update = Language.levelUpdatable(game);
        prop.levelEnabled = update;
        Object.entries(update).forEach(
          ([lang, updatable]: [TileLanguage, boolean]) => {
            if (updatable) {
              prop.level[lang] += 1;
              prop.experience[lang] -= GameConstant.levelThreshold;
            }
          },
        );
        return Object.values(update).some((v) => v);
      },
    ),
  ]),

  new EventInstance(
    NoCondition,
    '급변',
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
  ),
  weeklyGoalEvent(),
];

export function findEventByName(name: string): GameEvent {
  // TODO : find 결과가 undefined일 때 처리 or add type for title
  return eventList.find((e) => e.title === name) as GameEvent;
}
