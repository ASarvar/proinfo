import { Language, prisma } from "./api-helpers";
import { createEntityTranslations, getEntityTranslations } from "./api-helpers";

export type AdminResource =
  | "categories"
  | "products"
  | "blog"
  | "video"
  | "photo"
  | "download"
  | "faq";

export const adminResourceMeta: Record<AdminResource, { label: string; supportsPublishing: boolean }> = {
  categories: { label: "Categories", supportsPublishing: false },
  products: { label: "Products", supportsPublishing: false },
  blog: { label: "Blog", supportsPublishing: true },
  video: { label: "Video", supportsPublishing: true },
  photo: { label: "Photo", supportsPublishing: true },
  download: { label: "Download", supportsPublishing: true },
  faq: { label: "FAQ", supportsPublishing: false },
};

const validResources = Object.keys(adminResourceMeta) as AdminResource[];

export function isAdminResource(value: string): value is AdminResource {
  return validResources.includes(value as AdminResource);
}

function normalizeSlug(value: string) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildTranslations(title: string, description?: string, content?: string) {
  return {
    [Language.RU]: { title, description, content },
    [Language.UZ]: { title, description, content },
    [Language.EN]: { title, description, content },
  };
}

export async function listAdminContent(resource: AdminResource, lang: Language = Language.RU) {
  if (resource === "categories") {
    const rows = await prisma.category.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
    return Promise.all(
      rows.map(async (row) => {
        const tr = await getEntityTranslations("Category", row.id, [lang]);
        return {
          id: row.id,
          slug: row.slug,
          imageUrl: row.imageUrl,
          status: "published",
          publishedAt: row.createdAt,
          ...tr[lang],
          updatedAt: row.updatedAt,
        };
      })
    );
  }

  if (resource === "products") {
    const rows = await prisma.product.findMany({ orderBy: { updatedAt: "desc" }, take: 200, include: { category: true } });
    return Promise.all(
      rows.map(async (row) => {
        const tr = await getEntityTranslations("Product", row.id, [lang]);
        return {
          id: row.id,
          slug: row.slug,
          imageUrl: row.imageUrl,
          status: "published",
          publishedAt: row.createdAt,
          categorySlug: row.category.slug,
          ...tr[lang],
          updatedAt: row.updatedAt,
        };
      })
    );
  }

  if (resource === "blog") {
    const rows = await prisma.post.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
    return Promise.all(
      rows.map(async (row) => {
        const tr = await getEntityTranslations("Post", row.id, [lang]);
        return {
          id: row.id,
          slug: row.slug,
          imageUrl: row.coverImageUrl,
          status: row.publishedAt ? "published" : "draft",
          publishedAt: row.publishedAt,
          ...tr[lang],
          updatedAt: row.updatedAt,
        };
      })
    );
  }

  if (resource === "video") {
    const rows = await prisma.video.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
    return Promise.all(
      rows.map(async (row) => {
        const tr = await getEntityTranslations("Video", row.id, [lang]);
        return {
          id: row.id,
          slug: row.slug,
          imageUrl: row.coverImageUrl,
          videoUrl: row.videoUrl,
          status: row.publishedAt ? "published" : "draft",
          publishedAt: row.publishedAt,
          ...tr[lang],
          updatedAt: row.updatedAt,
        };
      })
    );
  }

  if (resource === "photo") {
    const rows = await prisma.photoAlbum.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
    return Promise.all(
      rows.map(async (row) => {
        const tr = await getEntityTranslations("PhotoAlbum", row.id, [lang]);
        return {
          id: row.id,
          slug: row.slug,
          imageUrl: row.coverImageUrl,
          status: row.publishedAt ? "published" : "draft",
          publishedAt: row.publishedAt,
          ...tr[lang],
          updatedAt: row.updatedAt,
        };
      })
    );
  }

  if (resource === "download") {
    const rows = await prisma.downloadFile.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
    return Promise.all(
      rows.map(async (row) => {
        const tr = await getEntityTranslations("DownloadFile", row.id, [lang]);
        return {
          id: row.id,
          slug: row.slug,
          fileUrl: row.fileUrl,
          status: row.publishedAt ? "published" : "draft",
          publishedAt: row.publishedAt,
          ...tr[lang],
          updatedAt: row.updatedAt,
        };
      })
    );
  }

  const rows = await prisma.faq.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
  return Promise.all(
    rows.map(async (row) => {
      const tr = await getEntityTranslations("FAQ", row.id, [lang]);
      return {
        id: row.id,
        slug: row.slug,
        status: "published",
        publishedAt: row.createdAt,
        ...tr[lang],
        updatedAt: row.updatedAt,
      };
    })
  );
}

