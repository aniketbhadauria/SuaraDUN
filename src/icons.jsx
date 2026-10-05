const props = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export function Icon({ name, size = 20 }) {
  const p = props(size);
  switch (name) {
    case "home":
      return (
        <svg {...p}>
          <path d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1v-9.4Z" />
        </svg>
      );
    case "people":
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.8 19.2c.6-2.8 2.7-4.2 5.2-4.2s4.6 1.4 5.2 4.2" />
          <circle cx="17" cy="9" r="2.2" />
          <path d="M16.2 14.8c1.8.3 3.2 1.5 3.8 3.6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M4 19h16" />
          <path d="M7 16V9" />
          <path d="M12 16V5" />
          <path d="M17 16v-6" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M12 4.5 3.8 19h16.4L12 4.5Z" />
          <path d="M12 10v4.2" />
          <path d="M12 16.8h.01" />
        </svg>
      );
    case "map":
      return (
        <svg {...p}>
          <path d="M9 4.5 3.8 6.4v13.1L9 17.6l6 2 5.2-1.9V4.6L15 6.5 9 4.5Z" />
          <path d="M9 4.5v13.1" />
          <path d="M15 6.5v13.1" />
        </svg>
      );
    case "help":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" />
          <path d="M9.6 9.4a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1.1.9-1.1 1.7" />
          <path d="M12 16.6h.01" />
        </svg>
      );
    case "book":
      return (
        <svg {...p}>
          <path d="M5 5.2h6.2A2.8 2.8 0 0 1 14 8v11.2H7.2A2.2 2.2 0 0 0 5 21.4V5.2Z" />
          <path d="M19 5.2h-6.2A2.8 2.8 0 0 0 10 8v11.2h6.8A2.2 2.2 0 0 1 19 21.4V5.2Z" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...p}>
          <path d="m7 10 5 5 5-5" />
        </svg>
      );
    case "copy":
      return (
        <svg {...p}>
          <rect x="8" y="8" width="11" height="11" rx="2.5" />
          <path d="M6.5 16H6A2 2 0 0 1 4 14V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" />
        </svg>
      );
    case "swap":
      return (
        <svg {...p}>
          <path d="M7 7h11" />
          <path d="m14.5 4 3.5 3-3.5 3" />
          <path d="M17 17H6" />
          <path d="m9.5 14-3.5 3 3.5 3" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="M12 16V5" />
          <path d="m8 8.5 4-4 4 4" />
          <path d="M6 19.5h12" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="m5 12.5 4.2 4.2L19 7.5" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "up":
      return (
        <svg {...p}>
          <path d="M6 14.5 12 8l6 6.5" />
        </svg>
      );
    case "flat":
      return (
        <svg {...p}>
          <path d="M5 12h14" />
        </svg>
      );
    case "star":
      return (
        <svg {...p}>
          <path d="m12 4.2 2.1 4.4 4.8.7-3.5 3.4.8 4.8L12 15.2 7.8 17.5l.8-4.8L5.1 9.3l4.8-.7L12 4.2Z" />
        </svg>
      );
    case "mic":
      return (
        <svg {...p}>
          <rect x="9" y="4" width="6" height="10" rx="3" />
          <path d="M7 11a5 5 0 0 0 10 0" />
          <path d="M12 16v3.5" />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" />
          <path d="m10.5 9.2 5 2.8-5 2.8v-5.6Z" />
        </svg>
      );
    case "square":
      return (
        <svg {...p}>
          <rect x="6" y="6" width="12" height="12" rx="2.5" />
        </svg>
      );
    case "sun":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5" />
        </svg>
      );
    case "moon":
      return (
        <svg {...p}>
          <path d="M15.8 15.2A6.4 6.4 0 0 1 8.6 6.4 6.4 6.4 0 1 0 15.8 15.2Z" />
        </svg>
      );
    case "expand":
      return (
        <svg {...p}>
          <path d="M9 7H6.5A1.5 1.5 0 0 0 5 8.5v7A1.5 1.5 0 0 0 6.5 17H9" />
          <path d="M11 12H5.5" />
          <path d="m14 9 3.5 3L14 15" />
        </svg>
      );
    case "collapse":
      return (
        <svg {...p}>
          <path d="M15 7h2.5A1.5 1.5 0 0 1 19 8.5v7a1.5 1.5 0 0 1-1.5 1.5H15" />
          <path d="M13 12h5.5" />
          <path d="m10 9-3.5 3L10 15" />
        </svg>
      );
    case "box":
      return (
        <svg {...p}>
          <path d="M4 8.5 12 4l8 4.5V18a1 1 0 0 1-.6.9L12 21l-7.4-2.1A1 1 0 0 1 4 18V8.5Z" />
          <path d="M12 4v17M4 8.5l8 4.5 8-4.5" />
        </svg>
      );
    case "dna":
      return (
        <svg {...p}>
          <path d="M6 4c3 4 3 12 0 16M18 4c-3 4-3 12 0 16" />
          <path d="M7.5 8h9M7.5 16h9M8.5 12h7" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
          <path d="M14 4v4h4" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...p}>
          <path d="M5 10v4h3l5 4V6L8 10H5Z" />
          <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" />
        </svg>
      );
    case "flame":
      return (
        <svg {...p}>
          <path d="M12 3.5c1.2 2.2 3.5 3.4 3.5 6.2a5.5 5.5 0 1 1-11 0c0-2.8 2.3-4 3.5-6.2.4 1.4 1.5 2.3 2 2.3s1.6-.9 2-2.3Z" />
        </svg>
      );
    case "crane":
      return (
        <svg {...p}>
          <path d="M5 19h14M8 19V9l4-3 4 3v10" />
          <path d="M6 9h12M12 6v3" />
        </svg>
      );
    case "heart":
      return (
        <svg {...p}>
          <path d="M12 20.5S4.5 15.2 4.5 9.8a4.3 4.3 0 0 1 7.5-2.9A4.3 4.3 0 0 1 19.5 9.8c0 5.4-7.5 10.7-7.5 10.7Z" />
        </svg>
      );
    case "building":
      return (
        <svg {...p}>
          <path d="M5 20V8l7-4 7 4v12" />
          <path d="M9 12h2v2H9zM13 12h2v2h-2zM9 16h2v2H9zM13 16h2v2h-2z" />
        </svg>
      );
    case "road":
      return (
        <svg {...p}>
          <path d="M4 18 8 6h2l4 12M14 6h2l4 12" />
          <path d="M7 14h10" />
        </svg>
      );
    case "market":
      return (
        <svg {...p}>
          <path d="M4 10h16l-1.2 8H5.2L4 10Z" />
          <path d="M8 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
        </svg>
      );
    case "coins":
      return (
        <svg {...p}>
          <ellipse cx="9" cy="9" rx="5" ry="2.5" />
          <path d="M4 9v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9" />
          <ellipse cx="15" cy="13" rx="5" ry="2.5" />
          <path d="M10 13v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4" />
        </svg>
      );
    case "farm":
      return (
        <svg {...p}>
          <path d="M4 19h16M6 19V11l6-5 6 5v8" />
          <path d="M10 19v-4h4v4" />
        </svg>
      );
    default:
      return null;
  }
}
