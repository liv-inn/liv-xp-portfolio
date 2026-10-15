import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { SettingsContext } from "./SettingsContext";
import { strings } from "../i18n/strings";
import { load, save } from "../lib/storage";
import { setMuted as setAudioMuted } from "../lib/sounds";
import type { Lang } from "../types";

const detectLang = (): Lang => (navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en");

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => load<Lang>("liv-xp-lang", detectLang()));
  const [muted, setMuted] = useState<boolean>(() => load("liv-xp-muted", false));

  useEffect(() => {
    save("liv-xp-lang", lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  useEffect(() => {
    save("liv-xp-muted", muted);
    setAudioMuted(muted);
  }, [muted]);

  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "pt" : "en")), []);
  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  const value = useMemo(
    () => ({ lang, t: strings[lang], setLang, toggleLang, muted, toggleMuted }),
    [lang, muted, toggleLang, toggleMuted]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
