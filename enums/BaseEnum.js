export function getEnumTextUsingMap(enumValue, map) {
  return map[enumValue];
}

export default class {
  enumValue;
  nameMap = {};

  constructor(enumValue) {
    this.enumValue = enumValue;
  }

  get name() {
    return this.nameMap[this.enumValue];
  }

  get value() {
    return this.enumValue;
  }
}
