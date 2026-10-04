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
    default:
      return null;
  }
}
