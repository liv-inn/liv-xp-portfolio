import { useState } from 'react';
import { useWindow } from '../context/useWindow';
import { FaGithub, FaLinkedin, FaEnvelope, FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaAngular, FaJava, FaGitAlt, FaDocker, FaLinux, FaFigma, } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { SiPostgresql, SiMongodb, SiSpringboot, SiTailwindcss, SiTypescript } from 'react-icons/si';
import myComputerIcon from '../assets/my-computer.png';
import projectsIcon from '../assets/projects.png';
import aboutMeIcon from '../assets/about-me.png';
import myResumeIcon from '../assets/my-resume.png';
import programsIcon from '../assets/programs.png';
import livImg from '../assets/liv.jpg';

const technologies = [
  { name: "React.js", icon: <FaReact size={20} className="text-blue-500" /> },
  { name: "JavaScript", icon: <FaJsSquare size={20} className="text-yellow-500" /> },
  { name: "TypeScript", icon: <SiTypescript size={20} className="text-blue-500" /> },
  { name: "HTML5", icon: <FaHtml5 size={20} className="text-orange-600" /> },
  { name: "CSS3", icon: <FaCss3Alt size={20} className="text-blue-600" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss size={20} className="text-cyan-500" /> },
  { name: "Angular", icon: <FaAngular size={20} className="text-red-600" /> },
  { name: "Java", icon: <FaJava size={20} className="text-orange-500" /> },
  { name: "Spring Boot", icon: <SiSpringboot size={20} className="text-green-600" /> },
  { name: "PostgreSQL", icon: <SiPostgresql size={20} className="text-blue-700" /> },
  { name: "MongoDB", icon: <SiMongodb size={20} className="text-green-500" /> },
  { name: "Git", icon: <FaGitAlt size={20} className="text-orange-700" /> },
  { name: "Linux", icon: <FaLinux size={20} /> },
  { name: "Docker", icon: <FaDocker size={20} className="text-blue-500" /> },
  { name: "Figma", icon: <FaFigma size={20} /> },
];

const recentlyUsedSubmenu = technologies.slice(0, 15).map(tech => ({
  text: tech.name,
  icon: tech.icon
}));

function MenuContent() {
  const { openWindow } = useWindow();

  const programs = [
    { icon: myComputerIcon, text: "My Computer", bold: true, onClick: () => openWindow('My Computer') },
    { icon: projectsIcon, text: "Projects", bold: true, onClick: () => openWindow('Projects.exe') },
    { icon: aboutMeIcon, text: "About Me", bold: true, onClick: () => openWindow('about_me.exe') },
    { icon: myResumeIcon, text: "My Resume", bold: true, onClick: () => openWindow('myResume.pdf') },
    { isSeparator: true },
    { icon: <FaGithub size={20} />, text: "GitHub", link: "https://github.com/liv-inn" },
    { icon: <FaLinkedin size={20} className="text-blue-700" />, text: "LinkedIn", link: "https://www.linkedin.com/in/livia-a-neves/" },
    { icon: <FaEnvelope size={20} />, text: "Email", link: "mailto:livianeves.dev@gmail.com" },
  ];

  return (
    <div className="fixed bottom-8 flex flex-col w-full max-w-sm sm:w-96 h-[60vh] sm:h-112.5 rounded-t-lg shadow-2xl border border-t-white border-l-white border-r-black border-b-black bg-gradient-to-b from-[#1F6BDE] to-[#5298EE] font-xp">
      <div className="flex w-full items-center p-2 rounded-t-lg">
        <img src={livImg} alt="User" className="w-12 h-12 rounded border-2 border-white shadow-md" />
        <h1 className="text-lg font-bold text-white ml-3" style={{ textShadow: '1px 1px 2px #000' }}>
          Lívia Neves
        </h1>
      </div>

      <div className="flex w-full h-full bg-white border-t-2 border-blue-300">
        <div className="w-1/2 h-full bg-white p-2 space-y-1">
          {programs.slice(0, 4).map(item => <MenuItem key={item.text} {...item} />)}
          <div className="border-t border-gray-400 my-2" />
          <MenuItem icon={programsIcon} text="All Programs" submenu={programs} />
        </div>

        <div className="w-1/2 h-full bg-[#D6E8F7] p-2 space-y-1 border-l border-white">
          <MenuItem icon={<FaGithub size={24} />} text="GitHub" link="https://github.com/liv-inn" />
          <MenuItem icon={<FaLinkedin size={24} className="text-blue-700" />} text="LinkedIn" link="https://www.linkedin.com/in/livia-a-neves/" />
          <MenuItem icon={<FaEnvelope size={24} />} text="Email" link="mailto:livianeves.dev@gmail.com" />
          <div className="border-t border-gray-400 my-2" />
          <MenuItem text="Recently used" submenu={recentlyUsedSubmenu} submenuDirection="right" />
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, text, bold = false, onClick, link, submenu, isSubmenuItem = false, submenuDirection = 'right' }) {
  const [showSubmenu, setShowSubmenu] = useState(false);

  const content = (
    <>
      <div className="w-8 h-8 flex items-center justify-center">
        {icon && (typeof icon === 'string'
          ? <img src={icon} alt={text} className="w-8 h-8" />
          : icon)}
      </div>
      <span className={bold ? 'font-bold' : ''}>{text}</span>
    </>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" title={isSubmenuItem ? link : ''} className="text-black relative group hover:bg-[#316AC5] hover:text-white px-2 py-1 rounded-sm cursor-pointer flex items-center gap-2 text-sm">
        {content}
        {!isSubmenuItem && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-max bg-yellow-100 text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-gray-400 pointer-events-none z-50">
            {link}
          </div>
        )}
      </a>
    );
  }

  if (submenu && !isSubmenuItem) {
    const submenuPositionClass = submenuDirection === 'left'
      ? 'absolute right-full bottom-0 mr-px'
      : 'absolute left-full bottom-0 ml-px';

    return (
      <li
        onMouseEnter={() => setShowSubmenu(true)}
        onMouseLeave={() => setShowSubmenu(false)}
        className="text-black relative hover:bg-[#316AC5] hover:text-white px-2 py-1 rounded-sm cursor-pointer flex items-center gap-2 text-sm"
      >
        {content}
        {submenuDirection === 'left'
          ? <IoIosArrowBack className="text-green-600 ml-auto" />
          : <IoIosArrowForward className="text-green-600 ml-auto" />
        }
        {showSubmenu && (
          <div className={`${submenuPositionClass} w-56 bg-white border-t-white border-l-white border-r-black border-b-black border-2 font-xp text-sm shadow-lg z-50`}>
            <ul className="p-1 space-y-0 max-h-[55vh] sm:max-h-[380px] overflow-y-auto">
              {submenu.map((item, index) => (
                item.isSeparator
                  ? <div key={index} className="border-t border-gray-400 my-1 mx-2" />
                  : <MenuItem key={index} {...item} isSubmenuItem={true} />
              ))}
            </ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <li onClick={onClick} className="text-black hover:bg-[#316AC5] hover:text-white px-2 py-1 rounded-sm cursor-pointer flex items-center gap-2 text-sm">
      {content}
    </li>
  )
}

export default MenuContent;
