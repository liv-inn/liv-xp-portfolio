import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useSettings } from "../../context/useSettings";
import { useWindow } from "../../context/useWindowManager";
import { WINDOW_TYPES } from "../../windows/windowTypes";
import { strings, type Strings } from "../../i18n/strings";
import type { WindowType } from "../../types";
import type { WindowContentProps } from "../../windows/registry";

const PROMPT = "C:\\Users\\Liv>";

interface Line {
  text: string;
  kind?: "input" | "error" | "accent";
}

const APP_ALIASES: Record<string, WindowType> = {
  cv: "resume",
  curriculo: "resume",
  projetos: "projects",
  contato: "contact",
  sobre: "about",
  lixeira: "recycle",
  computer: "mycomputer",
  mines: "minesweeper",
  campominado: "minesweeper",
  music: "winamp",
};

function resolveApp(name: string): WindowType | null {
  const key = name.toLowerCase();
  if ((WINDOW_TYPES as string[]).includes(key)) return key as WindowType;
  return APP_ALIASES[key] ?? null;
}

const banner = (t: Strings): Line[] => t.cmd.banner.map((text) => ({ text }));

function CmdWindow({ id }: WindowContentProps) {
  const { t, lang, setLang } = useSettings();
  const { openWindow, closeWindow } = useWindow();
  const [lines, setLines] = useState<Line[]>(() => banner(t));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const run = (raw: string): Line[] => {
    const [command = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");
    const r = t.resume;

    switch (command.toLowerCase()) {
      case "":
        return [];
      case "help":
      case "ajuda":
        return t.cmd.help.map(([cmd, desc]) => ({ text: `  ${cmd.padEnd(14)} ${desc}` }));
      case "whoami":
        return [{ text: t.cmd.whoami, kind: "accent" }];
      case "about":
      case "sobre":
        return [{ text: t.about.summary }];
      case "skills":
        return r.skills.map(([label, value]) => ({ text: `  ${(label + ":").padEnd(16)} ${value}` }));
      case "experience":
      case "experiencia":
        return r.experience.flatMap((job) => [
          { text: `${job.role} @ ${job.company}`, kind: "accent" as const },
          { text: `  ${job.period}` },
          { text: "" },
        ]);
      case "projects":
      case "projetos":
        openWindow("projects");
        return [
          ...r.projects.flatMap((p) => [{ text: `• ${p.name}`, kind: "accent" as const }, { text: `  ${p.stack}` }]),
          { text: "" },
          { text: t.cmd.opening(t.apps.projects) },
        ];
      case "contact":
      case "contato":
        return [
          { text: "  Email:    livianeves.dev@gmail.com" },
          { text: "  LinkedIn: linkedin.com/in/livia-a-neves" },
          { text: "  GitHub:   github.com/liv-inn" },
        ];
      case "open":
      case "start":
      case "abrir": {
        const app = resolveApp(arg);
        if (!app) return [{ text: t.cmd.unknownApp(arg || "?"), kind: "error" }];
        openWindow(app);
        return [{ text: t.cmd.opening(t.apps[app]) }];
      }
      case "lang": {
        const next = arg.toLowerCase();
        if (next !== "en" && next !== "pt") return [{ text: "lang <en|pt>", kind: "error" }];
        setLang(next);
        return [{ text: strings[next].cmd.langChanged }];
      }
      case "date":
      case "time":
      case "data":
        return [{ text: new Date().toLocaleString(lang === "pt" ? "pt-BR" : "en-US") }];
      case "echo":
        return [{ text: arg }];
      case "ver":
        return [{ text: t.cmd.banner[0] }];
      case "sudo":
        return [{ text: t.cmd.sudo, kind: "error" }];
      case "hire":
      case "contratar":
        openWindow("contact");
        return [{ text: t.cmd.hire, kind: "accent" }];
      case "cls":
      case "clear":
        setLines([]);
        return [];
      case "exit":
        closeWindow(id);
        return [];
      default:
        return [{ text: t.cmd.unknown(command), kind: "error" }];
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = input;
      const output = run(command);
      const cleared = /^(cls|clear)$/i.test(command.trim());
      if (!cleared) setLines((prev) => [...prev, { text: `${PROMPT}${command}`, kind: "input" }, ...output, ...(command.trim() ? [{ text: "" }] : [])]);
      if (command.trim()) setHistory((h) => [...h, command]);
      setHistoryIndex(null);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(index);
        setInput(history[index]);
      }
    }
  };

  return (
    <div
      className="h-full bg-black text-[#C0C0C0] font-mono text-[13px] leading-snug p-2 overflow-y-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <pre
          key={i}
          className={`whitespace-pre-wrap break-words min-h-[1.2em] ${
            line.kind === "error" ? "text-[#FF6B6B]" : line.kind === "accent" ? "text-[#7CFC9A]" : line.kind === "input" ? "text-white" : ""
          }`}
        >
          {line.text}
        </pre>
      ))}
      <div className="flex" ref={bottomRef}>
        <span className="text-white whitespace-pre">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none text-white caret-white"
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Command input"
        />
      </div>
    </div>
  );
}

export default CmdWindow;
