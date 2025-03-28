import orbiterPalette from "flat-ui-colors-json/nl.json";

import { ToyFunction } from "./types.ts";

export function toy(id: string, displayName: string, fn: () => React.ReactElement): ToyFunction {
  return Object.assign(fn, { id, displayName, $toy: true as const });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isToyFunction(fn: any): fn is ToyFunction {
  return fn.$toy === true;
}

export function getRandomToyColor() {
  return orbiterPalette.colors[Math.floor(Math.random() * orbiterPalette.colors.length)]!;
}
