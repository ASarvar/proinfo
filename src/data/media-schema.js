export const mediaCrudSchema = {
  id: { type: "string", required: true, immutable: true },
  slug: { type: "string", required: true, unique: true },
  type: {
    type: "enum",
    required: true,
    options: ["blog", "video", "photo", "download"],
  },
  title: { type: "string", required: true },
  excerpt: { type: "string", required: true },
  content: { type: "string", required: false },
  coverImage: { type: "string", required: true },
  publishedAt: { type: "date", required: true },
  tags: { type: "array<string>", required: false },
  duration: { type: "string", required: false },
  sourceUrl: { type: "string", required: false },
  downloadUrl: { type: "string", required: false },
  fileType: { type: "string", required: false },
  fileSize: { type: "string", required: false },
  gallery: { type: "array<string>", required: false },
};

export const mediaSchemaRequiredFields = Object.entries(mediaCrudSchema)
  .filter(([, config]) => config.required)
  .map(([field]) => field);
