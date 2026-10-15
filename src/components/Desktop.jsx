import Icons from "./Icons";
import myComputerIcon from '../assets/my-computer.webp';
import projectsIcon from '../assets/projects.webp';
import aboutMeIcon from '../assets/about-me.webp';
import myResumeIcon from '../assets/my-resume.webp';
import contactMeIcon from '../assets/contact-me.webp';

const icons = [
    { name: "My Computer", img: myComputerIcon },
    { name: "Projects.exe", img: projectsIcon },
    { name: "about_me.exe", img: aboutMeIcon },
    { name: "myResume.pdf", img: myResumeIcon },
    { name: "Contact Me", img: contactMeIcon },
];

function Desktop() {
    return (
        <div className="flex flex-col flex-wrap h-full content-start p-2">
            {icons.map((icon) => (
                <Icons key={icon.name} name={icon.name} img={icon.img} />
            ))}
        </div>
    );
}

export default Desktop;
