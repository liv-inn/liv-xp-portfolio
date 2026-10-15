import { useCallback, useState } from "react";
import Home from "./pages/Home";
import BootScreen from "./components/BootScreen";
import LoginScreen from "./components/LoginScreen";
import ShutdownScreen from "./components/ShutdownScreen";
import { WindowProvider } from "./context/WindowProvider";
import { SettingsProvider } from "./context/SettingsProvider";
import { load, save } from "./lib/storage";
import { sounds } from "./lib/sounds";
import type { Stage } from "./types";

// The boot + login sequence only plays once per browser session
const BOOTED_KEY = "liv-xp-booted";

function App() {
  const [stage, setStage] = useState<Stage>(() => (load(BOOTED_KEY, false, "session") ? "desktop" : "boot"));

  const logOn = useCallback(() => {
    sounds.startup();
    save(BOOTED_KEY, true, "session");
    setStage("desktop");
  }, []);

  const logOff = useCallback(() => {
    sounds.logoff();
    setStage("login");
  }, []);

  const turnOff = useCallback(() => {
    sounds.shutdown();
    save(BOOTED_KEY, false, "session");
    setStage("shutdown");
  }, []);

  return (
    <SettingsProvider>
      <WindowProvider>
        {stage === "boot" && <BootScreen onDone={() => setStage("login")} />}
        {stage === "login" && <LoginScreen onLogin={logOn} onTurnOff={turnOff} />}
        {stage === "desktop" && <Home onLogOff={logOff} onTurnOff={turnOff} />}
        {stage === "shutdown" && <ShutdownScreen onRestart={() => setStage("boot")} />}
      </WindowProvider>
    </SettingsProvider>
  );
}

export default App;
