import { DESIGN_TOKENS } from "./tokens";

export const layoutTokens = {
  pagePaddingX: "1rem",
  pagePaddingXDesktop: "2rem",
  contentMaxWidth: `${DESIGN_TOKENS.layout.containers.lg}px`,
  sectionGap: `${DESIGN_TOKENS.spacing.xl}px`,
  cardGap: `${DESIGN_TOKENS.spacing.md}px`,
} as const;
