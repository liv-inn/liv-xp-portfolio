import { useState, useEffect } from 'react';
import { FaInfo, FaHeart } from 'react-icons/fa';

const formatTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
};

function SystemTray() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="h-full flex items-center bg-linear-to-b from-[#2275E3] to-[#0A5BD6] border-l-2 border-[#5A9BFF] px-1 shadow-inner">
      <div className="relative group">
        <span className="flex items-center justify-center rounded-full bg-white w-5 h-5 mr-1 cursor-default">
          <FaInfo className="text-[#2275E3] text-xs" />
        </span>
        <div className="absolute bottom-full right-0 mb-2 w-max bg-yellow-100 text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-gray-400 pointer-events-none z-50 flex items-center">
          Made with <FaHeart className="inline mx-1 text-red-500" /> by liv
        </div>
      </div>
      <span className="text-xs font-semibold">{formatTime(time)}</span>
    </div>
  );
}

export default SystemTray;