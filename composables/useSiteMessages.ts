import cookie from 'js-cookie';

export const SITE_MESSAGES_COOKIE_KEY = 'siteMessagesDismissed';
export const SITE_MESSAGES_COOKIE_EXP_KEY = 'siteMessagesDismissedExpiry';

export type SiteMessage = {
  id: number | string;
  title?: string | null;
  message: string;
  type: string; // MAINTENANCE, INFORMATION, ALERT
  toDisplay: boolean;
  eventStart: string; // ISO
  eventEnd?: string | null; // ISO
  eventDuration?: number | null; // minutes
  dismissalPolicy?: 'BANNED' | 'SINGLE' | 'DEFAULT' | string | null;
  indefiniteOverride?: boolean | null;
};

export function getDismissedIds(): string[] {
  const raw = cookie.get(SITE_MESSAGES_COOKIE_KEY);
  return raw ? raw.split(',').filter(Boolean) : [];
}

export function setDismissedIds(
  ids: Array<string | number>,
  expiry: Date | undefined
) {
  const unique = Array.from(new Set(ids.map(String)));
  // Determine effective expiry as the later of provided expiry and any existing stored expiry
  const proposed = expiry;
  const existingExpRaw = cookie.get(SITE_MESSAGES_COOKIE_EXP_KEY);
  const existing = existingExpRaw ? new Date(existingExpRaw) : undefined;
  let effective: Date | undefined = proposed || existing;
  if (proposed && existing) {
    effective = proposed.getTime() >= existing.getTime() ? proposed : existing;
  }
  if (effective) {
    cookie.set(SITE_MESSAGES_COOKIE_KEY, unique.join(','), {
      expires: effective
    });
    // Also persist the expiry value in a companion cookie so we can compare next time
    cookie.set(SITE_MESSAGES_COOKIE_EXP_KEY, effective.toISOString(), {
      expires: effective
    });
  } else {
    // As a fallback, if no effective expiry is determined, set a session cookie only
    cookie.set(SITE_MESSAGES_COOKIE_KEY, unique.join(','));
  }
}

export function addDismissedId(
  id: string | number,
  policy?: string | null,
  eventEnd?: string | null,
  indefiniteOverride?: boolean | null
) {
  const ids = [...getDismissedIds(), String(id)];
  if (policy === 'SINGLE') {
    // Do NOT set cookies for SINGLE dismissal; keep in-memory only for this runtime
    return ids.map(String);
  }
  if (indefiniteOverride) {
    // If this is an indefinite override, we use a fallback expiry of 3 months from now.
    const fallbackExpiry = new Date();
    fallbackExpiry.setMonth(fallbackExpiry.getMonth() + 3);
    setDismissedIds(ids, fallbackExpiry);
    return getDismissedIds();
  }
  const expiry = eventEnd ? new Date(eventEnd) : undefined;
  setDismissedIds(ids, expiry ? expiry : undefined);
  return getDismissedIds();
}

export function filterAndSortMessages(
  messages: SiteMessage[],
  dismissedIds: string[],
  nowISO?: string
) {
  const now = nowISO ? new Date(nowISO) : new Date();
  return (messages || [])
    .filter((m) => m && !dismissedIds.includes(String(m.id)))
    .sort((a, b) => {
      const nowTime = now.getTime();
      const aStart = new Date(a.eventStart).getTime();
      const bStart = new Date(b.eventStart).getTime();
      const aOngoing = aStart <= nowTime;
      const bOngoing = bStart <= nowTime;

      // Ongoing events come before future events
      if (aOngoing !== bOngoing) {
        return aOngoing ? -1 : 1;
      }
      // If both are ongoing or both are future, earlier start time comes first
      return aStart - bStart;
    });
}

export function isOngoing(msg: SiteMessage, nowISO?: string) {
  const now = nowISO ? new Date(nowISO) : new Date();
  return new Date(msg.eventStart).getTime() <= now.getTime();
}

export function buildTypeKey(msg: SiteMessage, nowISO?: string) {
  const ongoing = isOngoing(msg, nowISO);
  const t = msg.type || '';
  const norm = t.charAt(0) + t.slice(1).toLowerCase();
  const rtrn = `${ongoing ? 'ongoing' : 'upcoming'}${norm}`;
  return rtrn;
}
