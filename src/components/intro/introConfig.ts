export interface StatementAct {
  id: string;
  actNumber: number;
  label: string;
  primaryText: string;
  secondaryText: string;
  subText?: string;
  emphasisWord?: string;
  ghostWord: string;
  theme: "attitude" | "mindset" | "engineering" | "creativity" | "identity";
  fontFamily: string;
  durationMs: number;
}

export const CINEMATIC_ACTS: StatementAct[] = [
  {
    id: "act-01",
    actNumber: 1,
    label: "ATTITUDE",
    primaryText: "NOT HERE TO FOLLOW.",
    secondaryText: "HERE TO BUILD.",
    emphasisWord: "BUILD.",
    ghostWord: "BUILD",
    theme: "attitude",
    fontFamily: "Anton",
    durationMs: 3100,
  },
  {
    id: "act-02",
    actNumber: 2,
    label: "MINDSET",
    primaryText: "THINK BEYOND.",
    secondaryText: "QUESTION EVERYTHING.",
    emphasisWord: "BEYOND.",
    ghostWord: "DISRUPT",
    theme: "mindset",
    fontFamily: "Space Grotesk",
    durationMs: 3100,
  },
  {
    id: "act-03",
    actNumber: 3,
    label: "ENGINEERING",
    primaryText: "NOT JUST WRITING CODE.",
    secondaryText: "ENGINEERING SOLUTIONS.",
    emphasisWord: "ENGINEERING",
    ghostWord: "ENGINEER",
    theme: "engineering",
    fontFamily: "Oswald",
    durationMs: 3200,
  },
  {
    id: "act-04",
    actNumber: 4,
    label: "CREATIVITY",
    primaryText: "LOGIC MEETS IMAGINATION.",
    secondaryText: "DESIGN. DEVELOP. CREATE.",
    subText: "Crafting digital experiences with precision & purpose",
    emphasisWord: "CREATE.",
    ghostWord: "CREATE",
    theme: "creativity",
    fontFamily: "Anton",
    durationMs: 3300,
  },
  {
    id: "act-05",
    actNumber: 5,
    label: "IDENTITY",
    primaryText: "EDHUBILLI SANDEEP KUMAR",
    secondaryText: "DEVELOPER. BUILDER. CREATOR.",
    subText: "WELCOME TO THE PORTFOLIO",
    emphasisWord: "SANDEEP",
    ghostWord: "SANDEEP",
    theme: "identity",
    fontFamily: "Anton",
    durationMs: 3900,
  },
];
