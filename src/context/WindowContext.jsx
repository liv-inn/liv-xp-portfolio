import { createContext, useState, useCallback } from "react";

export const WindowContext = createContext(null);

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);
  const [nextId, setNextId] = useState(0);
  const [highestZIndex, setHighestZIndex] = useState(100);

  const openWindow = useCallback(
    (type) => {
      setHighestZIndex((prevZ) => prevZ + 1);
      setWindows((currentWindows) => {
        const windowExists = currentWindows.some((win) => win.type === type);

        if (windowExists) {
          return currentWindows.map((win) => {
            if (win.type === type) {
              return { ...win, minimized: false, zIndex: highestZIndex + 1 };
            }
            return win;
          });
        }

        setNextId((prevId) => prevId + 1);
        const newWindow = { id: nextId, type, minimized: false, maximized: false, zIndex: highestZIndex + 1 };
        return [...currentWindows, newWindow];
      });
    },
    [nextId, highestZIndex] // Removido 'windows' da dependência
  );

  const closeWindow = useCallback((id) => {
    setWindows((currentWindows) => currentWindows.filter((win) => win.id !== id));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((currentWindows) =>
      currentWindows.map((win) =>
        win.id === id ? { ...win, minimized: true } : win
      )
    );
  }, []);

  const focusWindow = useCallback(
    (id) => {
      setHighestZIndex((prevZ) => {
        const newZIndex = prevZ + 1;
        setWindows((currentWindows) =>
          currentWindows.map((win) =>
            win.id === id ? { ...win, minimized: false, zIndex: newZIndex } : win
          )
        );
        return newZIndex;
      });
    },
    [] // Removido 'highestZIndex' da dependência
  );

  const toggleMaximize = useCallback(
    (id) => {
      setHighestZIndex((prevZ) => {
        let newZIndex = prevZ;
        setWindows((currentWindows) =>
          currentWindows.map((win) => {
            if (win.id === id && !win.maximized) {
              newZIndex = prevZ + 1;
              return { ...win, maximized: true, minimized: false, zIndex: newZIndex };
            } else if (win.id === id && win.maximized) {
              return { ...win, maximized: false };
            }
            return win;
          })
        );
        return newZIndex;
      });
    },
    [] // Removido 'highestZIndex' da dependência
  );

  const value = { windows, openWindow, closeWindow, minimizeWindow, focusWindow, toggleMaximize, highestZIndex };

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}
