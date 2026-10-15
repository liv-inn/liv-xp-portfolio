import { useReducer, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { WindowContext } from "./WindowContext";
import { load, save } from "../lib/storage";
import { sounds } from "../lib/sounds";
import { WINDOW_TYPES } from "../windows/windowTypes";
import type { WindowState, WindowType } from "../types";

interface State {
  windows: WindowState[];
  nextId: number;
  highestZIndex: number;
}

type Action =
  | { type: "open"; windowType: WindowType }
  | { type: "close"; id: number }
  | { type: "closeAll" }
  | { type: "minimize"; id: number }
  | { type: "focus"; id: number }
  | { type: "toggleMaximize"; id: number }
  | { type: "move"; id: number; x: number; y: number };

const STORAGE_KEY = "liv-xp-windows";

const welcomeState: State = {
  windows: [{ id: 0, type: "welcome", minimized: false, maximized: false, zIndex: 101 }],
  nextId: 1,
  highestZIndex: 101,
};

// Restore the previous session's windows; first-time visitors get the welcome alert
function init(): State {
  const saved = load<State | null>(STORAGE_KEY, null);
  if (!saved || !Array.isArray(saved.windows) || saved.windows.length === 0) return welcomeState;
  const windows = saved.windows.filter((w) => WINDOW_TYPES.includes(w.type) && w.type !== "welcome");
  if (windows.length === 0) return welcomeState;
  return { windows, nextId: saved.nextId, highestZIndex: saved.highestZIndex };
}

const updateWindow = (state: State, id: number, patch: (w: WindowState) => WindowState): WindowState[] =>
  state.windows.map((win) => (win.id === id ? patch(win) : win));

function windowReducer(state: State, action: Action): State {
  switch (action.type) {
    case "open": {
      const zIndex = state.highestZIndex + 1;
      const exists = state.windows.some((win) => win.type === action.windowType);
      if (exists) {
        return {
          ...state,
          highestZIndex: zIndex,
          windows: state.windows.map((win) =>
            win.type === action.windowType ? { ...win, minimized: false, zIndex } : win
          ),
        };
      }
      const newWindow: WindowState = {
        id: state.nextId,
        type: action.windowType,
        minimized: false,
        maximized: false,
        zIndex,
      };
      return { windows: [...state.windows, newWindow], nextId: state.nextId + 1, highestZIndex: zIndex };
    }
    case "close":
      return { ...state, windows: state.windows.filter((win) => win.id !== action.id) };
    case "closeAll":
      return { ...state, windows: [] };
    case "minimize":
      return { ...state, windows: updateWindow(state, action.id, (w) => ({ ...w, minimized: true })) };
    case "focus": {
      const target = state.windows.find((w) => w.id === action.id);
      if (target && !target.minimized && target.zIndex === state.highestZIndex) return state;
      const zIndex = state.highestZIndex + 1;
      return {
        ...state,
        highestZIndex: zIndex,
        windows: updateWindow(state, action.id, (w) => ({ ...w, minimized: false, zIndex })),
      };
    }
    case "toggleMaximize": {
      const zIndex = state.highestZIndex + 1;
      return {
        ...state,
        highestZIndex: zIndex,
        windows: updateWindow(state, action.id, (w) =>
          w.maximized ? { ...w, maximized: false } : { ...w, maximized: true, minimized: false, zIndex }
        ),
      };
    }
    case "move":
      return { ...state, windows: updateWindow(state, action.id, (w) => ({ ...w, x: action.x, y: action.y })) };
    default:
      return state;
  }
}

export function WindowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, undefined, init);

  useEffect(() => {
    save(STORAGE_KEY, state);
  }, [state]);

  const openWindow = useCallback((windowType: WindowType) => {
    sounds.open();
    dispatch({ type: "open", windowType });
  }, []);
  const closeWindow = useCallback((id: number) => dispatch({ type: "close", id }), []);
  const closeAll = useCallback(() => dispatch({ type: "closeAll" }), []);
  const minimizeWindow = useCallback((id: number) => dispatch({ type: "minimize", id }), []);
  const focusWindow = useCallback((id: number) => dispatch({ type: "focus", id }), []);
  const toggleMaximize = useCallback((id: number) => dispatch({ type: "toggleMaximize", id }), []);
  const moveWindow = useCallback((id: number, x: number, y: number) => dispatch({ type: "move", id, x, y }), []);

  const value = useMemo(
    () => ({
      windows: state.windows,
      highestZIndex: state.highestZIndex,
      openWindow,
      closeWindow,
      closeAll,
      minimizeWindow,
      focusWindow,
      toggleMaximize,
      moveWindow,
    }),
    [state.windows, state.highestZIndex, openWindow, closeWindow, closeAll, minimizeWindow, focusWindow, toggleMaximize, moveWindow]
  );

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}
