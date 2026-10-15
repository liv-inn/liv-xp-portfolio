import { useRef, useCallback, useState } from "react";
import { useSettings } from "../context/useSettings";
import { sounds } from "../lib/sounds";

function ResumeWindow() {
  const { t } = useSettings();
  const r = t.resume;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    const input = contentRef.current;
    if (!input || isGenerating) return;
    setIsGenerating(true);

    try {
      // Heavy libs are only fetched when the user actually asks for the PDF
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);

      const canvas = await html2canvas(input, {
        scale: 2,
        height: input.scrollHeight,
        windowHeight: input.scrollHeight,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const content = clonedDoc.querySelector<HTMLElement>("[data-resume-content]");
          if (content) {
            content.style.overflow = "visible";
            content.style.height = "auto";
            content.style.maxHeight = "none";
          }
          clonedDoc.querySelectorAll<HTMLElement>("hr").forEach((hr) => {
            hr.style.borderColor = "#d1d5db";
          });
          clonedDoc.body.style.color = "black";
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = pdfWidth / (canvas.width / canvas.height);

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      pdf.save(r.fileName);
    } catch (err) {
      console.error("Error generating PDF:", err);
      sounds.error();
      alert(r.pdfError);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, r.fileName, r.pdfError]);

  return (
    <div className="bg-white font-mono text-xs h-full flex flex-col">
      <div className="bg-[#ECE9D8] border-b border-gray-300 px-1 py-0.5 flex items-center text-xs select-none shrink-0 font-xp">
        <button
          className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white cursor-pointer disabled:cursor-wait disabled:text-gray-500"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? r.menu.generating : r.menu.download}
        </button>
        <span className="px-2 py-0.5 text-gray-500 cursor-default">{r.menu.edit}</span>
        <span className="px-2 py-0.5 text-gray-500 cursor-default">{r.menu.view}</span>
      </div>
      <div className="p-4 overflow-y-auto flex-1 min-h-0" ref={contentRef} data-resume-content>
        <h2 className="text-base font-bold">Lívia Neves</h2>
        <p>
          {r.headline}
          <br />
          Email: livianeves.dev@gmail.com
          <br />
          LinkedIn: linkedin.com/in/livia-a-neves | GitHub: github.com/liv-inn
          <br />
          Portfolio: liv-xp-portfolio.vercel.app
        </p>

        <hr className="my-2 border-gray-300" />

        <h3 className="font-bold mt-2">{r.sections.summary}</h3>
        <p className="mt-1">{r.summary}</p>

        <h3 className="font-bold mt-2">{r.sections.experience}</h3>
        <div className="mt-1 space-y-2">
          {r.experience.map((job) => (
            <div key={job.company}>
              <p>
                <strong>
                  {job.role} — {job.company}
                </strong>{" "}
                ({job.period})
              </p>
              <ul className="list-disc ml-5 mt-1">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="font-bold mt-2">{r.sections.projects}</h3>
        <div className="mt-1 space-y-2">
          {r.projects.map((project) => (
            <div key={project.name}>
              <p>
                <strong>{project.name}</strong> ({project.stack})
              </p>
              <ul className="list-disc ml-5 mt-1">
                {project.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="font-bold mt-2">{r.sections.education}</h3>
        <p className="mt-1">
          <strong>{r.education.degree}</strong>
          <br />
          {r.education.school}
          <br />
          {r.education.period}
          <br />
          {r.education.note}
        </p>

        <h3 className="font-bold mt-2">{r.sections.skills}</h3>
        <div className="mt-1">
          {r.skills.map(([label, value]) => (
            <p key={label}>
              <strong>{label}:</strong> {value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResumeWindow;
