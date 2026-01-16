import { useWindow } from "../context/useWindow";
import ResumeWindow from "./ResumeWindow";
import AboutMeWindow from "./AboutMeWindow";
import ContactMeWindow from "./ContactMeWindow";
import ProjectsWindow from "./ProjectsWindow";
import MyComputerWindow from "./MyComputerWindow";
import WelcomeAlert from "./WelcomeAlert";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const WINDOW_COMPONENTS = {
  "myResume.pdf": ResumeWindow,
  "about_me.exe": AboutMeWindow,
  "Contact Me": ContactMeWindow,
  "Welcome": WelcomeAlert,
  "Projects.exe": ProjectsWindow,
  "My Computer": MyComputerWindow,
};

function WindowXP({ id, type, minimized, zIndex, maximized }) {
  const { closeWindow, minimizeWindow, focusWindow, toggleMaximize } = useWindow();
  const windowRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (windowRef.current) {
      const { width, height } = windowRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth / 2 - width / 2,
        y: window.innerHeight / 2 - height / 2,
      });
      setIsVisible(true);
    }
  }, []);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    },
    [dragging, offset]
  );

  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  const onMouseDown = (e) => {
    if (maximized) return;
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMinimize = useCallback((e) => {
    e.stopPropagation();
    minimizeWindow(id);
  }, [id, minimizeWindow]);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    closeWindow(id);
  }, [id, closeWindow]);

  const handleMaximize = useCallback((e) => {
    e.stopPropagation();
    toggleMaximize(id);
  }, [id, toggleMaximize]);

  const ContentComponent = useMemo(() => WINDOW_COMPONENTS[type], [type]);
  const title = type;

  const windowSizeClass = type === 'Projects.exe' ? 'w-[700px] h-[380px]' : type === 'Welcome' ? 'w-auto h-auto' : 'max-w-2xl';

  const windowStyles = maximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 2rem)',
      }
    : {
        left: position.x,
        top: position.y,
      };

  return (
    <div
      ref={windowRef}
      className={`fixed bg-[#ECE9D8] border-2 border-t-[#E3EEFD] border-l-[#E3EEFD] border-r-[#3A5DB0] border-b-[#3A5DB0] shadow-lg min-w-72 min-h-56 font-xp text-black ${maximized ? 'max-w-full! max-h-full! rounded-none!' : `${windowSizeClass} max-h-[80vh] rounded-md`}`}
      onMouseDown={() => !maximized && focusWindow(id)}
      style={{
        ...windowStyles,
        display: minimized ? "none" : "block",
        zIndex,
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      <div
        className="flex items-center justify-between bg-linear-to-b from-[#3B85E8] to-[#245EDC] text-white px-2 py-1 rounded-t-sm select-none h-7"
        style={{ cursor: maximized ? 'default' : 'move' }}
        onMouseDown={onMouseDown}
        onDoubleClick={handleMaximize}
      >
        <span className="font-bold text-sm">{title}</span>
        <div className="flex items-center gap-1">
          {type !== 'Welcome' && (
            <>
              <button title="Minimize" onClick={handleMinimize} className="bg-[#D6D3CE] border border-outset border-t-white border-l-white border-r-black border-b-black text-black w-5 h-5 flex items-center justify-center rounded-sm font-black text-xs hover:bg-gray-300">
                <span className="w-2.5 h-px bg-black" />
              </button>
              <button title={maximized ? "Restore" : "Maximize"} onClick={handleMaximize} className="bg-[#D6D3CE] border border-outset border-t-white border-l-white border-r-black border-b-black text-black w-5 h-5 flex items-center justify-center rounded-sm font-black text-xs hover:bg-gray-300">
                {maximized ? '⧉' : '□'}
              </button>
            </>
          )}
          <button title="Close" onClick={handleClose} className="bg-[#D6D3CE] border border-outset border-t-white border-l-white border-r-black border-b-black text-black w-5 h-5 flex items-center justify-center rounded-sm font-black text-xs hover:bg-red-500 hover:text-white">
            X
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-1.75rem)] overflow-y-auto">
        {ContentComponent ? <ContentComponent id={id} /> : <p>This is a {type} window!</p>}
      </div>
    </div>
  );
}

export default WindowXP;
