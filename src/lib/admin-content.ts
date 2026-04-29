import { Language, prisma } from "./api-helpers";
import { createEntityTranslations, getEntityTranslations } from "./api-helpers";
import { unlink } from "fs/promises";
import path from "path";

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
          title: tr[lang]?.title,
          description: tr[lang]?.description,
          content: tr[lang]?.content,  // raw JSON for admin table to parse
          price: row.price,
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

export async function getAdminContentById(resource: AdminResource, id: string, lang: Language = Language.RU) {
  if (resource === "products") {
    const row = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!row) return null;
    const tr = await getEntityTranslations("Product", row.id, [lang]);
    return {
      id: row.id,
      slug: row.slug,
      imageUrl: row.imageUrl,
      categorySlug: row.category?.slug ?? null,
      price: row.price,
      title: tr[lang]?.title ?? null,
      description: tr[lang]?.description ?? null,
      content: tr[lang]?.content ?? null,
    };
  }
  return null;
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
        imageUrl: (Array.isArray(payload?.images) && payload.images[0]) ? String(payload.images[0]).trim() : (imageUrl || null),
        price: payload?.price ?? null,
      },
    });

    // Store extra product fields as JSON in Translation.content
    const extras: Record<string, unknown> = {};
    if (payload?.sku) extras.sku = String(payload.sku).trim();
    if (payload?.stockQuantity != null) extras.quantity = Number(payload.stockQuantity);
    if (Array.isArray(payload?.images) && payload.images.length > 0) extras.images = payload.images.filter(Boolean);
    if (Array.isArray(payload?.tags) && payload.tags.length > 0) extras.tags = payload.tags;
    if (Array.isArray(payload?.features) && payload.features.length > 0) extras.features = payload.features;
    if (payload?.specifications && typeof payload.specifications === "object" && Object.keys(payload.specifications).length > 0) {
      extras.specifications = payload.specifications;
    }
    if (payload?.videoUrl) extras.videoUrl = String(payload.videoUrl).trim();
    if (payload?.brochureUrl) extras.brochureUrl = String(payload.brochureUrl).trim();
    if (payload?.longDescription) extras.longDescription = String(payload.longDescription);

    const extrasContent = Object.keys(extras).length > 0 ? JSON.stringify(extras) : content;

    const translations: Record<Language, { title: string; description?: string; content?: string }> = {
      [Language.RU]: { title, description: description ?? undefined, content: extrasContent ?? undefined },
      [Language.UZ]: { title, description: description ?? undefined, content: extrasContent ?? undefined },
      [Language.EN]: { title, description: description ?? undefined, content: extrasContent ?? undefined },
    };
    await createEntityTranslations("Product", row.id, translations);
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
    // Use images[0] as primary imageUrl if provided
    const primaryImageUrl = Array.isArray(payload?.images) && payload.images[0]
      ? String(payload.images[0]).trim()
      : imageUrl;
    if (primaryImageUrl !== undefined) patch.imageUrl = primaryImageUrl || null;
    if (payload?.price != null) patch.price = Number(payload.price);

    // Update category if categorySlug provided
    if (payload?.categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: normalizeSlug(payload.categorySlug) } });
      if (cat) patch.categoryId = cat.id;
    }

    await prisma.product.update({ where: { id }, data: patch });

    // Rebuild extras JSON for Translation.content
    const extras: Record<string, unknown> = {};
    if (payload?.sku) extras.sku = String(payload.sku).trim();
    if (payload?.stockQuantity != null) extras.quantity = Number(payload.stockQuantity);
    if (Array.isArray(payload?.images) && payload.images.length > 0) extras.images = payload.images.filter(Boolean);
    if (Array.isArray(payload?.tags) && payload.tags.length > 0) extras.tags = payload.tags;
    if (Array.isArray(payload?.features) && payload.features.length > 0) extras.features = payload.features;
    if (payload?.specifications && typeof payload.specifications === "object" && Object.keys(payload.specifications).length > 0) {
      extras.specifications = payload.specifications;
    }
    if (payload?.videoUrl) extras.videoUrl = String(payload.videoUrl).trim();
    if (payload?.brochureUrl) extras.brochureUrl = String(payload.brochureUrl).trim();
    if (payload?.longDescription) extras.longDescription = String(payload.longDescription);
    const extrasContent = Object.keys(extras).length > 0 ? JSON.stringify(extras) : null;

    // Update translations for all languages (use findFirst+update/create — no composite unique on entityType+entityId+language)
    const title = (payload?.title || "").trim();
    const descriptionVal = (payload?.description || "").trim() || null;
    if (title) {
      for (const lang of [Language.RU, Language.UZ, Language.EN]) {
        const existing = await prisma.translation.findFirst({
          where: { entityType: "Product", entityId: id, language: lang },
          select: { id: true },
        });
        if (existing) {
          await prisma.translation.update({
            where: { id: existing.id },
            data: { title, description: descriptionVal, content: extrasContent },
          });
        } else {
          await prisma.translation.create({
            data: { entityType: "Product", entityId: id, language: lang, title, description: descriptionVal, content: extrasContent },
          });
        }
      }
    }

    return prisma.product.findUnique({ where: { id } });
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
  if (resource === "products") {
    // Collect uploaded image URLs before deleting
    const product = await prisma.product.findUnique({ where: { id } });
    const translations = product
      ? await prisma.translation.findMany({ where: { entityType: "Product", entityId: id }, select: { content: true } })
      : [];
    const imagesToDelete: string[] = [];
    if (product?.imageUrl) imagesToDelete.push(product.imageUrl);
    for (const tr of translations) {
      try {
        if (tr.content) {
          const extras = JSON.parse(tr.content);
          if (Array.isArray(extras.images)) {
            for (const url of extras.images) {
              if (url && !imagesToDelete.includes(url)) imagesToDelete.push(url);
            }
          }
        }
      } catch {}
    }
    const deleted = await prisma.product.delete({ where: { id } });
    // Delete local files asynchronously (don't fail if file missing)
    const uploadDir = path.join(process.cwd(), "public");
    for (const url of imagesToDelete) {
      if (typeof url === "string" && url.startsWith("/uploads/")) {
        const filePath = path.join(uploadDir, url.replace(/\/uploads\//, "uploads/"));
        unlink(filePath).catch(() => {});
      }
    }
    return deleted;
  }
  if (resource === "blog") return prisma.post.delete({ where: { id } });
  if (resource === "video") return prisma.video.delete({ where: { id } });
  if (resource === "photo") return prisma.photoAlbum.delete({ where: { id } });
  if (resource === "download") return prisma.downloadFile.delete({ where: { id } });
  return prisma.faq.delete({ where: { id } });
}
