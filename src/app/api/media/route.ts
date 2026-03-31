import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language, createEntityTranslations } from "../../../lib/api-helpers";

type MediaType = "post" | "video" | "photo" | "download";

/**
 * GET /api/media
 * Get all media items with filtering by type, tag, skip, limit
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get("lang") || "RU") as Language;
    const type: MediaType = (searchParams.get("type") || "post") as MediaType;
    const tag = searchParams.get("tag");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    let result: any[] = [];

    if (type === "post") {
      let where: any = {};
      if (tag) {
        where.tags = { some: { slug: tag } };
      }

      const posts = await prisma.post.findMany({
        where,
        take: limit,
        skip,
        orderBy: { publishedAt: "desc" },
        include: { tags: { select: { slug: true, name: true } } },
      });

      result = await Promise.all(
        posts.map(async (post) => {
          const translations = await getEntityTranslations("Post", post.id, [lang]);
          return {
            id: post.id,
            slug: post.slug,
            type: "post",
            coverImageUrl: post.coverImageUrl,
            tags: post.tags.map((t) => t.slug),
            publishedAt: post.publishedAt,
            ...translations[lang],
          };
        })
      );
    } else if (type === "video") {
      let where: any = {};
      if (tag) {
        where.tags = { some: { slug: tag } };
      }

      const videos = await prisma.video.findMany({
        where,
        take: limit,
        skip,
        orderBy: { publishedAt: "desc" },
        include: { tags: { select: { slug: true, name: true } } },
      });

      result = await Promise.all(
        videos.map(async (video) => {
          const translations = await getEntityTranslations("Video", video.id, [lang]);
          return {
            id: video.id,
            slug: video.slug,
            type: "video",
            coverImageUrl: video.coverImageUrl,
            videoUrl: video.videoUrl,
            duration: video.duration,
            tags: video.tags.map((t) => t.slug),
            publishedAt: video.publishedAt,
            ...translations[lang],
          };
        })
      );
    } else if (type === "photo") {
      let where: any = {};
      if (tag) {
        where.tags = { some: { slug: tag } };
      }

      const albums = await prisma.photoAlbum.findMany({
        where,
        take: limit,
        skip,
        orderBy: { publishedAt: "desc" },
        include: {
          items: { select: { imageUrl: true }, take: 1 },
          tags: { select: { slug: true, name: true } },
        },
      });

      result = await Promise.all(
        albums.map(async (album) => {
          const translations = await getEntityTranslations("PhotoAlbum", album.id, [lang]);
          return {
            id: album.id,
            slug: album.slug,
            type: "photo",
            coverImageUrl: album.coverImageUrl || (album.items[0]?.imageUrl || null),
            tags: album.tags.map((t) => t.slug),
            publishedAt: album.publishedAt,
            ...translations[lang],
          };
        })
      );
    } else if (type === "download") {
      let where: any = {};
      if (tag) {
        where.tags = { some: { slug: tag } };
      }

      const files = await prisma.downloadFile.findMany({
        where,
        take: limit,
        skip,
        orderBy: { publishedAt: "desc" },
        include: { tags: { select: { slug: true, name: true } } },
      });

      result = await Promise.all(
        files.map(async (file) => {
          const translations = await getEntityTranslations("DownloadFile", file.id, [lang]);
          return {
            id: file.id,
            slug: file.slug,
            type: "download",
            fileUrl: file.fileUrl,
            fileType: file.fileType,
            fileSizeKb: file.fileSizeKb,
            tags: file.tags.map((t) => t.slug),
            publishedAt: file.publishedAt,
            ...translations[lang],
          };
        })
      );
    }

    return NextResponse.json(formatResponse(result, `Retrieved ${result.length} ${type} items`), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/media]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
