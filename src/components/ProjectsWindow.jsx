import { useState, useCallback } from "react";
import { FaReact, FaFigma, FaCss3Alt, FaGamepad, FaJsSquare, FaJava, FaBolt } from "react-icons/fa";

const projects = [
  {
    title: "My Portfolio - This Site :D",
    link: "https://livportifolio.com",
    image: "src/assets/portfolio2.png",
    description: "This very site! Built with React, Tailwind CSS, and lots of fun!.",
    tools: [
      { name: "React", icon: <FaReact /> },
      { name: "Vite", icon: <FaBolt /> },
      { name: "CSS", icon: <FaCss3Alt /> },
      { name: "Figma", icon: <FaFigma /> },
      { name: "Tailwind CSS", icon: <FaCss3Alt /> },
      { name: "JavaScript", icon: <FaJsSquare /> },
    ],
  },
  {
    title: "Portfolio Landing Page",
    link: "https://liv-inn.github.io/portifolio-landingpage/",
    image: "src/assets/portfolio.png",
    description: "My first portfolio landing page!",
    tools: [
      { name: "Figma", icon: <FaFigma /> },
      { name: "CSS", icon: <FaCss3Alt /> },
      { name: "JavaScript", icon: <FaJsSquare /> },
      { name: "React", icon: <FaReact /> },
      { name: "Tailwind CSS", icon: <FaCss3Alt /> },

    ],
  },
  {
    title: "Hitch AI",
    link: "https://hitch-conselheiro-amoroso.vercel.app",
    image: "src/assets/hitch.png",
    description: "An AI love advisor that provides personalized dating advice.",
    tools: [
      { name: "Figma", icon: <FaFigma /> },
      { name: "CSS", icon: <FaCss3Alt /> },
      { name: "React", icon: <FaReact /> },
      { name: "Tailwind CSS", icon: <FaCss3Alt /> },
      { name: "JavaScript", icon: <FaJsSquare /> },
      { name: "Spring Boot", icon: <FaJava /> },
      { name: "Java", icon: <FaJava /> },
      { name: "REST APIs", icon: <FaJava /> },

    ],
  },
  {
    title: "Blue Zone Clinic",
    link: "https://fehmell.github.io/BlueZone-Clinic/",
    image: "src/assets/bluezone.png",
    description: "Rebranding and redesign of the Blue Zone Clinic website.",
    tools: [
      { name: "React", icon: <FaReact /> },
      { name: "Tailwind CSS", icon: <FaCss3Alt /> },
      { name: "Figma", icon: <FaFigma /> },
      { name: "CSS", icon: <FaCss3Alt /> },
      { name: "JavaScript", icon: <FaJsSquare /> },
    ],
  },
];

function ProjectsWindow() {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? projects.length - 1 : c - 1)), []);
  const next = useCallback(() => setCurrent((c) => (c === projects.length - 1 ? 0 : c + 1)), []);

  return (
    <div className="bg-[#ECE9D8] p-4 font-xp text-sm h-full">
      <div className="flex items-center gap-4 h-full border-inset border-gray-400 bg-white p-4">
        <img
          src={projects[current].image}
          alt={projects[current].title}
          style={{
            width: 200,
            height: "100%",
            objectFit: "contain",
            border: "2px outset #fff",
          }}
        />
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-base text-blue-700">
              {projects[current].title}
            </span>
            <div className="flex gap-1">
              <button
                onClick={prev}
                className="w-7 h-7 bg-[#ECE9D8] border-2 border-outset border-t-white border-l-white border-r-black border-b-black focus:border-inset"
              >
                {"<"}
              </button>
              <button
                onClick={next}
                className="w-7 h-7 bg-[#ECE9D8] border-2 border-outset border-t-white border-l-white border-r-black border-b-black focus:border-inset"
              >
                {">"}
              </button>
            </div>
          </div>
          <a
            href={projects[current].link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mb-2 text-xs break-all block"
          >
            {projects[current].link}
          </a>
          <p className="mb-3 text-xs">{projects[current].description}</p>
          <div className="mb-1 font-bold text-xs">
            Tools & Technologies:
          </div>
          <div className="flex gap-2 flex-wrap">
            {projects[current].tools.map((tool, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 border border-blue-300 rounded-sm text-xs"
              >
                <span className="text-blue-600">{tool.icon}</span>
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsWindow;
