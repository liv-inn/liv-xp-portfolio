import { useWindow } from "../context/useWindow";
import SystemTray from "./SystemTray";
import { useEffect } from "react";
import startIcon from '../assets/start.png';

function Nav({ toggleMenu }) {
  const { openWindow, windows, focusWindow, highestZIndex } = useWindow();

  useEffect(() => {
    openWindow("Welcome");
  }, []);

  return (
    <nav className="fixed bottom-0 w-full h-8 bg-gradient-to-t from-[#0947C3] to-[#3A85E6] border-t-2 border-[#5A9BFF] flex justify-between items-center text-white font-xp">
      <div className="flex items-center h-full">
        <button onClick={toggleMenu} className="flex items-center font-bold text-sm h-full px-3 bg-gradient-to-b from-[#37B63F] to-[#24992A] rounded-r-md text-white shadow-md hover:from-[#4EBF55] hover:to-[#33983A]">
          <img src={startIcon} alt="Start" className="w-5 h-5 inline-block mr-1" />
          <span>Start</span>
        </button>
        <div className="h-full w-px bg-blue-900/50 mx-2"></div>
        <ul className="flex items-center h-full">
          {windows.map((win) => {
            const isActive = !win.minimized && win.zIndex === highestZIndex;
            return (
              <li
                key={win.id}
                className={`flex items-center justify-start cursor-pointer px-2 h-7 text-xs min-w-30 max-w-30 truncate mx-1 rounded-sm ${isActive ? "bg-[#1654C2] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.7)]" : "bg-[#3A77E8] hover:bg-[#4C88F2] shadow-[1px_1px_2px_rgba(0,0,0,0.5)]"}`}
                onClick={() => focusWindow(win.id)}
              >
                <span>{win.type}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <SystemTray />
    </nav>
  );
}

export default Nav;