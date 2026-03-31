import mediaItems from "@data/media";
import { mediaCrudSchema, mediaSchemaRequiredFields } from "@data/media-schema";

const mediaStore = mediaItems.map((item) => ({ ...item }));

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const listMedia = ({ type = "all", tag = "all", month = "all" } = {}) =>
  mediaStore
    .filter((item) => (type === "all" ? true : item.type === type))
    .filter((item) => (tag === "all" ? true : (item.tags || []).includes(tag)))
    .filter((item) => (month === "all" ? true : item.publishedAt.startsWith(month)))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

export const getMediaById = (id) => mediaStore.find((item) => item.id === id) || null;

export const validateMediaPayload = (payload, mode = "create") => {
  const errors = [];

  if (mode === "create") {
    mediaSchemaRequiredFields.forEach((field) => {
      if (!hasOwn(payload, field) || payload[field] === "" || payload[field] == null) {
        errors.push(`Field '${field}' is required.`);
      }
    });
  }

  Object.entries(payload).forEach(([key, value]) => {
    const rule = mediaCrudSchema[key];

    if (!rule) {
      errors.push(`Unknown field '${key}'.`);
      return;
    }

    if (rule.type === "enum" && value && !rule.options.includes(value)) {
      errors.push(`Field '${key}' must be one of: ${rule.options.join(", ")}.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const createMedia = (payload) => {
  const validation = validateMediaPayload(payload, "create");
  if (!validation.valid) {
    return { ok: false, errors: validation.errors };
  }

  if (mediaStore.some((item) => item.id === payload.id)) {
    return { ok: false, errors: ["Duplicate id."] };
  }

  if (mediaStore.some((item) => item.slug === payload.slug && item.type === payload.type)) {
    return { ok: false, errors: ["Duplicate slug for this media type."] };
  }

  mediaStore.push({ ...payload });
  return { ok: true, data: payload };
};

export const updateMedia = (id, patch) => {
  const index = mediaStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return { ok: false, errors: ["Media item not found."] };
  }

  const nextValue = { ...mediaStore[index], ...patch };
  const validation = validateMediaPayload(nextValue, "update");
  if (!validation.valid) {
    return { ok: false, errors: validation.errors };
  }

  mediaStore[index] = nextValue;
  return { ok: true, data: nextValue };
};

export const deleteMedia = (id) => {
  const index = mediaStore.findIndex((item) => item.id === id);
  if (index < 0) {
    return { ok: false, errors: ["Media item not found."] };
  }

  const [removed] = mediaStore.splice(index, 1);
  return { ok: true, data: removed };
};
