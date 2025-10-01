import cookie from 'js-cookie';

// Unified cookie key for all site messages (banner and modal)
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
  opts?: { expires?: Date }
) {
  const unique = Array.from(new Set(ids.map(String)));
  // Determine effective expiry as the later of provided expiry and any existing stored expiry
  const proposed = opts?.expires;
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
    // No effective expiry -> session cookie only; do not update expiry companion
    cookie.set(SITE_MESSAGES_COOKIE_KEY, unique.join(','));
  }
}

export function addDismissedId(
  current: Array<string | number>,
  id: string | number,
  policy?: string | null,
  eventEnd?: string | null
) {
  const ids = [...current.map(String), String(id)];
  if (policy === 'SINGLE') {
    // Do NOT set cookies for SINGLE dismissal; keep in-memory only for this runtime
    return ids.map(String);
  }
  const expiry = eventEnd ? new Date(eventEnd) : undefined;
  setDismissedIds(ids, expiry ? { expires: expiry } : undefined);
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
