export type Lang = "en" | "pt";

export type WindowType =
  | "welcome"
  | "about"
  | "resume"
  | "projects"
  | "contact"
  | "mycomputer"
  | "paint"
  | "minesweeper"
  | "winamp"
  | "cmd"
  | "recycle";

export interface WindowState {
  id: number;
  type: WindowType;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  x?: number;
  y?: number;
}

export type Stage = "boot" | "login" | "desktop" | "shutdown";
