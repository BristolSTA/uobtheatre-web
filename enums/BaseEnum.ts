import type { Dictionary } from 'ts-essentials';

export function getEnumTextUsingMap(
  enumValue: string,
  map: Dictionary<string, string>
) {
  return map[enumValue];
}

export default class {
  enumValue;
  nameMap: Dictionary<string, string> = {};

  constructor(enumValue: string) {
    this.enumValue = enumValue;
  }

  get name() {
    return this.nameMap[this.enumValue];
  }

  get value() {
    return this.enumValue;
  }
}
