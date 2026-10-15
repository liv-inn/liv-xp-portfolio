import { useState, type ReactNode } from "react";
import { FaReact, FaCss3Alt, FaJsSquare, FaJava, FaBolt, FaFigma, FaMobileAlt, FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiSpringboot } from "react-icons/si";
import { useSettings } from "../context/useSettings";
import { FolderIcon } from "./XpIcons";
import portfolio2Img from "../assets/portfolio2.webp";
import portfolioImg from "../assets/portfolio.webp";
import hitchImg from "../assets/hitch.webp";
import bluezoneImg from "../assets/bluezone.webp";

interface Tool {
  name: string;
  icon: ReactNode;
}

interface Project {
  id: string;
  title: string;
  link?: string;
  code?: string;
  image?: string;
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
    image: portfolio2Img,
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
    image: hitchImg,
    tools: [T.react, T.tailwind, T.js, T.java, T.spring, T.rest, T.figma],
  },
  {
    id: "bluezoneSite",
    title: "Blue Zone Clinic",
    link: "https://fehmell.github.io/BlueZone-Clinic/",
    image: bluezoneImg,
    tools: [T.react, T.tailwind, T.js, T.css, T.figma],
  },
  {
    id: "landing",
    title: "Portfolio Landing Page",
    link: "https://liv-inn.github.io/portifolio-landingpage/",
    image: portfolioImg,
    tools: [T.react, T.tailwind, T.js, T.css, T.figma],
  },
];

function ProjectsWindow() {
  const { t } = useSettings();
  const p = t.projects;
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const current = projects.find((proj) => proj.id === openId) ?? null;
  const address = current ? `${p.address}\\${current.title}` : p.address;

  return (
    <div className="h-full flex flex-col bg-white font-xp text-sm">
      <div className="flex items-center gap-2 px-2 py-1 bg-[#ECE9D8] border-b border-[#ACA899] shrink-0">
        <button
          onClick={() => setOpenId(null)}
          disabled={!current}
          className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs hover:bg-white/70 disabled:opacity-40"
        >
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
                </>
              ) : (
                <p className="text-[#215DC6]">{p.hint}</p>
              )}
            </div>
          </section>
          <section className="rounded-t-md overflow-hidden">
            <h4 className="px-2 py-1 text-xs font-bold text-[#215DC6] bg-linear-to-r from-white to-[#C6D3F7]">{p.otherPlaces}</h4>
            <div className="bg-[#D6DFF7] p-2 text-xs">
              <a href="https://github.com/liv-inn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#215DC6] hover:underline">
                <FaGithub /> GitHub
              </a>
            </div>
          </section>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto p-3">
          {current ? (
            <ProjectDetails project={current} />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2" onClick={(e) => e.target === e.currentTarget && setSelectedId(null)}>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  className="flex flex-col items-center gap-1 p-1 text-xs text-center outline-none"
                  onClick={(e) => {
                    setSelectedId(proj.id);
                    // touch / keyboard users open with a single activation
                    if (e.detail === 0 || (e.nativeEvent as PointerEvent).pointerType === "touch") setOpenId(proj.id);
                  }}
                  onDoubleClick={() => setOpenId(proj.id)}
                >
                  <FolderIcon className="w-12 h-12" />
                  <span className={`px-1 ${selectedId === proj.id ? "bg-[#316AC5] text-white" : ""}`}>{proj.title}</span>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <div className="px-2 py-0.5 text-[11px] text-gray-600 bg-[#ECE9D8] border-t border-[#ACA899] shrink-0">{p.count(projects.length)}</div>
    </div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  const { t } = useSettings();
  const p = t.projects;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {project.image ? (
        <img src={project.image} alt={project.title} className="w-full md:w-64 h-auto self-start border-2 border-[#ACA899] shadow" />
      ) : (
        <div className="w-full md:w-64 aspect-[3/2] flex items-center justify-center bg-linear-to-br from-[#2B6CB0] to-[#38B2AC] text-white border-2 border-[#ACA899] shadow">
          <FaMobileAlt size={56} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base text-[#0B3A9E]">{project.title}</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 my-1 text-xs">
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all">
              {project.link}
            </a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline inline-flex items-center gap-1">
              <FaGithub /> {p.viewCode}
            </a>
          )}
        </div>
        <p className="text-xs my-3">{p.descriptions[project.id]}</p>
        <p className="font-bold text-xs mb-1">{p.tools}:</p>
        <div className="flex gap-1.5 flex-wrap">
          {project.tools.map((tool) => (
            <span key={tool.name} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-300 rounded-sm text-xs">
              <span className="text-blue-600">{tool.icon}</span>
              {tool.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsWindow;
