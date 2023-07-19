import {
  EventInstance,
  NoCondition,
  OptionInstance,
  WeekDay,
} from '../logic/event';

export const 밥은_먹고_다니니 = new EventInstance(
  (game) => WeekDay(2, 4)(game) && game.player.property.money === 0,
  '밥은 먹고 다니니',
  '개발만 하니 딱해보였는지 부모님이 용돈을 보내주셨다.',
  [
    new OptionInstance(NoCondition, '감사합니다.', `돈 2를 얻는다.`, (game) => {
      const prop = game.player.property;
      prop.money += 2;
      return true;
    }),
  ],
);
