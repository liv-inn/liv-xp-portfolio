import { useState, type ComponentType, type ReactNode } from "react";
import { FaReact, FaCss3Alt, FaJsSquare, FaJava, FaBolt, FaFigma, FaMobileAlt, FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiSpringboot } from "react-icons/si";
import { useSettings } from "../context/useSettings";
import { FolderIcon, FileIcon, IniIcon, IeIcon, ShortcutBadge } from "./XpIcons";

interface Tool {
  name: string;
  icon: ReactNode;
}

interface Project {
  id: string;
  title: string;
  link?: string;
  code?: string;
  tools: Tool[];
}

const T = {
  react: { name: "React", icon: <FaReact /> },
  reactNative: { name: "React Native", icon: <FaMobileAlt /> },
  ts: { name: "TypeScript", icon: <SiTypescript /> },
  js: { name: "JavaScript", icon: <FaJsSquare /> },
  tailwind: { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  css: { name: "CSS", icon: <FaCss3Alt /> },
  vite: { name: "Vite", icon: <FaBolt /> },
  figma: { name: "Figma", icon: <FaFigma /> },
  java: { name: "Java", icon: <FaJava /> },
  spring: { name: "Spring Boot", icon: <SiSpringboot /> },
  rest: { name: "REST APIs", icon: <FaJava /> },
} satisfies Record<string, Tool>;

const projects: Project[] = [
  {
    id: "livxp",
    title: "Liv XP",
    link: "https://liv-xp-portfolio.vercel.app",
    code: "https://github.com/liv-inn/liv-xp-portfolio",
    tools: [T.react, T.ts, T.tailwind, T.vite, T.figma],
  },
  {
    id: "bluezoneApp",
    title: "Blue Zone App",
    code: "https://github.com/liv-inn",
    tools: [T.reactNative, T.ts, T.tailwind],
  },
  {
    id: "hitch",
    title: "Hitch AI",
    link: "https://hitch-conselheiro-amoroso.vercel.app",
    tools: [T.react, T.tailwind, T.js, T.java, T.spring, T.rest, T.figma],
  },
  {
    id: "bluezoneSite",
    title: "Blue Zone Clinic",
    link: "https://fehmell.github.io/BlueZone-Clinic/",
    tools: [T.react, T.tailwind, T.js, T.css, T.figma],
  },
  {
    id: "landing",
    title: "Portfolio Landing Page",
    link: "https://liv-inn.github.io/portifolio-landingpage/",
    tools: [T.react, T.tailwind, T.js, T.css, T.figma],
  },
];

type FileKind = "readme" | "stack" | "site" | "code";

const FILE_ICONS: Record<FileKind, ComponentType<{ className?: string }>> = {
  readme: FileIcon,
  stack: IniIcon,
  site: IeIcon,
  code: GithubFileIcon,
};

function GithubFileIcon({ className }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center ${className ?? ""}`}>
      <FaGithub className="w-4/5 h-4/5 text-[#24292F]" />
    </span>
  );
}

function filesOf(project: Project): FileKind[] {
  const files: FileKind[] = ["readme", "stack"];
  if (project.link) files.push("site");
  if (project.code) files.push("code");
  return files;
}

function ProjectsWindow() {
  const { t } = useSettings();
  const p = t.projects;
  const [openId, setOpenId] = useState<string | null>(null);
  const [openFile, setOpenFile] = useState<FileKind | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const current = projects.find((proj) => proj.id === openId) ?? null;

  let address = p.address;
  if (current) address += `\\${current.title}`;
  if (current && openFile) address += `\\${p.files[openFile]}`;

  const goUp = () => {
    setSelected(null);
    if (openFile) setOpenFile(null);
    else setOpenId(null);
  };

  const openFolder = (id: string) => {
    setOpenId(id);
    setOpenFile(null);
    setSelected(null);
  };

  const activateFile = (project: Project, kind: FileKind) => {
    // GitHub refuses to be framed, so the shortcut just opens a new tab
    if (kind === "code") {
      window.open(project.code, "_blank", "noopener,noreferrer");
      return;
    }
    setOpenFile(kind);
    setSelected(null);
  };

  const itemCount = current ? filesOf(current).length : projects.length;

  return (
    <div className="h-full flex flex-col bg-white font-xp text-sm">
      <div className="flex items-center gap-2 px-2 py-1 bg-[#ECE9D8] border-b border-[#ACA899] shrink-0">
        <button onClick={goUp} disabled={!current} className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs hover:bg-white/70 disabled:opacity-40">
          <span className="w-5 h-5 rounded-full bg-[#3FA33F] text-white flex items-center justify-center">
            <FaArrowLeft size={10} />
          </span>
          {p.back}
        </button>
        <div className="flex-1 flex items-center gap-1 bg-white border border-[#7F9DB9] px-1 py-0.5 text-xs min-w-0">
          <FolderIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden sm:flex flex-col gap-3 w-48 shrink-0 p-3 bg-linear-to-b from-[#7BA2E7] to-[#6375D6] overflow-y-auto">
          <section className="rounded-t-md overflow-hidden">
            <h4 className="px-2 py-1 text-xs font-bold text-[#215DC6] bg-linear-to-r from-white to-[#C6D3F7]">{p.tasks}</h4>
            <div className="bg-[#D6DFF7] p-2 text-xs space-y-1.5">
              {current ? (
                <>
                  {current.link && (
                    <a href={current.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#215DC6] hover:underline">
                      <FaExternalLinkAlt /> {p.openSite}
                    </a>
                  )}
                  {current.code && (
                    <a href={current.code} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#215DC6] hover:underline">
                      <FaGithub /> {p.viewCode}
                    </a>
                  )}
                  {!openFile && <p className="text-[#215DC6] pt-1">{p.fileHint}</p>}
                </>
              ) : (
                <p className="text-[#215DC6]">{p.hint}</p>
              )}
            </div>
          </section>
          {current && (
            <section className="rounded-t-md overflow-hidden">
              <h4 className="px-2 py-1 text-xs font-bold text-[#215DC6] bg-linear-to-r from-white to-[#C6D3F7]">{p.tools}</h4>
              <ul className="bg-[#D6DFF7] p-2 text-xs space-y-1 text-[#215DC6]">
                {current.tools.map((tool) => (
                  <li key={tool.name} className="flex items-center gap-1.5">
                    {tool.icon} {tool.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="rounded-t-md overflow-hidden">
            <h4 className="px-2 py-1 text-xs font-bold text-[#215DC6] bg-linear-to-r from-white to-[#C6D3F7]">{p.otherPlaces}</h4>
            <div className="bg-[#D6DFF7] p-2 text-xs">
              <a href="https://github.com/liv-inn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#215DC6] hover:underline">
                <FaGithub /> GitHub
              </a>
            </div>
          </section>
        </aside>

        <main className={`flex-1 min-w-0 flex flex-col ${openFile ? "" : "overflow-y-auto p-3"}`}>
          {current && openFile === "site" && current.link ? (
            <BrowserView url={current.link} />
          ) : current && openFile ? (
            <NotepadView text={openFile === "readme" ? readmeText(current, p) : stackText(current)} />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 content-start flex-1" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
              {current
                ? filesOf(current).map((kind) => (
                    <ExplorerItem
                      key={kind}
                      label={p.files[kind]}
                      Icon={FILE_ICONS[kind]}
                      shortcut={kind === "site" || kind === "code"}
                      selected={selected === kind}
                      onSelect={() => setSelected(kind)}
                      onOpen={() => activateFile(current, kind)}
                    />
                  ))
                : projects.map((proj) => (
                    <ExplorerItem
                      key={proj.id}
                      label={proj.title}
                      Icon={FolderIcon}
                      selected={selected === proj.id}
                      onSelect={() => setSelected(proj.id)}
                      onOpen={() => openFolder(proj.id)}
                    />
                  ))}
            </div>
          )}
        </main>
      </div>

      <div className="px-2 py-0.5 text-[11px] text-gray-600 bg-[#ECE9D8] border-t border-[#ACA899] shrink-0">{p.count(itemCount)}</div>
    </div>
  );
}

interface ExplorerItemProps {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  shortcut?: boolean;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

function ExplorerItem({ label, Icon, shortcut, selected, onSelect, onOpen }: ExplorerItemProps) {
  return (
    <button
      className="flex flex-col items-center gap-1 p-1 text-xs text-center outline-none"
      onClick={(e) => {
        onSelect();
        // touch / keyboard users open with a single activation
        if (e.detail === 0 || (e.nativeEvent as PointerEvent).pointerType === "touch") onOpen();
      }}
      onDoubleClick={onOpen}
    >
      <span className="relative">
        <Icon className="w-12 h-12" />
        {shortcut && <ShortcutBadge className="absolute bottom-0 left-0 w-4 h-4" />}
      </span>
      <span className={`px-1 break-all ${selected ? "bg-[#316AC5] text-white" : ""}`}>{label}</span>
    </button>
  );
}

type ProjectStrings = ReturnType<typeof useSettings>["t"]["projects"];

function readmeText(project: Project, p: ProjectStrings): string {
  const lines = [project.title, "=".repeat(project.title.length), "", p.descriptions[project.id] ?? "", ""];
  if (project.link) lines.push(`${p.siteLabel}: ${project.link}`);
  if (project.code) lines.push(`${p.codeLabel}: ${project.code}`);
  lines.push("", `${p.tools}:`, ...project.tools.map((tool) => `  - ${tool.name}`));
  return lines.join("\n");
}

function stackText(project: Project): string {
  const lines = [`; ${project.title}`, "[stack]", ...project.tools.map((tool) => `${tool.name.replace(/\s+/g, "")}=1`)];
  return lines.join("\n");
}

const URL_PATTERN = /(https?:\/\/\S+)/g;

function NotepadView({ text }: { text: string }) {
  const { t } = useSettings();
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex gap-3 px-2 py-0.5 text-xs bg-[#ECE9D8] border-b border-[#ACA899] shrink-0">
        {t.projects.notepadMenu.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <pre className="flex-1 min-h-0 overflow-auto p-2 font-mono text-xs whitespace-pre-wrap break-words select-text">
        {text.split(URL_PATTERN).map((part, i) =>
          // split() with a capture group puts the matched URLs at odd indexes
          i % 2 === 1 ? (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
              {part}
            </a>
          ) : (
            part
          ),
        )}
      </pre>
    </div>
  );
}

function BrowserView({ url }: { url: string }) {
  const { t } = useSettings();
  const p = t.projects;
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-1 px-2 py-1 bg-[#ECE9D8] border-b border-[#ACA899] text-xs shrink-0">
        <IeIcon className="w-4 h-4 shrink-0" />
        <span className="flex-1 min-w-0 truncate bg-white border border-[#7F9DB9] px-1 py-0.5">{url}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="xp-button px-2 py-0 text-xs">
          {p.ieGo}
        </a>
      </div>
      <iframe src={url} title={url} className="flex-1 min-h-0 w-full border-0 bg-white" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" />
      <div className="flex justify-between gap-2 px-2 py-0.5 text-[11px] text-gray-600 bg-[#ECE9D8] border-t border-[#ACA899] shrink-0">
        <span>{p.ieDone}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline truncate">
          {p.ieBlocked}
        </a>
      </div>
    </div>
  );
}

export default ProjectsWindow;
