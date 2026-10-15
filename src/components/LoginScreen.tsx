import { useSettings } from "../context/useSettings";
import { LivXpLogo } from "./BootScreen";
import { PowerIcon } from "./XpIcons";
import livImg from "../assets/liv.webp";

interface Props {
  onLogin: () => void;
  onTurnOff: () => void;
}

function LoginScreen({ onLogin, onTurnOff }: Props) {
  const { t, toggleLang, lang } = useSettings();

  return (
    <div className="fixed inset-0 flex flex-col bg-[#5A7EDC] font-sans text-white select-none">
      <div className="h-[12%] min-h-14 bg-[#00309C] border-b-2 border-[#F79A3A]" />

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 px-6 bg-[radial-gradient(circle_at_20%_20%,#86A6EC_0%,#5A7EDC_45%)]">
        <div className="md:w-1/2 flex flex-col items-center md:items-end md:pr-10 text-center md:text-right">
          <LivXpLogo size="text-6xl" />
          <p className="mt-4 text-lg">{t.login.begin}</p>
        </div>

        <div className="hidden md:block w-px self-stretch my-[10%] bg-linear-to-b from-transparent via-white/70 to-transparent" />

        <div className="md:w-1/2 md:pl-10 flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="group flex items-center gap-4 p-2 pr-6 rounded-lg hover:bg-[#00309C]/50 focus:bg-[#00309C]/50 outline-none text-left transition-colors"
          >
            <img
              src={livImg}
              alt="Lívia Neves"
              className="w-16 h-16 rounded-md border-[3px] border-white/80 group-hover:border-[#FFCC33] group-focus:border-[#FFCC33] object-cover"
            />
            <span>
              <span className="block text-xl">Lívia Neves</span>
              <span className="block text-sm text-white/80">{t.login.role}</span>
            </span>
          </button>
          <p className="text-xs text-white/70 max-w-64">{t.login.hint}</p>
        </div>
      </main>

      <footer className="h-[12%] min-h-14 bg-[#00309C] border-t-2 border-[#7FA5FF] flex items-center justify-between px-6">
        <button onClick={onTurnOff} className="flex items-center gap-2 text-sm hover:underline">
          <PowerIcon className="w-7 h-7" />
          {t.login.turnOff}
        </button>
        <button onClick={toggleLang} className="text-xs border border-white/60 rounded px-2 py-1 hover:bg-white/10">
          {lang === "en" ? "PT" : "EN"}
        </button>
      </footer>
    </div>
  );
}

export default LoginScreen;
