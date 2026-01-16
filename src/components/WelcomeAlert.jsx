import { useWindow } from '../context/useWindow';
import { FaExclamationTriangle } from 'react-icons/fa';

function WelcomeAlert({ id }) {
  const { closeWindow } = useWindow();

  return (
    <div className="bg-[#ECE9D8] p-4 font-xp text-sm flex flex-col h-full w-100">
      <div className="grow flex items-center gap-4 p-2">
        <FaExclamationTriangle className="text-red-500 text-xl" />
     <div className='space-y-2 text-xs'>
           <p>Hii, I'm Liv!  :D Welcome to my portfolio! ✮⋆˙</p>
        
        <p>⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⢿⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⣿⠉⢻⣦⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠏⠈⣿⣆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣿⠃⠀⠀⠹⣷⡄⠀⠀⠀⠀⠀⣠⡾⠇⠀⠀⠘⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣾⠃⠀⠀⠄⠈⠌⢿⣦⣤⣤⣤⣴⠟⠡⠀⠀⠠⠀⠘⣿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣸⡟⠀⠀⢂⠄⠊⠀⠀⠉⠁⠀⠈⠉⠀⠀⠐⠠⡀⠀⠀⠹⣷⡀⠀⠀⠀⠀
⠀⠀⠀⠀⢰⡿⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠀⠀⢻⣧⠀⠀⠀⠀
⠀⠀⠀⢀⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡆⠀⠀⠀
⠀⢀⣀⣼⣷⣤⣤⣤⣤⣤⣤⣤⣤⣄⣀⣀⣀⠀⢀⣀⣀⣠⣤⣤⣤⣤⣤⣤⣼⣧⡀⠀⠀
⣴⣿⠟⠉⠁⢠⣾⣿⣯⠙⠛⠛⠉⠙⠻⣿⡿⠿⢿⣿⣿⠟⠛⠉⣿⣿⣿⡟⠛⠛⢿⣿⡄
⣿⣿⡄⠀⠀⠸⣿⣿⡿⠁⠀⠀⠀⠀⣠⣿⠁⠀⠀⠹⣿⣄⠀⠀⢿⣿⣿⠟⠀⠀⠀⣿⠇
⠈⠻⣿⣷⣶⣤⣤⣤⣤⣤⣤⣤⣴⡾⠿⠃⠀⠀⠀⠀⠈⠻⠿⢶⣶⣾⣧⣤⣤⡶⣿⠛⠀
⠀⠀⣿⠀⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠦⡄⠀⠀⠀⠀⠀⠀⠈⠀⢻⡆⠀
⠀⠀⣿⠀⠁⠀⠀⠀⠀⠂⠀⠀⣾⣁⣤⢷⣄⣀⣀⣀⡴⠃⠀⠀⠀⠀⠀⠀⠈⠀⢸⡇⠀
⠀⠀⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠈⠉⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠃⠀
⠀⠀⠈⠛⠷⣶⣤⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣠⣤⣶⠶⠟⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠙⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠋⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀</p>
     </div>
      </div>
      <div className="flex justify-center p-2">
        <button
          onClick={() => closeWindow(id)}
          className="px-8 py-1 bg-[#ECE9D8] border-2 border-outset border-t-white border-l-white border-r-black border-b-black focus:border-inset"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default WelcomeAlert;