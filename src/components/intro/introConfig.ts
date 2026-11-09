export interface MovementAct {
  id: string;
  actNumber: number;
  label: string;
  eyebrow?: string;
  primaryLine: string;
  secondaryLine?: string;
  subText?: string;
  emphasisWord?: string;
  theme: "arrival" | "duality" | "discipline" | "signature";
  durationMs: number;
}

/**
 * The 4-Movement Cinematic Identity Sequence
 * Mathematically synchronized to Vishnu Vijay's "Indrajaalam" (114 BPM, ~2.105s per bar).
 * 
 * Bar 1-2 (0.0s - 4.2s):  Movement 01 — THE ARRIVAL (Acoustic guitar pick & atmospheric opening)
 * Bar 3-4 (4.2s - 8.4s):  Movement 02 — THE DUALITY (Solo flute motif enters: "LOGIC meets Imagination")
 * Bar 5-6 (8.4s - 12.6s): Movement 03 — THE DISCIPLINE (Drums & bass enter: "DESIGN. ARCHITECT. SHIP.")
 * Bar 7-8 (12.6s - 17.0s): Movement 04 — THE SIGNATURE (Harmonic crescendo to beat drop: "EDHUBILLI SANDEEP KUMAR")
 */
export const CINEMATIC_MOVEMENTS: MovementAct[] = [
  {
    id: "movement-01",
    actNumber: 1,
    label: "ARRIVAL",
    eyebrow: "A STUDIO OF ONE",
    primaryLine: "PRECISION AT SCALE.",
    secondaryLine: "ARCHITECTING SYSTEMS.",
    subText: "HIGH CONCURRENCY · DISTRIBUTED ARCHITECTURE · FAULT TOLERANCE",
    emphasisWord: "SYSTEMS.",
    theme: "arrival",
    durationMs: 4200,
  },
  {
    id: "movement-02",
    actNumber: 2,
    label: "DUALITY",
    eyebrow: "PHILOSOPHY // 02",
    primaryLine: "LOGIC meets Imagination.",
    subText: "Where computational rigor meets uncompromising aesthetic craft",
    emphasisWord: "Imagination.",
    theme: "duality",
    durationMs: 4200,
  },
  {
    id: "movement-03",
    actNumber: 3,
    label: "DISCIPLINE",
    eyebrow: "SYSTEM EXECUTION // 03",
    primaryLine: "DESIGN. ARCHITECT. SHIP.",
    subText: "FULL-STACK ARCHITECTURE · CREATIVE TECHNOLOGY",
    emphasisWord: "SHIP.",
    theme: "discipline",
    durationMs: 4200,
  },
  {
    id: "movement-04",
    actNumber: 4,
    label: "SIGNATURE",
    eyebrow: "FULL STACK ARCHITECT & ENGINEER",
    primaryLine: "EDHUBILLI SANDEEP KUMAR",
    secondaryLine: "SCALABLE SYSTEMS · BESPOKE USER INTERFACES",
    subText: "EXPLORE PORTFOLIO ↓",
    emphasisWord: "SANDEEP",
    theme: "signature",
    durationMs: 4400,
  },
];

// Backwards-compatible alias for existing imports
export const CINEMATIC_ACTS = CINEMATIC_MOVEMENTS;
export type StatementAct = MovementAct;