export async function createAdminContent(resource: AdminResource, payload: any) {
  const title = (payload?.title || "").trim();
  const slug = normalizeSlug(payload?.slug || title);
  const description = (payload?.description || "").trim() || null;
  const content = (payload?.content || "").trim() || null;
  const imageUrl = (payload?.imageUrl || "").trim() || null;
  const fileUrl = (payload?.fileUrl || "").trim() || null;
  const publish = payload?.status === "published";

  if (!title || !slug) {
    throw new Error("title and slug are required");
  }

  if (resource === "categories") {
    const row = await prisma.category.create({ data: { slug, imageUrl } });
    await createEntityTranslations("Category", row.id, buildTranslations(title, description, content));
    return { id: row.id, slug: row.slug };
  }

  if (resource === "products") {
    const categorySlug = normalizeSlug(payload?.categorySlug || "");
    if (!categorySlug) {
      throw new Error("categorySlug is required for products");
    }

    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      throw new Error("categorySlug not found");
    }

    const row = await prisma.product.create({
      data: {
        slug,
        categoryId: category.id,
        imageUrl,
        price: payload?.price ?? null,
      },
    });

    await createEntityTranslations("Product", row.id, buildTranslations(title, description, content));
    return { id: row.id, slug: row.slug };
  }

  if (resource === "blog") {
    const row = await prisma.post.create({
      data: {
        slug,
        coverImageUrl: imageUrl,
        publishedAt: publish ? new Date() : null,
      },
    });

    await createEntityTranslations("Post", row.id, buildTranslations(title, description, content));
    return { id: row.id, slug: row.slug };
  }

  if (resource === "video") {
    const videoUrl = (payload?.videoUrl || "").trim();
    if (!videoUrl) {
      throw new Error("videoUrl is required for video");
    }

    const row = await prisma.video.create({
      data: {
        slug,
        coverImageUrl: imageUrl,
        videoUrl,
        publishedAt: publish ? new Date() : null,
      },
    });

    await createEntityTranslations("Video", row.id, buildTranslations(title, description, content));
    return { id: row.id, slug: row.slug };
  }

  if (resource === "photo") {
    const row = await prisma.photoAlbum.create({
      data: {
        slug,
        coverImageUrl: imageUrl,
        publishedAt: publish ? new Date() : null,
      },
    });

    await createEntityTranslations("PhotoAlbum", row.id, buildTranslations(title, description, content));
    return { id: row.id, slug: row.slug };
  }

  if (resource === "download") {
    if (!fileUrl) {
      throw new Error("fileUrl is required for download");
    }

    const row = await prisma.downloadFile.create({
      data: {
        slug,
        fileUrl,
        publishedAt: publish ? new Date() : null,
      },
    });

    await createEntityTranslations("DownloadFile", row.id, buildTranslations(title, description, content));
    return { id: row.id, slug: row.slug };
  }

  const row = await prisma.faq.create({ data: { slug } });
  await createEntityTranslations("FAQ", row.id, buildTranslations(title, description, content));
  return { id: row.id, slug: row.slug };
}

export async function updateAdminContent(resource: AdminResource, id: string, payload: any) {
  const patch: any = {};
  const imageUrl = typeof payload?.imageUrl === "string" ? payload.imageUrl.trim() : undefined;
  const fileUrl = typeof payload?.fileUrl === "string" ? payload.fileUrl.trim() : undefined;

  if (resource === "blog" || resource === "video" || resource === "photo" || resource === "download") {
    if (payload?.status === "published") {
      patch.publishedAt = new Date();
    }
    if (payload?.status === "draft") {
      patch.publishedAt = null;
    }
  }

  if (resource === "categories" && imageUrl !== undefined) {
    patch.imageUrl = imageUrl || null;
    return prisma.category.update({ where: { id }, data: patch });
  }

  if (resource === "products") {
    if (imageUrl !== undefined) patch.imageUrl = imageUrl || null;
    return prisma.product.update({ where: { id }, data: patch });
  }

  if (resource === "blog") {
    if (imageUrl !== undefined) patch.coverImageUrl = imageUrl || null;
    return prisma.post.update({ where: { id }, data: patch });
  }

  if (resource === "video") {
    if (imageUrl !== undefined) patch.coverImageUrl = imageUrl || null;
    if (typeof payload?.videoUrl === "string") patch.videoUrl = payload.videoUrl.trim();
    return prisma.video.update({ where: { id }, data: patch });
  }

  if (resource === "photo") {
    if (imageUrl !== undefined) patch.coverImageUrl = imageUrl || null;
    return prisma.photoAlbum.update({ where: { id }, data: patch });
  }

  if (resource === "download") {
    if (fileUrl !== undefined) patch.fileUrl = fileUrl || null;
    return prisma.downloadFile.update({ where: { id }, data: patch });
  }

  return prisma.faq.update({ where: { id }, data: patch });
}

export async function deleteAdminContent(resource: AdminResource, id: string) {
  if (resource === "categories") return prisma.category.delete({ where: { id } });
  if (resource === "products") return prisma.product.delete({ where: { id } });
  if (resource === "blog") return prisma.post.delete({ where: { id } });
  if (resource === "video") return prisma.video.delete({ where: { id } });
  if (resource === "photo") return prisma.photoAlbum.delete({ where: { id } });
  if (resource === "download") return prisma.downloadFile.delete({ where: { id } });
  return prisma.faq.delete({ where: { id } });
}
