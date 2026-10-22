export const C = {
  ink: "#0B0C10",
  housing: "#171A21",
  housingHi: "#242B36",
  titanium: "#383E4A",
  titaniumHi: "#5C6778",
  titaniumLo: "#2A313C",
  bone: "#C5C6C7",
  boneDim: "rgba(197,198,199,0.66)",
  boneFaint: "rgba(197,198,199,0.28)",
  teal: "#00F5D4",
  tealMid: "#14C4B0",
  tealSoft: "#8FFFEF",
  tealInk: "#06221E",
  orange: "#FF6B35",
  violet: "#7928CA",
  violetHot: "#C084FC",
} as const;

export const PHASE_TEAL = [C.teal, C.tealMid, C.tealSoft] as const;
