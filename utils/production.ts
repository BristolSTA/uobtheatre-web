import { DateTime } from 'luxon';
import { PerformanceNode } from '~~/graphql/codegen/operations';
import type { MaybeRef } from '~~/types/generic';
import { oneLiner, truncate } from './lang';

export function excerptFromDescription(description: string) {
  return oneLiner(truncate(description, 100));
}

type ProductionsOnNowProductionType = {
  performances: {
    edges: Array<{
      node?: Pick<PerformanceNode, 'doorsOpen' | 'start' | 'end'> | null;
    } | null>;
  };
};

type ProductionsOnNowOptions = {
  now: MaybeRef<DateTime>;
  /** @DefaultValue 20 */
  minutesBefore: number;
  /** @DefaultValue false */
  beforeStartOnly: boolean;
};

/**
 * Returns a list of productions with performances that are on now
 */
export function productionsOnNow<
  TProduction extends ProductionsOnNowProductionType
>(
  productions: TProduction[],
  options: Partial<ProductionsOnNowOptions> = {}
): TProduction[] {
  const {
    beforeStartOnly = false,
    minutesBefore = 20,
    now = DateTime.now()
  } = options;

  return productions.filter((production) => {
    if (!production?.performances?.edges?.length) {
      return false;
    }
    const doorsOpenTime = DateTime.fromISO(
      production.performances.edges[0].node.doorsOpen
    );
    const startTime = DateTime.fromISO(
      production.performances.edges[0].node.start
    );
    const endTime = DateTime.fromISO(production.performances.edges[0].node.end);
    const nowTime = unref(now);
    if (beforeStartOnly && startTime < nowTime) return false;
    else if (endTime < nowTime) return false;
    return doorsOpenTime.minus({ minutes: minutesBefore }) <= nowTime;
  });
}
