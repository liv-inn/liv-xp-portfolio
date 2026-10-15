import { useState } from "react";
import { useSettings } from "../../context/useSettings";
import { sounds } from "../../lib/sounds";
import { FileIcon, RecycleIcon } from "../XpIcons";

function RecycleBinWindow() {
  const { t } = useSettings();
  const r = t.recycle;
  const [emptied, setEmptied] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const items = emptied ? [] : r.items;
  const current = selected !== null ? items[selected] : undefined;

  const emptyBin = () => {
    sounds.crumple();
    setEmptied(true);
    setSelected(null);
    setMessage(r.emptied);
  };

  const restore = () => {
    sounds.error();
    setMessage(r.restoreJoke);
  };

  return (
    <div className="h-full flex flex-col bg-white font-xp text-sm">
      <div className="flex flex-1 min-h-0">
        <aside className="hidden sm:flex flex-col gap-3 w-52 shrink-0 p-3 bg-linear-to-b from-[#7BA2E7] to-[#6375D6] overflow-y-auto">
          <section className="rounded-t-md overflow-hidden">
            <h4 className="px-2 py-1 text-xs font-bold text-[#215DC6] bg-linear-to-r from-white to-[#C6D3F7]">{r.tasks}</h4>
            <div className="bg-[#D6DFF7] p-2 text-xs space-y-1.5">
              <button onClick={emptyBin} disabled={emptied} className="flex items-center gap-1.5 text-[#215DC6] hover:underline disabled:opacity-50 disabled:no-underline text-left">
                <RecycleIcon full={false} className="w-4 h-4" /> {r.empty}
              </button>
              {current && (
                <button onClick={restore} className="flex items-center gap-1.5 text-[#215DC6] hover:underline text-left">
                  ↩ {r.restore}
                </button>
              )}
            </div>
          </section>
          <section className="rounded-t-md overflow-hidden">
            <div className="bg-[#D6DFF7] p-2 text-xs text-gray-700 min-h-16">
              {current ? (
                <>
                  <p className="font-bold break-all">{current.name}</p>
                  <p className="text-gray-500 mb-1">{current.size}</p>
                  <p>{current.desc}</p>
                </>
              ) : (
                <p>{r.selectHint}</p>
              )}
            </div>
          </section>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-500 p-4 text-center">
              <RecycleIcon full={false} className="w-16 h-16 opacity-60" />
              <p>{message}</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#ECE9D8] text-left">
                <tr>
                  <th className="font-normal px-2 py-1 border-r border-b border-[#ACA899]">{r.colName}</th>
                  <th className="font-normal px-2 py-1 border-b border-[#ACA899] w-20">{r.colSize}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.name}
                    onClick={() => {
                      setSelected(i);
                      setMessage(null);
                    }}
                    className={`cursor-default ${selected === i ? "bg-[#316AC5] text-white" : "hover:bg-blue-50"}`}
                  >
                    <td className="px-2 py-1">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <FileIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </span>
                    </td>
                    <td className="px-2 py-1">{item.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* On small screens the side panel is hidden, so details render below the list */}
          {current && (
            <div className="sm:hidden m-2 p-2 bg-[#D6DFF7] text-xs rounded">
              <p className="font-bold break-all">{current.name}</p>
              <p className="my-1">{current.desc}</p>
              <button onClick={restore} className="text-[#215DC6] underline">
                ↩ {r.restore}
              </button>
            </div>
          )}
          {!emptied && (
            <div className="sm:hidden p-2">
              <button onClick={emptyBin} className="xp-button text-xs">
                {r.empty}
              </button>
            </div>
          )}
          {message && items.length > 0 && <p className="p-2 text-xs text-[#C0392B]">{message}</p>}
        </main>
      </div>
      <div className="px-2 py-0.5 text-[11px] text-gray-600 bg-[#ECE9D8] border-t border-[#ACA899] shrink-0">{t.projects.count(items.length)}</div>
    </div>
  );
}

export default RecycleBinWindow;
