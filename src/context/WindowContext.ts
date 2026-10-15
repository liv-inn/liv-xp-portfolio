import { createContext } from "react";
import type { WindowState, WindowType } from "../types";

export interface WindowContextValue {
  windows: WindowState[];
  highestZIndex: number;
  openWindow: (type: WindowType) => void;
  closeWindow: (id: number) => void;
  closeAll: () => void;
  minimizeWindow: (id: number) => void;
  focusWindow: (id: number) => void;
  toggleMaximize: (id: number) => void;
  moveWindow: (id: number, x: number, y: number) => void;
}

export const WindowContext = createContext<WindowContextValue | null>(null);
