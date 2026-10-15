import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { WindowType } from "../types";
import { PaintIcon, MineIcon, WinampIcon, CmdIcon, RecycleIcon } from "../components/XpIcons";
import myComputerIcon from "../assets/my-computer.webp";
import projectsIcon from "../assets/projects.webp";
import aboutMeIcon from "../assets/about-me.webp";
import myResumeIcon from "../assets/my-resume.webp";
import contactIcon from "../assets/contact.webp";

export type AppIcon = string | ComponentType<{ className?: string }>;

export interface WindowContentProps {
  id: number;
}

interface AppDefinition {
  component: LazyExoticComponent<ComponentType<WindowContentProps>>;
  icon: AppIcon;
  /** Tailwind size classes applied to the window frame */
  size: string;
  /** Fixed-height windows manage their own scrolling */
  fixedHeight?: boolean;
  /** Hide minimize/maximize buttons (dialogs) */
  dialog?: boolean;
  /** Fixed-size apps (games, players) that shouldn't be maximized */
  noMaximize?: boolean;
}

// Each window is its own chunk, fetched the first time it is opened
export const APPS: Record<WindowType, AppDefinition> = {
  welcome: {
    component: lazy(() => import("../components/WelcomeAlert")),
    icon: aboutMeIcon,
    size: "w-[420px] max-w-[95vw]",
    dialog: true,
  },
  about: {
    component: lazy(() => import("../components/AboutMeWindow")),
    icon: aboutMeIcon,
    size: "w-[480px] max-w-[95vw]",
  },
  resume: {
    component: lazy(() => import("../components/ResumeWindow")),
    icon: myResumeIcon,
    size: "w-[640px] max-w-[95vw] h-[75vh]",
    fixedHeight: true,
  },
  projects: {
    component: lazy(() => import("../components/ProjectsWindow")),
    icon: projectsIcon,
    size: "w-[760px] max-w-[95vw] h-[460px] max-h-[80vh]",
    fixedHeight: true,
  },
  contact: {
    component: lazy(() => import("../components/ContactMeWindow")),
    icon: contactIcon,
    size: "w-[560px] max-w-[95vw]",
  },
  mycomputer: {
    component: lazy(() => import("../components/MyComputerWindow")),
    icon: myComputerIcon,
    size: "w-[480px] max-w-[95vw]",
  },
  paint: {
    component: lazy(() => import("../components/apps/PaintWindow")),
    icon: PaintIcon,
    size: "w-[720px] max-w-[95vw] h-[540px] max-h-[80vh]",
    fixedHeight: true,
  },
  minesweeper: {
    component: lazy(() => import("../components/apps/MinesweeperWindow")),
    icon: MineIcon,
    size: "w-auto",
    noMaximize: true,
  },
  winamp: {
    component: lazy(() => import("../components/apps/WinampWindow")),
    icon: WinampIcon,
    size: "w-[320px] max-w-[95vw]",
    noMaximize: true,
  },
  cmd: {
    component: lazy(() => import("../components/apps/CmdWindow")),
    icon: CmdIcon,
    size: "w-[660px] max-w-[95vw] h-[420px] max-h-[80vh]",
    fixedHeight: true,
  },
  recycle: {
    component: lazy(() => import("../components/apps/RecycleBinWindow")),
    icon: RecycleIcon,
    size: "w-[660px] max-w-[95vw] h-[420px] max-h-[80vh]",
    fixedHeight: true,
  },
};

export const DESKTOP_ICONS: WindowType[] = [
  "mycomputer",
  "resume",
  "projects",
  "about",
  "contact",
  "cmd",
  "paint",
  "minesweeper",
  "winamp",
  "recycle",
];
