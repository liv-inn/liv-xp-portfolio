import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { useSettings } from "../../context/useSettings";
import { sounds } from "../../lib/sounds";

const ROWS = 9;
const COLS = 9;
const MINES = 10;
const LONG_PRESS_MS = 400;

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

type Status = "ready" | "playing" | "won" | "lost";

const NUMBER_COLORS = ["", "#0000FF", "#008000", "#FF0000", "#000080", "#800000", "#008080", "#000000", "#808080"];

const emptyBoard = (): Cell[] =>
  Array.from({ length: ROWS * COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }));

const neighbors = (index: number): number[] => {
  const r = Math.floor(index / COLS);
  const c = index % COLS;
  const result: number[] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) result.push(nr * COLS + nc);
    }
  return result;
};

// Mines are placed after the first click so the first move is always safe
function plantMines(board: Cell[], safeIndex: number): Cell[] {
  const forbidden = new Set([safeIndex, ...neighbors(safeIndex)]);
  const next = board.map((c) => ({ ...c }));
  let planted = 0;
  while (planted < MINES) {
    const i = Math.floor(Math.random() * next.length);
    if (next[i].mine || forbidden.has(i)) continue;
    next[i].mine = true;
    planted++;
  }
  next.forEach((cell, i) => {
    cell.adjacent = neighbors(i).filter((n) => next[n].mine).length;
  });
  return next;
}

function floodReveal(board: Cell[], start: number): Cell[] {
  const next = board.map((c) => ({ ...c }));
  const stack = [start];
  while (stack.length) {
    const i = stack.pop()!;
    const cell = next[i];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.adjacent === 0 && !cell.mine) stack.push(...neighbors(i));
  }
  return next;
}

function MinesweeperWindow() {
  const { t } = useSettings();
  const m = t.minesweeper;
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [status, setStatus] = useState<Status>("ready");
  const [seconds, setSeconds] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [explodedAt, setExplodedAt] = useState<number | null>(null);
  const longPress = useRef<{ timer: ReturnType<typeof setTimeout> | null; fired: boolean }>({ timer: null, fired: false });

  useEffect(() => {
    if (status !== "playing") return;
    const timer = setInterval(() => setSeconds((s) => Math.min(999, s + 1)), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setStatus("ready");
    setSeconds(0);
    setExplodedAt(null);
  }, []);

  const toggleFlag = (index: number) => {
    if (status === "won" || status === "lost" || board[index].revealed) return;
    sounds.click();
    setBoard((b) => b.map((c, i) => (i === index ? { ...c, flagged: !c.flagged } : c)));
  };

  const reveal = (index: number) => {
    if (status === "won" || status === "lost") return;
    let current = board;
    if (status === "ready") {
      current = plantMines(board, index);
      setStatus("playing");
    }
    const cell = current[index];
    if (cell.flagged || cell.revealed) return;

    if (cell.mine) {
      sounds.explode();
      setExplodedAt(index);
      setStatus("lost");
      setBoard(current.map((c) => (c.mine ? { ...c, revealed: true } : c)));
      return;
    }

    const next = floodReveal(current, index);
    const unrevealedSafe = next.filter((c) => !c.revealed && !c.mine).length;
    if (unrevealedSafe === 0) {
      sounds.win();
      setStatus("won");
      setBoard(next.map((c) => (c.mine ? { ...c, flagged: true } : c)));
      return;
    }
    sounds.click();
    setBoard(next);
  };

  const handleClick = (index: number) => {
    if (longPress.current.fired) {
      longPress.current.fired = false;
      return;
    }
    if (flagMode) toggleFlag(index);
    else reveal(index);
  };

  const handleContextMenu = (e: MouseEvent, index: number) => {
    e.preventDefault();
    if (!longPress.current.fired) toggleFlag(index);
  };

  // Touch: long-press places a flag
  const startPress = (index: number, pointerType: string) => {
    setPressing(true);
    if (pointerType !== "touch") return;
    longPress.current.fired = false;
    longPress.current.timer = setTimeout(() => {
      longPress.current.fired = true;
      toggleFlag(index);
    }, LONG_PRESS_MS);
  };

  const endPress = () => {
    setPressing(false);
    if (longPress.current.timer) clearTimeout(longPress.current.timer);
  };

  const flagsLeft = MINES - board.filter((c) => c.flagged).length;
  const face = status === "lost" ? "😵" : status === "won" ? "😎" : pressing ? "😮" : "🙂";
  const counter = (n: number) => String(Math.max(-99, n)).padStart(3, "0");

  return (
    <div className="bg-[#C0C0C0] p-2 select-none font-xp" onContextMenu={(e) => e.preventDefault()}>
      <div className="border-[3px] border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-1.5">
        <div className="flex items-center justify-between mb-1.5 p-1 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white">
          <span className="bg-black text-[#FF0000] font-mono text-xl leading-none px-1 tracking-widest">{counter(flagsLeft)}</span>
          <button
            onClick={reset}
            title={m.newGame}
            aria-label={m.newGame}
            className="w-8 h-8 text-lg leading-none bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white"
          >
            {face}
          </button>
          <span className="bg-black text-[#FF0000] font-mono text-xl leading-none px-1 tracking-widest">{counter(seconds)}</span>
        </div>

        <div
          className="grid border-[3px] border-t-[#808080] border-l-[#808080] border-r-white border-b-white"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1.75rem)` }}
          onPointerLeave={endPress}
        >
          {board.map((cell, i) => (
            <button
              key={i}
              className={`w-7 h-7 flex items-center justify-center text-sm font-bold leading-none ${
                cell.revealed
                  ? `border border-[#808080]/60 ${explodedAt === i ? "bg-red-500" : "bg-[#C0C0C0]"}`
                  : "bg-[#C0C0C0] border-[3px] border-t-white border-l-white border-r-[#808080] border-b-[#808080]"
              }`}
              style={{ color: NUMBER_COLORS[cell.adjacent] }}
              onClick={() => handleClick(i)}
              onContextMenu={(e) => handleContextMenu(e, i)}
              onPointerDown={(e) => !cell.revealed && startPress(i, e.pointerType)}
              onPointerUp={endPress}
              aria-label={cell.revealed ? (cell.mine ? "mine" : String(cell.adjacent)) : cell.flagged ? "flag" : "hidden"}
            >
              {cell.revealed ? (cell.mine ? "💣" : cell.adjacent || "") : cell.flagged ? "🚩" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 text-xs">
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="checkbox" checked={flagMode} onChange={(e) => setFlagMode(e.target.checked)} />
          🚩 {m.flagMode}
        </label>
        <span className="font-bold" aria-live="polite">
          {status === "won" ? m.won : status === "lost" ? m.lost : ""}
        </span>
      </div>
      <p className="text-[10px] text-gray-700 mt-1 max-w-[16rem]">{m.help}</p>
    </div>
  );
}

export default MinesweeperWindow;
