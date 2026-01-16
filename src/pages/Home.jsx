import Icons from "../components/Icons";
import Nav from "../components/Nav";
import MenuContent from "../components/MenuContent";
import { useState } from "react"; 
import WindowXP from "../components/WindowXP";
import { useWindow } from "../context/useWindow";

function Home(){
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const toggleMenu = () => setIsMenuVisible(v => !v);
    const { windows } = useWindow();

    return(
        <div className="min-h-screen">
            <div className="flex flex-col items-start gap-2 mt-4 ml-8">
                <Icons name="myResume.pdf" img="/src/assets/my-resume.png" />
                <Icons name="Projects.exe" img="/src/assets/projects.png" />
                <Icons name="Contact Me" img="/src/assets/contact.png" />
                <Icons name="about_me.exe" img="/src/assets/about-me.png" />
            </div>
            {isMenuVisible && <MenuContent />}
            <Nav toggleMenu={toggleMenu} />
            {windows.map((win) => <WindowXP key={win.id} {...win} />)}
        </div>
    )
}

export default Home;