import { API_BASE, BRAND } from "./brand";

// SINGLE backend module — every API call goes through here.

export type NewsCategory = "crypto" | "casino" | "esports";
export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  category: NewsCategory;
  published_at: string;
  image: string | null;
  summary: string;
}
export interface NewsCoin {
  symbol: string;
  name?: string;
  price: number | null;
  change_24h: number | null;
  image?: string | null;
}
export interface NewsMarket {
  coins: NewsCoin[];
  fng: { value: number; label: string } | null;
  mcap_change_24h: number | null;
  btc_dominance: number | null;
}
export interface NewsResponse {
  items: NewsItem[];
  market: NewsMarket;
  updated_at: string;
}
export interface BackendMatch {
  game: string;
  team1: string;
  team2: string;
  league?: string;
  score1?: number | null;
  score2?: number | null;
  begin_at?: string;
  format?: string;
  id?: string;
}
export interface AppConfig {
  brand: string;
  display_name: string;
  tagline: string;
  character: { name: string; role: string };
  mode: string;
  show_offer: boolean;
  cta: {
    label: { en?: string; ru?: string; es?: string };
    url: string;
    channel: string;
    channel_url: string;
    gate: boolean;
    bot_username: string;
    partner_name?: string;
  };
  offer?: any;
  markets?: any;
  honest_stats?: any;
  win_rate_display?: any;
  privacy_url?: string;
}
export interface MembershipResponse {
  uid: number | string;
  member: boolean;
  gate: { enabled: boolean; locked: boolean; is_member: boolean; channel: string };
  channel: string;
  configured: boolean;
}

async function jget<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "omit" });
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

/** Coerce any value to a safe display string. Prevents React error #31. */
export function toStr(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    for (const k of ["en", "ru", "es"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
    if (typeof o.name === "string") return o.name as string;
    if (typeof o.label === "string") return o.label as string;
    if (typeof o.text === "string") return o.text as string;
    try { return JSON.stringify(v); } catch { return fallback; }
  }
  return fallback;
}

function normalizeNewsItem(it: any): NewsItem {
  return {
    id: toStr(it?.id, Math.random().toString(36).slice(2)),
    title: toStr(it?.title),
    url: toStr(it?.url),
    source: toStr(it?.source),
    category: (["crypto", "casino", "esports"].includes(it?.category) ? it.category : "crypto") as NewsCategory,
    published_at: toStr(it?.published_at),
    image: typeof it?.image === "string" ? it.image : null,
    summary: toStr(it?.summary),
  };
}

function normalizeMatch(m: any): BackendMatch {
  return {
    game: toStr(m?.game),
    team1: toStr(m?.team1),
    team2: toStr(m?.team2),
    league: m?.league != null ? toStr(m.league) : undefined,
    score1: typeof m?.score1 === "number" ? m.score1 : null,
    score2: typeof m?.score2 === "number" ? m.score2 : null,
    begin_at: m?.begin_at != null ? toStr(m.begin_at) : undefined,
    format: m?.format != null ? toStr(m.format) : undefined,
    id: m?.id != null ? toStr(m.id) : undefined,
  };
}

function normalizeConfig(c: any): AppConfig {
  return {
    brand: toStr(c?.brand, BRAND.id),
    display_name: toStr(c?.display_name, BRAND.wordmark),
    tagline: toStr(c?.tagline, BRAND.tagline),
    character: {
      name: toStr(c?.character?.name, BRAND.character.name),
      role: toStr(c?.character?.role, BRAND.character.role),
    },
    mode: toStr(c?.mode, "live"),
    show_offer: Boolean(c?.show_offer ?? true),
    cta: {
      label: (c?.cta?.label && typeof c.cta.label === "object" && !Array.isArray(c.cta.label))
        ? c.cta.label
        : { en: toStr(c?.cta?.label, "Subscribe") },
      url: toStr(c?.cta?.url, `https://t.me/${BRAND.channelHandle}`),
      channel: toStr(c?.cta?.channel, `@${BRAND.channelHandle}`),
      channel_url: toStr(c?.cta?.channel_url, `https://t.me/${BRAND.channelHandle}`),
      gate: Boolean(c?.cta?.gate ?? true),
      bot_username: toStr(c?.cta?.bot_username, BRAND.botUsername),
      partner_name: c?.cta?.partner_name != null ? toStr(c.cta.partner_name) : undefined,
    },
    offer: c?.offer,
    markets: c?.markets,
    honest_stats: c?.honest_stats,
    win_rate_display: c?.win_rate_display,
    privacy_url: c?.privacy_url != null ? toStr(c.privacy_url) : undefined,
  };
}

export async function getConfig(): Promise<AppConfig> {
  try {
    const raw = await jget<any>("/api/config");
    return normalizeConfig(raw);
  } catch {
    return normalizeConfig({});
  }
}

export async function getNews(
  category: "all" | NewsCategory = "all",
  limit = 40,
): Promise<NewsResponse> {
  const raw = await jget<any>(`/api/news?category=${category}&limit=${limit}`);
  return {
    items: Array.isArray(raw?.items) ? raw.items.map(normalizeNewsItem) : [],
    market: raw?.market ?? { coins: [], fng: null, mcap_change_24h: null, btc_dominance: null },
    updated_at: toStr(raw?.updated_at),
  };
}

export async function getLive(): Promise<{ matches: BackendMatch[] }> {
  const raw = await jget<any>(`/api/live`);
  return { matches: Array.isArray(raw?.matches) ? raw.matches.map(normalizeMatch) : [] };
}
export async function getUpcoming(): Promise<{ matches: BackendMatch[] }> {
  const raw = await jget<any>(`/api/upcoming`);
  return { matches: Array.isArray(raw?.matches) ? raw.matches.map(normalizeMatch) : [] };
}

export async function getMembership(uid: number | null): Promise<MembershipResponse | null> {
  if (uid == null) return null;
  try {
    return await jget<MembershipResponse>(`/api/membership?uid=${uid}`);
  } catch {
    return null;
  }
}

export type EventName = "cta_view" | "cta_tap" | "channel_open" | "tab_switch" | "cta_dismiss";
export function trackEvent(event: EventName, meta: Record<string, any> = {}, uid: number | null = null) {
  try {
    const body = JSON.stringify({ event, uid: uid ?? undefined, meta });
    fetch(`${API_BASE}/api/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
