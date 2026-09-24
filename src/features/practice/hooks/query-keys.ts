export const practiceKeys = {
  all: ["practice"] as const,
  scores: () => [...practiceKeys.all, "scores"] as const,
};
