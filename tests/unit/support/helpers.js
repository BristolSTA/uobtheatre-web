import { expect } from 'vitest';
export { default as mount } from './helpers/mount';

/**
 * Fixes test "contains" issues caused by content being spread over new lines.
 * Removes double-spacing / new lining in a given string.
 *
 * @param {string} text Text to fix
 * @returns {string} Fixed text
 */
export function fixTextSpacing(text) {
  return text.replace(/\s\s+/g, ' ');
}

/**
 * Sets data of for composition Vue components
 */
export function setCompositionData(component, data) {
  for (const [key, value] of Object.entries(data)) {
    component.vm[key] = value;
  }
}

/**
 * Asserts no visual differnce between recieved and expected objects
 *
 * @param {object|Array|string} recieved Recieved object
 * @param {object|Array|string} expected Expected object
 */
export function assertNoVisualDifference(recieved, expected) {
  expect(JSON.stringify(recieved)).to.eq(JSON.stringify(expected));
}
