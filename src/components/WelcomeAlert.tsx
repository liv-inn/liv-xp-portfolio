import { useEffect } from "react";
import { useWindow } from "../context/useWindowManager";
import { useSettings } from "../context/useSettings";
import { sounds } from "../lib/sounds";
import type { WindowContentProps } from "../windows/registry";

const CAT = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⢿⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⣿⠉⢻⣦⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠏⠈⣿⣆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣿⠃⠀⠀⠹⣷⡄⠀⠀⠀⠀⠀⣠⡾⠇⠀⠀⠘⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣾⠃⠀⠀⠄⠈⠌⢿⣦⣤⣤⣤⣴⠟⠡⠀⠀⠠⠀⠘⣿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣸⡟⠀⠀⢂⠄⠊⠀⠀⠉⠁⠀⠈⠉⠀⠀⠐⠠⡀⠀⠀⠹⣷⡀⠀⠀⠀⠀
⠀⠀⠀⠀⢰⡿⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠀⠀⢻⣧⠀⠀⠀⠀
⠀⠀⠀⢀⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡆⠀⠀⠀
⠀⢀⣀⣼⣷⣤⣤⣤⣤⣤⣤⣤⣤⣄⣀⣀⣀⠀⢀⣀⣀⣠⣤⣤⣤⣤⣤⣤⣼⣧⡀⠀⠀
⣴⣿⠟⠉⠁⢠⣾⣿⣯⠙⠛⠛⠉⠙⠻⣿⡿⠿⢿⣿⣿⠟⠛⠉⣿⣿⣿⡟⠛⠛⢿⣿⡄
⣿⣿⡄⠀⠀⠸⣿⣿⡿⠁⠀⠀⠀⠀⣠⣿⠁⠀⠀⠹⣿⣄⠀⠀⢿⣿⣿⠟⠀⠀⠀⣿⠇
⠈⠻⣿⣷⣶⣤⣤⣤⣤⣤⣤⣤⣴⡾⠿⠃⠀⠀⠀⠀⠈⠻⠿⢶⣶⣾⣧⣤⣤⡶⣿⠛⠀
⠀⠀⣿⠀⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠦⡄⠀⠀⠀⠀⠀⠀⠈⠀⢻⡆⠀
⠀⠀⣿⠀⠁⠀⠀⠀⠀⠂⠀⠀⣾⣁⣤⢷⣄⣀⣀⣀⡴⠃⠀⠀⠀⠀⠀⠀⠈⠀⢸⡇⠀
⠀⠀⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠈⠉⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠃⠀
⠀⠀⠈⠛⠷⣶⣤⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣠⣤⣶⠶⠟⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠙⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠋⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀`;

function WelcomeAlert({ id }: WindowContentProps) {
  const { closeWindow } = useWindow();
  const { t } = useSettings();

  useEffect(() => {
    sounds.ding();
  }, []);

  return (
    <div className="bg-[#ECE9D8] p-4 font-xp text-sm flex flex-col">
      <div className="flex items-start gap-4 p-2">
        <span className="shrink-0 w-8 h-8 rounded-full bg-[#1F6FE5] text-white font-bold font-serif text-lg flex items-center justify-center shadow">i</span>
        <div className="space-y-2 text-xs">
          <p className="font-bold">{t.welcome.hi}</p>
          <p>{t.welcome.hint}</p>
          <pre className="text-[7px] leading-[7px] text-gray-700 select-none" aria-hidden>{CAT}</pre>
        </div>
      </div>
      <div className="flex justify-center p-2">
        <button onClick={() => closeWindow(id)} className="xp-button px-8" autoFocus>
          OK
        </button>
      </div>
    </div>
  );
}

export default WelcomeAlert;
