export const progressKeys = {
  all: ["progress"] as const,
  snapshot: () => [...progressKeys.all, "snapshot"] as const,
};
