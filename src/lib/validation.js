export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const normalizeText = (value) => `${value ?? ""}`.trim();

export const normalizeSlug = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const isValidSlug = (value) => slugPattern.test(normalizeText(value));

export const parseOptionalNumber = (value) => {
  const raw = normalizeText(value);
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export const validateRequired = (data, requiredKeys) => {
  const missing = requiredKeys.filter((key) => !normalizeText(data[key]));
  return {
    valid: missing.length === 0,
    missing,
  };
};
