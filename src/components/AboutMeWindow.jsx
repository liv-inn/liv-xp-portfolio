import { useState, memo } from 'react';
import { useWindow } from '../context/useWindow';

const Tab = memo(({ title, activeTab, setActiveTab }) => {
  const isActive = activeTab === title;
  return (
    <button
      onClick={() => setActiveTab(title)}
      className={`px-4 py-1 text-sm focus:outline-none rounded-t-md ${
        isActive
          ? 'bg-[#ECE9D8] border-t border-l border-r border-gray-400 -mb-px'
          : 'pt-1'
      }`}
    >
      {title}
    </button>
  );
});

function AboutMeWindow({ id }) {
  const { closeWindow } = useWindow();
  const [activeTab, setActiveTab] = useState('General');

  const renderContent = () => {
    switch (activeTab) {
      case 'General':
        return (
          <div className="p-4 space-y-4">
            <div className="flex gap-4 items-center">
              <img src="/src/assets/liv.jpg" alt="Lívia Neves" className="w-24 h-24 border-2 border-gray-400 p-0.5 bg-white shadow-md" />
              <div>
                <p className="font-bold text-lg">Lívia Neves</p>
                <p className="text-gray-600">Frontend Developer</p>
                <p className="text-gray-600 text-xs mt-1">Brazil</p>
              </div>
            </div>
            <fieldset className="border-t border-gray-300 pt-2">
              <legend className="px-2 text-gray-500 text-xs">Summary</legend>
              <p className="text-xs p-2">
                Front-end developer and Internet Systems student with strong experience in React.js, Tailwind CSS, and REST API integration. Demonstrated ability to deliver responsive, accessible, and user-focused interfaces in academic and freelance projects.
              </p>
            </fieldset>
          </div>
        );
      case 'Details':
        return (
          <div className="p-4 space-y-3 text-xs">
            <fieldset className="border border-gray-300 p-2">
              <legend className="px-1">Skills & Methodologies</legend>
              <p>Skilled in JavaScript, Java (Spring Boot), and modern development tools, with a solid understanding of UX/UI principles, cross-browser compatibility, and agile methodologies.</p>
              <p className="mt-2">Eager to contribute and grow in collaborative development environments.</p>
            </fieldset>
          </div>
        );
      case 'Interests':
        return (
          <div className="p-4">
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-xs">
              <li>Enthusiastic about technology, design, and music</li>
              <li>Enjoy creative coding</li>
              <li>Always exploring new tools and frameworks</li>
              <li>Team player and lifelong learner</li>
              <li>Loves playing The Sims and Stardew Valley</li>
              <li>I'm a big fan of k-pop, especially EXO (´♡‿♡`)</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#ECE9D8] font-xp text-sm w-full max-w-120 flex flex-col">
      <div className="flex border-b border-gray-400 px-2">
        <Tab title="General" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab title="Details" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab title="Interests" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="grow min-h-50">
        {renderContent()}
      </div>

      <div className="flex justify-end p-2 border-t border-gray-300">
        <button onClick={() => closeWindow(id)} className="px-6 py-1 bg-[#ECE9D8] border-2 border-outset border-t-white border-l-white border-r-black border-b-black focus:border-inset">OK</button>
      </div>
    </div>
  );
}

export default AboutMeWindow;
