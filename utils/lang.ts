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
export function truncate(text: string, length: number, clamp?: string): string {
  clamp = clamp || '...';
  return text.length < length ? text : text.substring(0, length) + clamp;
}

/**
 * Joins a list together with commas, but uses "and" for the final pair
 * e.g. The Winston Theatre, The Pegg Theatre and The Anson Rooms
 *
 * @param {Array<string>} array List of strings to join
 * @returns {string} Joined string
 */
export const joinWithAnd = (array: string[]) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1');
};
