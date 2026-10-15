// localStorage/sessionStorage can be unavailable (private mode, blocked cookies),
// so every access is guarded and falls back silently.

type Kind = "local" | "session";

const getStore = (kind: Kind): Storage | null => {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export function load<T>(key: string, fallback: T, kind: Kind = "local"): T {
  try {
    const raw = getStore(kind)?.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown, kind: Kind = "local"): void {
  try {
    getStore(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy errors
  }
}
