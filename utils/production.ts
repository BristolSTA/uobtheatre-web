import { oneLiner, truncate } from './lang';

export function excerptFromDescription(description: string) {
  return oneLiner(truncate(description, 100));
}
