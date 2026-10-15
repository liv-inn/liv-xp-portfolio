import type { ReactNode } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useSettings } from "../context/useSettings";
import { useWindow } from "../context/useWindowManager";
import myResumeIcon from "../assets/my-resume.webp";

interface DriveItemProps {
  icon: ReactNode;
  name: string;
  description: string;
  link?: string;
  onClick?: () => void;
}

const DRIVE_CLASS = "flex items-center gap-4 p-2 hover:bg-blue-100 hover:border-blue-300 border border-transparent rounded-sm cursor-pointer text-left w-full";

function DriveItem({ icon, name, description, link, onClick }: DriveItemProps) {
  const content = (
    <>
      {icon}
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </>
  );
  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={DRIVE_CLASS}>
        {content}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={DRIVE_CLASS}>
      {content}
    </button>
  );
}

function MyComputerWindow() {
  const { t } = useSettings();
  const { openWindow } = useWindow();
  const m = t.mycomputer;

  return (
    <div className="bg-white p-2 font-xp text-sm flex flex-col gap-4">
      <section>
        <h3 className="text-xs font-bold text-[#0B3A9E] px-2 pb-1 border-b border-[#7A96DF] mb-1">{m.drives}</h3>
        <div className="flex flex-col gap-1">
          <DriveItem icon={<FaGithub size={32} className="text-gray-700" />} name={m.github} description={m.githubDesc} link="https://github.com/liv-inn" />
          <DriveItem
            icon={<FaLinkedin size={32} className="text-blue-700" />}
            name={m.linkedin}
            description={m.linkedinDesc}
            link="https://www.linkedin.com/in/livia-a-neves/"
          />
        </div>
      </section>
      <section>
        <h3 className="text-xs font-bold text-[#0B3A9E] px-2 pb-1 border-b border-[#7A96DF] mb-1">{m.devices}</h3>
        <div className="flex flex-col gap-1">
          <DriveItem icon={<img src={myResumeIcon} alt="" className="w-8 h-8" />} name={m.resume} description={m.resumeDesc} onClick={() => openWindow("resume")} />
          <DriveItem icon={<FaEnvelope size={32} className="text-red-500" />} name={m.email} description={m.emailDesc} onClick={() => openWindow("contact")} />
        </div>
      </section>
    </div>
  );
}

export default MyComputerWindow;
