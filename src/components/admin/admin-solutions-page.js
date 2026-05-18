"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
} from "./admin-ui-tokens";

const SOLUTIONS = [
  { slug: "libraries",   titleRu: "Библиотеки",                en: "Libraries" },
  { slug: "archives",    titleRu: "Архивы",                    en: "Archives" },
  { slug: "educational", titleRu: "Образовательные учреждения", en: "Educational Institutions" },
  { slug: "commercial",  titleRu: "Коммерческие учреждения",   en: "Commercial Institutions" },
];

export default function AdminSolutionsPage() {
  const router = useRouter();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/solutions")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success) {
          const map = {};
          json.data.forEach((d) => { map[d.slug] = d.relatedProductSlugs.length; });
          setCounts(map);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={adminPageShellStyle}>
      <div style={adminAmbientGlowTopStyle} />
      <div style={adminAmbientGlowSideStyle} />

      <div style={adminHeroStyle}>
        <div>
          <h1 style={adminPageTitleStyle}>Solutions</h1>
          <p style={adminHeroSubtitleStyle}>Configure related products for each solution page.</p>
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {SOLUTIONS.map((dir) => (
          <div
            key={dir.slug}
            style={{
              background: "#ffffff",
              border: "1px solid #e8eaf0",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#1a2540" }}>{dir.titleRu}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{dir.en}</div>
              {!loading && (
                <div style={{ fontSize: 12, color: counts[dir.slug] > 0 ? "#0ea5e9" : "#9ca3af", marginTop: 4 }}>
                  {counts[dir.slug] > 0
                    ? `${counts[dir.slug]} product${counts[dir.slug] === 1 ? "" : "s"} pinned`
                    : "No products pinned — using category filter"}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => router.push(`/admin/solutions/${dir.slug}`)}
              style={{ ...adminPrimaryCtaStyle, fontSize: 13, padding: "8px 16px" }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
