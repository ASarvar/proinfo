import { getMediaByType, getMediaBySlug, getMediaCounts, mediaTypes } from "@data/media";
import products from "@data/products";
import { catalogCategories } from "@data/catalog-categories";
import { listMedia } from "@lib/media-crud";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const localeToLang = (locale = "ru") => {
  if (locale === "uz") return "UZ";
  if (locale === "en") return "EN";
  return "RU";
};

const normalizeMediaType = (type) => (type === "blog" ? "post" : type);

const mapApiMediaToUi = (item, locale) => {
  const type = item.type === "post" ? "blog" : item.type;
  const fileSize =
    item.fileSizeKb && Number.isFinite(item.fileSizeKb)
      ? `${(item.fileSizeKb / 1024).toFixed(1)} MB`
      : undefined;

  return {
    ...item,
    type,
    coverImage: item.coverImageUrl || "/assets/img/image.jpg",
    excerpt: item.excerpt || item.description || "",
    href: `/${locale}/support/${type}/${item.slug}`,
    sourceUrl: item.videoUrl,
    downloadUrl: item.fileUrl,
    fileSize,
    gallery: Array.isArray(item.items) ? item.items.map((photo) => photo.imageUrl) : undefined,
  };
};

async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload?.data;
}

export async function getSupportMediaList({ locale, type, tag = "all", month = "all" }) {
  try {
    const lang = localeToLang(locale);
    const apiType = normalizeMediaType(type);
    const query = new URLSearchParams({ lang, type: apiType });
    if (tag !== "all") query.set("tag", tag);

    const items = await apiGet(`/api/media?${query.toString()}`);

    return (items || [])
      .map((item) => mapApiMediaToUi(item, locale))
      .filter((item) => (month === "all" ? true : `${item.publishedAt || ""}`.startsWith(month)));
  } catch {
    return getMediaByType(type, { locale, tag, month });
  }
}

export async function getSupportMediaDetail({ locale, type, slug }) {
  try {
    const lang = localeToLang(locale);
    const item = await apiGet(`/api/media/${slug}?lang=${lang}`);
    if (!item) return null;
    return mapApiMediaToUi(item, locale);
  } catch {
    return getMediaBySlug(type, slug, locale);
  }
}

export async function getSupportMediaCounts(locale) {
  try {
    const lang = localeToLang(locale);
    const [blog, video, photo, download] = await Promise.all([
      apiGet(`/api/media?type=post&lang=${lang}`),
      apiGet(`/api/media?type=video&lang=${lang}`),
      apiGet(`/api/media?type=photo&lang=${lang}`),
      apiGet(`/api/media?type=download&lang=${lang}`),
    ]);

    return {
      blog: (blog || []).length,
      video: (video || []).length,
      photo: (photo || []).length,
      download: (download || []).length,
    };
  } catch {
    return getMediaCounts();
  }
}

export async function getAdminCategories(locale) {
  try {
    const lang = localeToLang(locale);
    const items = await apiGet(`/api/categories?lang=${lang}`);
    return (items || []).map((item) => ({
      name: item.title,
      slug: item.slug,
      parentSlug: "-",
    }));
  } catch {
    return catalogCategories;
  }
}

export async function getAdminProducts(locale) {
  try {
    const lang = localeToLang(locale);
    const items = await apiGet(`/api/products?lang=${lang}`);
    return (items || []).map((item) => ({
      _id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.categorySlug,
      price: item.price,
    }));
  } catch {
    return products;
  }
}

export async function getAdminMedia({ locale, type = "all" }) {
  try {
    const lang = localeToLang(locale);

    if (type === "all") {
      const [blog, video, photo, download] = await Promise.all([
        apiGet(`/api/media?type=post&lang=${lang}`),
        apiGet(`/api/media?type=video&lang=${lang}`),
        apiGet(`/api/media?type=photo&lang=${lang}`),
        apiGet(`/api/media?type=download&lang=${lang}`),
      ]);

      return [...(blog || []), ...(video || []), ...(photo || []), ...(download || [])].map((item) =>
        mapApiMediaToUi(item, locale)
      );
    }

    const apiType = normalizeMediaType(type);
    const items = await apiGet(`/api/media?type=${apiType}&lang=${lang}`);
    return (items || []).map((item) => mapApiMediaToUi(item, locale));
  } catch {
    return listMedia({ type });
  }
}

export { mediaTypes };
