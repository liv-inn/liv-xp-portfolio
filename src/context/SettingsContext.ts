import { createContext } from "react";
import type { Lang } from "../types";
import type { Strings } from "../i18n/strings";

export interface SettingsContextValue {
  lang: Lang;
  t: Strings;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  muted: boolean;
  toggleMuted: () => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);
