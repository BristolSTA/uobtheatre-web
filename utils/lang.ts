import { DateTime } from 'luxon';

/**
 * Cleans multi-line, HTML text into a simple string
 *
 * @param text Text to be cleaned
 */
export function oneLiner(text: string): string {
  return text
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/([!.?])([A-Z])/g, '$1 $2')
    .replace(/(\.|([^.]))\r?\n/g, '$2. ');
}

/**
 * Truncates a string of text
 *
 * @param text Text to truncate
 * @param length Maximum length in charecters
 * @param clamp String used to signify truncation. Defaults to '...'
 */
export function truncate(
  text: string,
  length: number,
  clamp: string = undefined
): string {
  clamp = clamp || '...';
  const node = document.createElement('div');
  node.innerHTML = text;
  const content = node.textContent;
  return content && content.length > length
    ? content.slice(0, length) + clamp
    : content;
}

/**
 * Generates a start to end date string given a start and end date
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @param {string} format Luxon datetime format string (excluding year)
 * @returns {string} Formatted start to end datetime string
 */
export function displayStartEnd(start, end, format): string {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);

  let result = '';
  if (start.month !== end.month || start.day !== end.day) {
    result =
      start.toFormat(start.year === end.year ? format : format + ' y') + ' - ';
  }

  result += `${end.toFormat(format + ' y')}`;
  return result;
}
