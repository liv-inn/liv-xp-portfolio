// Hand-drawn SVG icons in a Windows XP-ish style.
interface IconProps {
  className?: string;
}

export function PaintIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M24 6C12 6 4 14 4 23c0 8 6 12 11 12 3 0 4-2 6-2s3 2 3 5c0 3 3 4 6 4 10 0 14-9 14-17C44 14 35 6 24 6z" fill="#F4E3C1" stroke="#8A6A3B" strokeWidth="2" />
      <circle cx="14" cy="21" r="3.5" fill="#E53935" />
      <circle cx="21" cy="13" r="3.5" fill="#FDD835" />
      <circle cx="31" cy="13" r="3.5" fill="#43A047" />
      <circle cx="37" cy="22" r="3.5" fill="#1E88E5" />
      <circle cx="34" cy="31" r="3.5" fill="#8E24AA" />
      <path d="M40 2l4 4-16 18-5 1 1-5z" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
    </svg>
  );
}

export function MineIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="3" y="3" width="42" height="42" rx="4" fill="#C0C0C0" stroke="#7B7B7B" strokeWidth="2" />
      <g stroke="#111" strokeWidth="3" strokeLinecap="round">
        <line x1="24" y1="8" x2="24" y2="40" />
        <line x1="8" y1="24" x2="40" y2="24" />
        <line x1="13" y1="13" x2="35" y2="35" />
        <line x1="35" y1="13" x2="13" y2="35" />
      </g>
      <circle cx="24" cy="24" r="10" fill="#111" />
      <rect x="19" y="18" width="4" height="4" fill="#fff" />
    </svg>
  );
}

export function WinampIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="wa-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A4A5E" />
          <stop offset="1" stopColor="#1B1B26" />
        </linearGradient>
        <linearGradient id="wa-bolt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD54F" />
          <stop offset="1" stopColor="#FF8F00" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="9" fill="url(#wa-bg)" stroke="#000" strokeWidth="1.5" />
      <path d="M28 7L13 27h10l-4 14 16-21H25z" fill="url(#wa-bolt)" stroke="#7A3E00" strokeWidth="1.2" />
    </svg>
  );
}

export function CmdIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="3" y="6" width="42" height="36" rx="2" fill="#0A0A0A" stroke="#8C8C8C" strokeWidth="2" />
      <rect x="3" y="6" width="42" height="7" fill="#245EDC" />
      <path d="M10 21l7 5-7 5" stroke="#C0C0C0" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="20" y1="33" x2="32" y2="33" stroke="#C0C0C0" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function RecycleIcon({ className, full = true }: IconProps & { full?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M10 14h28l-3 30H13z" fill="#E3F0FB" stroke="#5B7FA8" strokeWidth="2" opacity="0.95" />
      <ellipse cx="24" cy="14" rx="14" ry="3.5" fill="#CFE2F5" stroke="#5B7FA8" strokeWidth="2" />
      <g stroke="#9FB9D6" strokeWidth="1.5">
        <line x1="18" y1="19" x2="19" y2="40" />
        <line x1="24" y1="19" x2="24" y2="40" />
        <line x1="30" y1="19" x2="29" y2="40" />
      </g>
      {full && (
        <>
          <path d="M16 13l5-7 6 3 5-4 3 8z" fill="#FFF8D6" stroke="#B8A55A" strokeWidth="1.2" />
          <rect x="22" y="4" width="8" height="9" fill="#fff" stroke="#999" strokeWidth="1" transform="rotate(15 26 8)" />
        </>
      )}
      <path d="M24 25l3 5h-6z" fill="#3D9B47" />
    </svg>
  );
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M4 12a3 3 0 013-3h11l4 4h19a3 3 0 013 3v22a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#E8B83F" stroke="#A67C12" strokeWidth="1.5" />
      <path d="M4 18h40v20a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#FAD565" stroke="#A67C12" strokeWidth="1.5" />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M10 4h20l10 10v30H10z" fill="#fff" stroke="#6B7A8F" strokeWidth="2" />
      <path d="M30 4v10h10" fill="#E5ECF5" stroke="#6B7A8F" strokeWidth="2" />
      <g stroke="#9AA9BC" strokeWidth="2">
        <line x1="15" y1="22" x2="35" y2="22" />
        <line x1="15" y1="28" x2="35" y2="28" />
        <line x1="15" y1="34" x2="28" y2="34" />
      </g>
    </svg>
  );
}

export function IniIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M10 4h20l10 10v30H10z" fill="#fff" stroke="#6B7A8F" strokeWidth="2" />
      <path d="M30 4v10h10" fill="#E5ECF5" stroke="#6B7A8F" strokeWidth="2" />
      <g stroke="#9AA9BC" strokeWidth="2">
        <line x1="15" y1="20" x2="35" y2="20" />
        <line x1="15" y1="26" x2="26" y2="26" />
      </g>
      <circle cx="31" cy="35" r="6" fill="#B0B8C4" stroke="#4A5568" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="31" cy="35" r="2.5" fill="#fff" stroke="#4A5568" strokeWidth="1.5" />
    </svg>
  );
}

export function IeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <ellipse cx="24" cy="25" rx="21" ry="8" fill="none" stroke="#F5B400" strokeWidth="3" transform="rotate(-25 24 25)" />
      <circle cx="24" cy="25" r="14" fill="#2A7FD4" stroke="#0B4F9E" strokeWidth="2" />
      <path d="M15 26h18a9 9 0 10-2.6 6.4" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M2 34c6-6 26-20 42-22" fill="none" stroke="#F5B400" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Small arrow badge drawn over shortcut (.url / .lnk) icons */
export function ShortcutBadge({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <rect x="0.5" y="0.5" width="15" height="15" fill="#fff" stroke="#6B7A8F" />
      <path d="M4 12c0-5 3-7 7-7M8 3h4v4" fill="none" stroke="#1F5FBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PowerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#E2462B" stroke="#fff" strokeWidth="1.5" />
      <path d="M12 5v7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M7.8 8.2a6 6 0 108.4 0" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function LogOffIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#E9A62A" stroke="#fff" strokeWidth="1.5" />
      <path d="M10 6h-3v12h3" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M11 12h8m-3-3l3 3-3 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function SpeakerIcon({ className, muted }: IconProps & { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M3 9h4l5-4v14l-5-4H3z" fill="#fff" stroke="#1B3F8F" strokeWidth="1" />
      {muted ? (
        <path d="M15 9l6 6m0-6l-6 6" stroke="#E53935" strokeWidth="2.2" strokeLinecap="round" />
      ) : (
        <path d="M15 8.5a5 5 0 010 7M17.5 6a8.5 8.5 0 010 12" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function ClipsterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M9 20V7a3 3 0 016 0v10a1.5 1.5 0 01-3 0V8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
