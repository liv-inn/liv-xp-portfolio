import Icons from "../components/Icons";
import Nav from "../components/Nav";
import MenuContent from "../components/MenuContent";
import { useState } from "react"; 
import WindowXP from "../components/WindowXP";
import { useWindow } from "../context/useWindow";
import projectsIcon from '../assets/projects.png';
import aboutMeIcon from '../assets/about-me.png';
import myResumeIcon from '../assets/my-resume.png';
import contactMeIcon from '../assets/contact.png';



function Home(){
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const toggleMenu = () => setIsMenuVisible(v => !v);
    const { windows } = useWindow();

    return(
        <div className="min-h-screen">
            <div className="flex flex-col items-start gap-2 mt-4 ml-8">
                <Icons name="myResume.pdf" img={myResumeIcon} />
                <Icons name="Projects.exe" img={projectsIcon} />
                <Icons name="Contact Me" img={contactMeIcon} />
                <Icons name="about_me.exe" img={aboutMeIcon} />
            </div>
            {isMenuVisible && <MenuContent />}
            <Nav toggleMenu={toggleMenu} />
            {windows.map((win) => <WindowXP key={win.id} {...win} />)}
        </div>
    )
}

export default Home;