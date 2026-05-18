import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@lib/admin-auth";
import { getDirectionRelatedProductSlugs } from "@lib/admin-content";

const SOLUTION_SLUGS = ["libraries", "archives", "educational", "commercial"];

const SOLUTION_LABELS: Record<string, { ru: string; en: string }> = {
  libraries:   { ru: "Библиотеки",               en: "Libraries" },
  archives:    { ru: "Архивы",                    en: "Archives" },
  educational: { ru: "Образовательные учреждения", en: "Educational Institutions" },
  commercial:  { ru: "Коммерческие учреждения",   en: "Commercial Institutions" },
};

export async function GET(request: NextRequest) {
  const { error } = requireAdminSession(request);
  if (error) return error;

  try {
    const solutions = await Promise.all(
      SOLUTION_SLUGS.map(async (slug) => {
        const relatedProductSlugs = await getDirectionRelatedProductSlugs(slug);
        return {
          slug,
          titleRu: SOLUTION_LABELS[slug].ru,
          titleEn: SOLUTION_LABELS[slug].en,
          relatedProductSlugs,
        };
      })
    );
    return NextResponse.json({ success: true, data: solutions });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed" }, { status: 500 });
  }
}
