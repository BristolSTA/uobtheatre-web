import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
export { default as mount } from './helpers/mount';

/**
 * Fixes test "contains" issues caused by content being spread over new lines.
 * Removes double-spacing / new lining in a given string.
 *
 * @param {string} text Text to fix
 * @returns {string} Fixed text
 */
export function fixTextSpacing(text: string) {
  return text.replace(/\s\s+/g, ' ');
}

/**
 * Sets data of for composition Vue components
 */
export function setCompositionData(component: VueWrapper, data: object) {
  for (const [key, value] of Object.entries(data)) {
    // @ts-ignore
    component.vm[key] = value;
  }
}
