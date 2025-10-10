import { oneLiner, truncate } from './lang';

export function excerptFromDescription(description: string) {
  return oneLiner(truncate(description, 100));
}

export function slugFromRoute(route = useRoute()) {
  return route.params.slug as string;
}
