import { useState } from "react";
import { useWindow } from "../context/useWindowManager";
import { useSettings } from "../context/useSettings";
import livImg from "../assets/liv.webp";
import type { WindowContentProps } from "../windows/registry";

type TabKey = "general" | "details" | "interests";
const TABS: TabKey[] = ["general", "details", "interests"];

function AboutMeWindow({ id }: WindowContentProps) {
  const { closeWindow } = useWindow();
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const a = t.about;

  return (
    <div className="bg-[#ECE9D8] font-xp text-sm w-full flex flex-col p-2">
      <div className="flex px-1" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs rounded-t-[3px] border border-b-0 ${
              activeTab === tab
                ? "bg-[#FCFCFE] border-[#919B9C] border-t-2 border-t-[#FFC83C] relative top-px z-10"
                : "bg-[#F0EFE6] border-[#919B9C] mt-0.5"
            }`}
          >
            {a.tabs[tab]}
          </button>
        ))}
      </div>

      <div className="min-h-52 bg-[#FCFCFE] border border-[#919B9C]">
        {activeTab === "general" && (
          <div className="p-4 space-y-4">
            <div className="flex gap-4 items-center">
              <img src={livImg} alt="Lívia Neves" className="w-24 h-24 object-cover border-2 border-gray-400 p-0.5 bg-white shadow-md" />
              <div>
                <p className="font-bold text-lg">Lívia Neves</p>
                <p className="text-gray-600">{a.role}</p>
                <p className="text-gray-600 text-xs mt-1">{a.location}</p>
              </div>
            </div>
            <fieldset className="border-t border-gray-300 pt-2">
              <legend className="px-2 text-gray-500 text-xs">{a.summaryLabel}</legend>
              <p className="text-xs p-2">{a.summary}</p>
            </fieldset>
          </div>
        )}
        {activeTab === "details" && (
          <div className="p-4 text-xs">
            <fieldset className="border border-gray-300 p-2">
              <legend className="px-1">{a.skillsLabel}</legend>
              {a.details.map((p, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {p}
                </p>
              ))}
            </fieldset>
          </div>
        )}
        {activeTab === "interests" && (
          <ul className="p-4 list-disc list-inside text-gray-700 space-y-2 text-xs">
            {a.interests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={() => closeWindow(id)} className="xp-button px-6">
          {a.ok}
        </button>
      </div>
    </div>
  );
}

export default AboutMeWindow;
