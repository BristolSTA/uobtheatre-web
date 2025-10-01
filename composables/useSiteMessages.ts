import cookie from 'js-cookie';

// Unified cookie key for all site messages (banner and modal)
export const SITE_MESSAGES_COOKIE_KEY = 'siteMessagesDismissed';

export type SiteMessage = {
  id: number | string;
  title?: string | null;
  message: string;
  type: string; // e.g. MAINTENANCE, INFORMATION, ALERT
  toDisplay: boolean;
  eventStart: string; // ISO
  eventEnd?: string | null; // ISO
  eventDuration?: number | null; // minutes
  dismissalPolicy?: 'BANNED' | 'SINGLE' | 'TIMED' | string | null;
  indefiniteOverride?: boolean | null;
};

export function getDismissedIds(): string[] {
  const raw = cookie.get(SITE_MESSAGES_COOKIE_KEY);
  return raw ? raw.split(',').filter(Boolean) : [];
}

export function setDismissedIds(
  ids: Array<string | number>,
  opts?: { expires?: Date }
) {
  const unique = Array.from(new Set(ids.map(String)));
  if (opts?.expires)
    cookie.set(SITE_MESSAGES_COOKIE_KEY, unique.join(','), {
      expires: opts.expires
    });
  else cookie.set(SITE_MESSAGES_COOKIE_KEY, unique.join(','));
}

export function addDismissedId(
  current: Array<string | number>,
  id: string | number,
  policy?: string | null,
  eventEnd?: string | null
) {
  const ids = [...current.map(String), String(id)];
  if (policy === 'SINGLE') {
    setDismissedIds(ids); // session cookie
  } else {
    const expiry = eventEnd ? new Date(eventEnd) : undefined;
    setDismissedIds(ids, expiry ? { expires: expiry } : undefined);
  }
  return getDismissedIds();
}

const typePriority: Record<string, number> = {
  ALERT: 0,
  MAINTENANCE: 1,
  INFORMATION: 2
};

export function normalizeTypeKey(rawType: string): string {
  if (!rawType) return 'INFORMATION';
  const t = rawType.toUpperCase();
  if (t.includes('ALERT')) return 'ALERT';
  if (t.includes('MAINTENANCE')) return 'MAINTENANCE';
  if (t.includes('INFO')) return 'INFORMATION';
  return t;
}

export function filterAndSortMessages(
  messages: SiteMessage[],
  dismissedIds: string[],
  nowISO?: string
) {
  const now = nowISO ? new Date(nowISO) : new Date();
  return (messages || [])
    .filter((m) => m && m.toDisplay && !dismissedIds.includes(String(m.id)))
    .sort((a, b) => {
      const pa = typePriority[normalizeTypeKey(a.type)] ?? 99;
      const pb = typePriority[normalizeTypeKey(b.type)] ?? 99;
      if (pa !== pb) return pa - pb;
      // upcoming first by nearest start, ongoing before future
      const as = new Date(a.eventStart).getTime();
      const bs = new Date(b.eventStart).getTime();
      const aOngoing = as <= now.getTime();
      const bOngoing = bs <= now.getTime();
      if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
      return as - bs;
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
  return `${ongoing ? 'ongoing' : 'upcoming'}${norm}`;
}
