import { useState, type ReactNode } from "react";
import { useWindow } from "../context/useWindowManager";
import { useSettings } from "../context/useSettings";
import { APPS } from "../windows/registry";
import AppIconView from "./AppIconView";
import { LogOffIcon, PowerIcon } from "./XpIcons";
import { WINDOW_TYPES } from "../windows/windowTypes";
import { FaGithub, FaLinkedin, FaEnvelope, FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaJava, FaGitAlt, FaDocker, FaLinux, FaPhp } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { SiPostgresql, SiSpringboot, SiTailwindcss, SiTypescript, SiLaravel, SiVtex, SiGraphql } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import programsIcon from "../assets/programs.webp";
import livImg from "../assets/liv.webp";
import type { WindowType } from "../types";

const technologies: { name: string; icon: ReactNode }[] = [
  { name: "React.js", icon: <FaReact size={20} className="text-blue-500" /> },
  { name: "TypeScript", icon: <SiTypescript size={20} className="text-blue-500" /> },
  { name: "JavaScript", icon: <FaJsSquare size={20} className="text-yellow-500" /> },
  { name: "HTML5", icon: <FaHtml5 size={20} className="text-orange-600" /> },
  { name: "CSS3", icon: <FaCss3Alt size={20} className="text-blue-600" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss size={20} className="text-cyan-500" /> },
  { name: "VTEX", icon: <SiVtex size={20} className="text-pink-600" /> },
  { name: "GraphQL", icon: <SiGraphql size={20} className="text-pink-500" /> },
  { name: "PHP", icon: <FaPhp size={20} className="text-indigo-500" /> },
  { name: "Laravel", icon: <SiLaravel size={20} className="text-red-500" /> },
  { name: "Java", icon: <FaJava size={20} className="text-orange-500" /> },
  { name: "Spring Boot", icon: <SiSpringboot size={20} className="text-green-600" /> },
  { name: "C#", icon: <TbBrandCSharp size={20} className="text-purple-700" /> },
  { name: "PostgreSQL", icon: <SiPostgresql size={20} className="text-blue-700" /> },
  { name: "Git", icon: <FaGitAlt size={20} className="text-orange-700" /> },
  { name: "Linux", icon: <FaLinux size={20} /> },
  { name: "Docker", icon: <FaDocker size={20} className="text-blue-500" /> },
];

const LINKS = [
  { icon: <FaGithub size={22} />, text: "GitHub", href: "https://github.com/liv-inn" },
  { icon: <FaLinkedin size={22} className="text-blue-700" />, text: "LinkedIn", href: "https://www.linkedin.com/in/livia-a-neves/" },
  { icon: <FaEnvelope size={22} className="text-red-500" />, text: "Email", href: "mailto:livianeves.dev@gmail.com" },
];

const PINNED: WindowType[] = ["resume", "projects", "about", "contact"];
const ACCESSORIES: WindowType[] = ["cmd", "paint", "minesweeper", "winamp"];

interface Props {
  onClose: () => void;
  onLogOff: () => void;
  onTurnOff: () => void;
}

const ITEM = "flex items-center gap-2 w-full px-2 py-1 rounded-sm text-left text-sm hover:bg-[#316AC5] hover:text-white cursor-pointer";

