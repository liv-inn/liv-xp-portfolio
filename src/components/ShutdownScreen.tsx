import { useEffect, useState } from "react";
import { useSettings } from "../context/useSettings";
import { LivXpLogo } from "./BootScreen";

function ShutdownScreen({ onRestart }: { onRestart: () => void }) {
  const { t } = useSettings();
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSaving(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (saving) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-[#5A7EDC] font-sans text-white">
        <LivXpLogo size="text-6xl" />
        <p className="text-lg">{t.shutdown.saving}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4 cursor-pointer font-sans" onClick={onRestart}>
      <p className="text-[#FF9A2E] text-2xl md:text-3xl text-center px-6">{t.shutdown.safe}</p>
      <p className="text-white/40 text-sm">{t.shutdown.restart}</p>
    </div>
  );
}

export default ShutdownScreen;
