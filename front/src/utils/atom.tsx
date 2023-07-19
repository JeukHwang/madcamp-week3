import { atom } from "jotai";

export const soundAtom = atom(0);
export const optionchooseAtom = atom(0);
export const responseAtom = atom([]);
type Position = {x:number, y:number}
export const playerPositionAtom = atom<Position | null>(null);
export const selectedCellsAtom = atom<Position[]>([]);
export const isFinishedAtom = atom(false);