function MenuContent({ onClose, onLogOff, onTurnOff }: Props) {
  const { openWindow } = useWindow();
  const { t } = useSettings();

  const open = (type: WindowType) => {
    openWindow(type);
    onClose();
  };

  return (
    <div className="fixed bottom-10 left-0 z-[10000] flex flex-col w-[min(400px,100vw)] max-h-[calc(100vh-2.5rem)] rounded-t-lg overflow-visible shadow-[2px_-2px_10px_rgba(0,0,0,0.5)] border border-[#0B3CB6] bg-[#1F5DD8] font-xp">
      <div className="flex items-center gap-3 p-2 h-16 rounded-t-lg bg-[linear-gradient(180deg,#1868CE_0%,#0E60CB_12%,#0E60CB_88%,#0A4FA8_100%)] shrink-0">
        <img src={livImg} alt="" className="w-12 h-12 rounded-[3px] border-2 border-white/90 object-cover shadow" />
        <span className="text-lg font-bold text-white" style={{ textShadow: "1px 1px 2px #000" }}>
          Lívia Neves
        </span>
      </div>
      <div className="h-[2px] bg-linear-to-r from-transparent via-[#F7A04B] to-transparent shrink-0" />

      <div className="flex min-h-0 overflow-visible">
        <div className="w-1/2 bg-white p-1.5 flex flex-col gap-0.5">
          {PINNED.map((type) => (
            <AppItem key={type} type={type} label={t.apps[type]} onOpen={open} bold />
          ))}
          <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-1" />
          {ACCESSORIES.map((type) => (
            <AppItem key={type} type={type} label={t.apps[type]} onOpen={open} />
          ))}
          <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-1 mt-auto" />
          <Submenu label={t.start.allPrograms} icon={<img src={programsIcon} alt="" className="w-6 h-6" />} bold>
            {WINDOW_TYPES.filter((type) => type !== "welcome").map((type) => (
              <button key={type} className={ITEM} onClick={() => open(type)}>
                <AppIconView icon={APPS[type].icon} alt="" className="w-5 h-5 shrink-0" />
                {t.apps[type]}
              </button>
            ))}
          </Submenu>
        </div>

        <div className="w-1/2 bg-[#D3E5FA] border-l border-[#95BDEE] p-1.5 flex flex-col gap-0.5 text-[#0A246A]">
          <AppItem type="mycomputer" label={t.apps.mycomputer} onOpen={open} bold />
          <AppItem type="recycle" label={t.apps.recycle} onOpen={open} />
          <div className="h-px bg-linear-to-r from-transparent via-[#95BDEE] to-transparent my-1" />
          {LINKS.map((link) => (
            <a key={link.text} href={link.href} target="_blank" rel="noopener noreferrer" className={ITEM} onClick={onClose}>
              <span className="w-8 h-8 flex items-center justify-center shrink-0">{link.icon}</span>
              {link.text}
            </a>
          ))}
          <div className="h-px bg-linear-to-r from-transparent via-[#95BDEE] to-transparent my-1 mt-auto" />
          <Submenu label={t.start.recentlyUsed} alignRight>
            {technologies.map((tech) => (
              <div key={tech.name} className="flex items-center gap-2 px-2 py-1 text-sm">
                <span className="w-5 flex justify-center">{tech.icon}</span>
                {tech.name}
              </div>
            ))}
          </Submenu>
        </div>
      </div>

      <div className="flex justify-end gap-3 px-3 py-1.5 bg-[linear-gradient(180deg,#1868CE_0%,#0E60CB_50%,#0A4FA8_100%)] text-white text-sm shrink-0">
        <button onClick={onLogOff} className="flex items-center gap-1.5 px-1 rounded hover:bg-white/15">
          <LogOffIcon className="w-6 h-6" />
          {t.start.logOff}
        </button>
        <button onClick={onTurnOff} className="flex items-center gap-1.5 px-1 rounded hover:bg-white/15">
          <PowerIcon className="w-6 h-6" />
          {t.start.turnOff}
        </button>
      </div>
    </div>
  );
}

interface AppItemProps {
  type: WindowType;
  label: string;
  bold?: boolean;
  onOpen: (type: WindowType) => void;
}

function AppItem({ type, label, bold = false, onOpen }: AppItemProps) {
  return (
    <button className={ITEM} onClick={() => onOpen(type)}>
      <AppIconView icon={APPS[type].icon} alt="" className="w-8 h-8 shrink-0" />
      <span className={bold ? "font-bold" : ""}>{label}</span>
    </button>
  );
}

interface SubmenuProps {
  label: string;
  icon?: ReactNode;
  bold?: boolean;
  alignRight?: boolean;
  children: ReactNode;
}

// Opens on hover for mouse users and on tap for touch users
function Submenu({ label, icon, bold, alignRight, children }: SubmenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className={`${ITEM} ${open ? "bg-[#316AC5] text-white" : ""}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {icon && <span className="w-8 h-8 flex items-center justify-center shrink-0">{icon}</span>}
        <span className={bold ? "font-bold" : ""}>{label}</span>
        <IoIosArrowForward className="ml-auto text-green-600" />
      </button>
      {open && (
        <div
          className={`absolute bottom-0 w-56 max-h-[60vh] overflow-y-auto bg-white border border-[#7A96DF] shadow-[2px_2px_6px_rgba(0,0,0,0.4)] p-1 z-10 text-black ${
            alignRight ? "right-0 sm:right-auto sm:left-full" : "left-0 sm:left-full"
          } max-sm:bottom-full`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default MenuContent;
