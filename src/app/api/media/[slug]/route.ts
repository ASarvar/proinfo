import { NextRequest, NextResponse } from "next/server";
import { prisma, getEntityTranslations, formatResponse, formatError, Language } from "../../../../lib/api-helpers";

/**
 * GET /api/media/[slug]
 * Get a specific media item by slug (works for posts, videos, photos, downloads)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lang = (new URL(request.url).searchParams.get("lang") || "RU") as Language;

    // Try to find in each media type
    let result: any = null;
    let type: string = "";

    // Check post
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { tags: { select: { slug: true, name: true } } },
    });
    if (post) {
      const translations = await getEntityTranslations("Post", post.id, [lang]);
      result = {
        id: post.id,
        slug: post.slug,
        type: "post",
        coverImageUrl: post.coverImageUrl,
        tags: post.tags.map((t) => t.slug),
        publishedAt: post.publishedAt,
        ...translations[lang],
      };
      type = "post";
    }

    // Check video
    if (!result) {
      const video = await prisma.video.findUnique({
        where: { slug },
        include: { tags: { select: { slug: true, name: true } } },
      });
      if (video) {
        const translations = await getEntityTranslations("Video", video.id, [lang]);
        result = {
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
        type = "video";
      }
    }

    // Check photo album
    if (!result) {
      const album = await prisma.photoAlbum.findUnique({
        where: { slug },
        include: {
          items: { orderBy: { order: "asc" } },
          tags: { select: { slug: true, name: true } },
        },
      });
      if (album) {
        const translations = await getEntityTranslations("PhotoAlbum", album.id, [lang]);
        result = {
          id: album.id,
          slug: album.slug,
          type: "photo",
          coverImageUrl: album.coverImageUrl,
          items: album.items.map((item) => ({
            id: item.id,
            imageUrl: item.imageUrl,
            caption: item.caption,
          })),
          tags: album.tags.map((t) => t.slug),
          publishedAt: album.publishedAt,
          ...translations[lang],
        };
        type = "photo";
      }
    }

    // Check download
    if (!result) {
      const file = await prisma.downloadFile.findUnique({
        where: { slug },
        include: { tags: { select: { slug: true, name: true } } },
      });
      if (file) {
        const translations = await getEntityTranslations("DownloadFile", file.id, [lang]);
        result = {
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
        type = "download";
      }
    }

    if (!result) {
      return NextResponse.json(formatError({ message: "Media item not found" }), { status: 404 });
    }

    return NextResponse.json(formatResponse(result, `${type} retrieved`), { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/media/[slug]]", error);
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
