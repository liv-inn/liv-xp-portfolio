import { useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ResumeWindow() {
  const contentRef = useRef(null);

  const handleDownloadPDF = useCallback(() => {
    const input = contentRef.current;
    if (!input) return;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const hr = clonedDoc.querySelector('hr');
        if (hr) {
          hr.style.borderColor = '#d1d5db'; 
        }
        clonedDoc.body.style.color = 'black';
      },
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth;
        const imgHeight = imgWidth / ratio;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
        pdf.save('myResume.pdf');
      })
      .catch(err => {
        console.error("Erro ao gerar o PDF:", err);
        alert("Ocorreu um erro ao gerar o PDF.");
      });
  }, []);

  return (
    <div className="bg-white font-mono text-xs h-full flex flex-col">
      <div className="bg-gray-200 border-b border-gray-300 px-2 py-0.5 flex items-center text-xs select-none">
        <button className="px-2 py-0.5 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={handleDownloadPDF}>Download</button>
        <span className="px-2 py-0.5 text-gray-500 cursor-default"><u>E</u>dit</span>
        <span className="px-2 py-0.5 text-gray-500 cursor-default"><u>V</u>iew</span>
      </div>
      <div className="p-4 overflow-y-auto flex-1" ref={contentRef}>
        <h2 className="text-base font-bold">Lívia Neves</h2>
        <p>
          Email: livianeves.dev@gmail.com<br />
          LinkedIn: linkedin.com/in/liv-neves | GitHub: liv-inn
        </p>

        <hr className="my-2 border-gray-300" />

        <h3 className="font-bold mt-2">Summary</h3>
        <p className="mt-1">
          Front-end developer and Internet Systems student with strong experience in React.js, Tailwind CSS, and REST API integration. Demonstrated ability to deliver responsive, accessible, and user-focused interfaces in academic and freelance projects. Skilled in JavaScript, Java (Spring Boot), and modern development tools, with a solid understanding of UX/UI principles, cross-browser compatibility, and agile methodologies. Eager to contribute and grow in collaborative development environments.
        </p>

        <h3 className="font-bold mt-2">Experience</h3>
        <div className="mt-1">
          <p><strong>Front-end Developer Freelancer — Academy Educação</strong> (Oct/2025 – Present)</p>
          <ul className="list-disc ml-5 mt-1">
            <li>Developed and maintained user interfaces for educational platform.</li>
            <li>Created interactivity with JavaScript (DOM manipulation and form validation).</li>
            <li>Implemented responsive layouts using Bootstrap and Metronic.</li>
            <li>Bug fixing and cross-browser testing, ensuring device compatibility.</li>
          </ul>
        </div>

        <h3 className="font-bold mt-2">Projects</h3>
        <div className="mt-1 space-y-2">
          <div>
            <p><strong>Hitch – Digital Love Advisor with AI (Academic Project) — Hitch AI</strong> (Oct/2025)</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Full front-end development using React.js and Tailwind CSS.</li>
              <li>Created responsive UI with microinteractions, animations, and loading states.</li>
              <li>Integrated with REST API in Spring Boot for smooth front-end/back-end communication.</li>
            </ul>
          </div>
          <div>
            <p><strong>Blue Zone Clinic Website Redesign (Academic Project) — BlueZone Clinic</strong> (Oct/2025)</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Complete redesign focused on UX/UI, accessibility, and information clarity.</li>
              <li>Developed new layout with React.js and Tailwind CSS.</li>
            </ul>
          </div>
          <div>
            <p><strong>Web Library System (Academic/Personal Project)</strong> (May/2025 – Jun/2025)</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Developed web app with Spring Boot, Thymeleaf, and PostgreSQL.</li>
            </ul>
          </div>
        </div>

        <h3 className="font-bold mt-2">Education</h3>
        <p className="mt-1">
          <strong>Bachelor of Technology in Internet Systems</strong><br />
          FATEC Rubens Lara — Santos, SP <br />
          2023 – 2026
        </p>

        <h3 className="font-bold mt-2">Skills</h3>
        <div className="mt-1">
          <p><strong>Front-end:</strong> HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Angular</p>
          <p><strong>Back-end:</strong>  Java, Spring Boot, REST APIs</p>
          <p><strong>Databases:</strong> PostgreSQL, MongoDB</p>
          <p><strong>Tools:</strong>     Git, Linux, Docker (basic), Figma</p>
          <p><strong>Methods:</strong>   Scrum</p>
        </div>
      </div>
    </div>
  );
}

export default ResumeWindow;
