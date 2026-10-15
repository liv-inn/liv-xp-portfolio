import { useCallback, useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import emailjs from "@emailjs/browser";
import { FaPencilAlt, FaPaintBrush, FaEraser, FaFillDrip, FaUndo } from "react-icons/fa";
import { useSettings } from "../../context/useSettings";
import { sounds } from "../../lib/sounds";

const WIDTH = 640;
const HEIGHT = 400;
const MAX_UNDO = 20;

const PALETTE = [
  "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#808040", "#004040", "#0080FF", "#004080", "#8000FF", "#804000",
  "#FFFFFF", "#C0C0C0", "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#FFFF80", "#00FF80", "#80FFFF", "#8080FF", "#FF0080", "#FF8040",
];

type Tool = "pencil" | "brush" | "eraser" | "fill";

const TOOL_ICONS: Record<Tool, typeof FaPencilAlt> = {
  pencil: FaPencilAlt,
  brush: FaPaintBrush,
  eraser: FaEraser,
  fill: FaFillDrip,
};

const SIZES = [2, 5, 10, 18];

const hexToRgba = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  // little-endian ABGR for Uint32Array over ImageData
  return (255 << 24) | ((n & 0xff) << 16) | (((n >> 8) & 0xff) << 8) | ((n >> 16) & 0xff);
};

function floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, hex: string) {
  const image = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const data = new Uint32Array(image.data.buffer);
  const target = data[y * WIDTH + x];
  const replacement = hexToRgba(hex);
  if (target === replacement) return;
  const stack = [y * WIDTH + x];
  while (stack.length) {
    const i = stack.pop()!;
    if (data[i] !== target) continue;
    data[i] = replacement;
    const px = i % WIDTH;
    if (px > 0) stack.push(i - 1);
    if (px < WIDTH - 1) stack.push(i + 1);
    if (i >= WIDTH) stack.push(i - WIDTH);
    if (i < WIDTH * (HEIGHT - 1)) stack.push(i + WIDTH);
  }
  ctx.putImageData(image, 0, 0);
}

