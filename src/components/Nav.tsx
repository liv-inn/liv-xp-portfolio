import { useWindow } from "../context/useWindowManager";
import { useSettings } from "../context/useSettings";
import { APPS } from "../windows/registry";
import AppIconView from "./AppIconView";
import SystemTray from "./SystemTray";
import { sounds } from "../lib/sounds";
import startIcon from "../assets/start.webp";

interface Props {
  toggleMenu: () => void;
  onShowClippy?: () => void;
}

function Nav({ toggleMenu, onShowClippy }: Props) {
  const { windows, focusWindow, minimizeWindow, highestZIndex } = useWindow();
  const { t } = useSettings();

  return (
    <nav className="fixed bottom-0 z-[10000] w-full h-10 bg-[linear-gradient(180deg,#3168D5_0%,#4993E6_8%,#2157D7_15%,#2663E0_88%,#1941A5_100%)] flex justify-between items-center text-white font-xp">
      <div className="flex items-center h-full min-w-0 flex-1">
        <button
          onClick={() => {
            sounds.click();
            toggleMenu();
          }}
          className="flex items-center gap-1 font-bold italic text-lg h-full pl-2 pr-5 bg-[linear-gradient(180deg,#3C9F3C_0%,#5EC85E_10%,#3EA93E_50%,#2F8E2F_100%)] rounded-r-[14px] text-white shadow-[2px_0_4px_rgba(0,0,0,0.4)] hover:brightness-110 shrink-0"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}
        >
          <img src={startIcon} alt="" className="w-6 h-6" />
          <span className="font-sans">start</span>
        </button>
        <ul className="flex items-center h-full gap-1 px-2 overflow-x-auto min-w-0">
          {windows.map((win) => {
            const isActive = !win.minimized && win.zIndex === highestZIndex;
            return (
              <li key={win.id} className="shrink-0">
                <button
                  className={`flex items-center gap-1.5 px-2 h-8 text-xs w-36 sm:w-40 rounded-[3px] truncate ${
                    isActive
                      ? "bg-[#1E52B7] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)]"
                      : "bg-[#3C81F3] hover:bg-[#53A3FF] shadow-[inset_-1px_-1px_1px_rgba(0,0,0,0.3),inset_1px_1px_1px_rgba(255,255,255,0.3)]"
                  }`}
                  onClick={() => (isActive ? minimizeWindow(win.id) : focusWindow(win.id))}
                >
                  <AppIconView icon={APPS[win.type].icon} alt="" className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.apps[win.type]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <SystemTray onShowClippy={onShowClippy} />
    </nav>
  );
}

export default Nav;
