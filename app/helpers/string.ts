export const getInitial = (
  name: string | null | undefined,
  fallback: string
): string => {
  const base = name && name.trim().length > 0 ? name.trim() : fallback;
  return base.charAt(0).toUpperCase();
};