function PaintWindow() {
  const { t } = useSettings();
  const p = t.paint;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const undoStack = useRef<ImageData[]>([]);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(SIZES[1]);
  const [canUndo, setCanUndo] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const getCtx = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [clearCanvas]);

  const pushUndo = () => {
    const ctx = getCtx();
    if (!ctx) return;
    undoStack.current.push(ctx.getImageData(0, 0, WIDTH, HEIGHT));
    if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
    setCanUndo(true);
  };

  const undo = useCallback(() => {
    const ctx = getCtx();
    const previous = undoStack.current.pop();
    if (ctx && previous) ctx.putImageData(previous, 0, 0);
    setCanUndo(undoStack.current.length > 0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest("input, textarea");
      if (!typing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo]);

  // Convert from CSS pixels to canvas pixels (the canvas is scaled to fit)
  const toCanvasPoint = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.round(((e.clientX - rect.left) / rect.width) * WIDTH),
      y: Math.round(((e.clientY - rect.top) / rect.height) * HEIGHT),
    };
  };

  const drawSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = tool === "pencil" ? Math.max(1, size / 2) : tool === "eraser" ? size * 2 : size;
    ctx.lineCap = tool === "pencil" ? "square" : "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const point = toCanvasPoint(e);
    pushUndo();
    if (tool === "fill") {
      const ctx = getCtx();
      if (ctx) floodFill(ctx, point.x, point.y, color);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPoint.current = point;
    drawSegment(point, point);
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!lastPoint.current) return;
    const point = toCanvasPoint(e);
    drawSegment(lastPoint.current, point);
    lastPoint.current = point;
  };

  const handlePointerUp = () => {
    lastPoint.current = null;
  };

  const handleClear = () => {
    pushUndo();
    clearCanvas();
  };

  const handleSave = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "liv-xp-drawing.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  // A small JPEG keeps the payload under EmailJS' size limit
  const exportSmallJpeg = () => {
    const source = canvasRef.current;
    if (!source) return "";
    const small = document.createElement("canvas");
    small.width = WIDTH / 1.5;
    small.height = HEIGHT / 1.5;
    small.getContext("2d")?.drawImage(source, 0, 0, small.width, small.height);
    return small.toDataURL("image/jpeg", 0.6);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_PAINT_TEMPLATE_ID ?? import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      sounds.error();
      setSendState("error");
      return;
    }
    setSendState("sending");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        { from_email: email, subject: "🎨 Liv XP Paint", message: note || "(no message)", drawing: exportSmallJpeg() },
        publicKey
      );
      sounds.ding();
      setSendState("sent");
      setNote("");
    } catch (err) {
      console.error("Failed to send drawing", err);
      sounds.error();
      setSendState("error");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#ECE9D8] font-xp text-xs select-none relative">
      <div className="flex items-center gap-1 px-1 py-0.5 border-b border-[#ACA899] shrink-0">
        <button onClick={undo} disabled={!canUndo} className="flex items-center gap-1 px-2 py-0.5 hover:bg-[#316AC5] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-current">
          <FaUndo size={10} />
        </button>
        <button onClick={handleClear} className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white">
          {p.clear}
        </button>
        <button onClick={handleSave} className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white">
          {p.save}
        </button>
        <button
          onClick={() => {
            setSendState("idle");
            setShowSend(true);
          }}
          className="px-2 py-0.5 font-bold text-[#215DC6] hover:bg-[#316AC5] hover:text-white"
        >
          {p.send} ✉
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-14 shrink-0 p-1 flex flex-col items-center gap-1 border-r border-[#ACA899]">
          <div className="grid grid-cols-2 gap-0.5">
            {(Object.keys(TOOL_ICONS) as Tool[]).map((key) => {
              const Icon = TOOL_ICONS[key];
              return (
                <button
                  key={key}
                  title={p.tools[key]}
                  aria-label={p.tools[key]}
                  aria-pressed={tool === key}
                  onClick={() => setTool(key)}
                  className={`w-6 h-6 flex items-center justify-center border ${
                    tool === key ? "bg-white border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : "border-transparent hover:border-[#808080]"
                  }`}
                >
                  <Icon size={12} />
                </button>
              );
            })}
          </div>
          <div className="w-12 mt-2 p-1 border border-t-[#808080] border-l-[#808080] border-r-white border-b-white flex flex-col items-center gap-1" title={p.size}>
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)} aria-label={`${p.size} ${s}`} className={`w-full flex items-center justify-center h-5 ${size === s ? "bg-[#316AC5]" : ""}`}>
                <span className={`rounded-full ${size === s ? "bg-white" : "bg-black"}`} style={{ width: Math.min(16, s), height: Math.min(16, s) }} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-auto bg-[#808080] p-2">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="bg-white max-w-full h-auto shadow-[2px_2px_0_rgba(0,0,0,0.4)] touch-none"
            style={{ cursor: tool === "fill" ? "cell" : "crosshair" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 border-t border-[#ACA899] shrink-0">
        <div className="relative w-8 h-8 shrink-0 border border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white">
          <span className="absolute left-1 top-1 w-4 h-4 border border-black" style={{ background: color }} />
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-px overflow-x-auto">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={c}
              className={`w-4 h-4 border ${color === c ? "border-white outline outline-1 outline-black" : "border-t-[#808080] border-l-[#808080] border-r-white border-b-white"}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <span className="ml-auto hidden md:block text-gray-600 truncate">{p.status}</span>
      </div>

      {showSend && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 z-10">
          <form onSubmit={handleSend} className="w-full max-w-xs bg-[#ECE9D8] border-[3px] border-[#0831D9] rounded-t-lg shadow-xl">
            <div className="px-2 py-1 text-white font-bold bg-linear-to-b from-[#0997FF] to-[#0053EE] rounded-t-sm text-[13px]">{p.sendTitle}</div>
            <div className="p-3 space-y-2">
              {sendState === "sent" ? (
                <p className="text-green-700 font-bold py-4 text-center">{p.sent}</p>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder={p.yourEmail}
                    aria-label={p.yourEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-1 py-0.5 border border-[#7F9DB9] bg-white outline-none"
                  />
                  <textarea
                    placeholder={p.note}
                    aria-label={p.note}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full h-16 px-1 py-0.5 border border-[#7F9DB9] bg-white outline-none resize-none"
                  />
                  {sendState === "error" && <p className="text-red-600">{p.error}</p>}
                </>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowSend(false)} className="xp-button">
                  {sendState === "sent" ? "OK" : p.cancel}
                </button>
                {sendState !== "sent" && (
                  <button type="submit" disabled={sendState === "sending"} className="xp-button font-bold disabled:opacity-50">
                    {sendState === "sending" ? p.sending : p.send}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PaintWindow;
