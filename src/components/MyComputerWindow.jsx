import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const DriveItem = ({ icon, name, description, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-2 hover:bg-blue-100 hover:border-blue-300 border border-transparent rounded-sm cursor-pointer"
  >
    {icon}
    <div>
      <p className="font-bold">{name}</p>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </a>
);

function MyComputerWindow() {
  return (
    <div className="bg-white p-2 font-xp text-sm h-full flex flex-col gap-4">
      <div>
        <h3 className="text-xs text-gray-500 px-2 pb-1 border-b border-gray-300 mb-1">
          Hard Disk Drives
        </h3>
        <div className="flex flex-col gap-1">
          <DriveItem
            icon={<FaGithub size={32} className="text-gray-700" />}
            name="GitHub Drive (G:)"
            description="Browse my project repositories."
            link="https://github.com/liv-inn"
          />
          <DriveItem
            icon={<FaLinkedin size={32} className="text-blue-700" />}
            name="LinkedIn Drive (L:)"
            description="View my professional profile."
            link="https://www.linkedin.com/in/livia-a-neves/"
          />
          <DriveItem
            icon={<FaEnvelope size={32} className="text-red-500" />}
            name="Email"
            description="Send me a message."
            link="mailto:livianeves.dev@gmail.com"
          />
        </div>
      </div>
    </div>
  );
}

export default MyComputerWindow;