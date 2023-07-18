import * as assert from 'assert';
import type { GameEvent } from '../logic/event';
import { 밥은_먹고_다니니 } from './밥은_먹고_다니니';
import { 버티컬_마우스가_필요해 } from './버티컬_마우스가_필요해';
import { 변화의_물결 } from './변화의_물결';
import { 성장 } from './성장';
import { 주간_목표 } from './주간_목표';

const eventList: GameEvent[] = [
  성장,
  주간_목표,
  변화의_물결,
  밥은_먹고_다니니,
  버티컬_마우스가_필요해,
];
const eventNameList = [
  '성장',
  '주간 목표',
  '변화의 물결',
  '밥은 먹고 다니니',
  '버티컬 마우스가 필요해',
] as const;
export type EventTitle = typeof eventNameList[number];

assert(
  eventList.length === eventNameList.length,
  'eventList and eventNameList should have same length',
);

export function findEventByName(name: EventTitle): GameEvent {
  // TODO : find 결과가 undefined일 때 처리 or add type for title
  return eventList.find((e) => e.title === name) as GameEvent;
}
