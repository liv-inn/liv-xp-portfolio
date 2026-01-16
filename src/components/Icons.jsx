import { useWindow } from "../context/useWindow";

function Icons({ name, img }) {
  const { openWindow } = useWindow();
  return (
    <div className="flex flex-col cursor-pointer m-2 items-center w-28 text-center" onDoubleClick={() => openWindow(name)}>
      <img src={img} alt={name} className="w-16 h-16 mb-1" />
      <span className="text-white text-sm mt-0.5 p-1" style={{ textShadow: '1px 1px 2px #0000AA' }}>{name}</span>
    </div>
  );
}

export default Icons;
