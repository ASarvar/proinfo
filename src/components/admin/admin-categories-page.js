"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { catalogCategories, categoryGroups } from "@data/catalog-categories";
import {
  adminActionDeleteStyle,
  adminActionViewStyle,
  adminAlertErrorStyle,
  adminAlertSuccessStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminGroupBodyStyle,
  adminGroupCardStyle,
  adminGroupHeaderStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminInputStyle,
  adminLabelStyle,
  adminLoadingTextStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
  adminResponsiveGridStyle,
  adminSectionStyle,
  adminSectionTitleStyle,
  adminSummaryTextStyle,
  adminTableContainerStyle,
  adminTableHeadRowStyle,
  adminTableStyle,
  adminTdStyle,
  adminThStyle,
  adminUploadLabelStyle,
  adminHeroMetaWrapStyle,
} from "./admin-ui-tokens";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load from public API which includes id + productCount
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/categories?lang=RU&limit=200");
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Failed to load categories");
      setDbCategories(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setError(e.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Clicking "Pre-fill" fills the form from static catalog data
  const preFill = (cat, groupKey, parentSlug = "") => {
    const query = new URLSearchParams({
      title: cat.name,
      slug: cat.slug,
      groupKey,
      parentSlug,
    });
    router.push(`/admin/categories/new?${query.toString()}`);
  };

  const onDelete = async (id, slug, productCount) => {
    const msg = productCount > 0
      ? `Delete "${slug}" and its ${productCount} product(s)? This is irreversible.`
      : `Delete category "${slug}"?`;
    if (!confirm(msg)) return;
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Delete failed");
      setMessage(`Deleted: ${slug}`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const dbBySlug = new Map(dbCategories.map((c) => [c.slug, c]));
  const catalogSlugSet = new Set(catalogCategories.map((c) => c.slug));
  const extraDbCategories = dbCategories.filter((c) => !catalogSlugSet.has(c.slug));

  return (
    <section style={pageShellStyle}>
      <div style={ambientGlowTopStyle} />
      <div style={ambientGlowSideStyle} />

      <div style={heroStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={pageTitleStyle}>Categories</h1>
          <p style={heroSubtitleStyle}>
            Hierarchy: Group → Category → Subcategory. Slug is auto-generated from title for Latin text.
          </p>
        </div>
        <div style={heroStatsStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Total</span>
            <strong style={metaValueStyle}>{dbCategories.length}</strong>
          </div>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Catalog Seed</span>
            <strong style={metaValueStyle}>{catalogCategories.length}</strong>
          </div>
          <button type="button" onClick={() => router.push("/admin/categories/new")} style={btnPrimaryStyle}>
            + Create New
          </button>
        </div>
      </div>

      <p style={summaryTextStyle}>
        Keep structure clean and pre-fill missing categories from the catalog map.
      </p>

      {message && <div style={alertSuccessStyle}>{message}</div>}
      {error && <div style={alertErrorStyle}>{error}</div>}

      {/* ── Hierarchy by group ── */}
      {categoryGroups.map((group) => {
        const topInGroup = catalogCategories.filter((c) => c.groupKey === group.key && !c.parentSlug);

        return (
          <div key={group.key} style={groupCardStyle}>
            <div style={groupHeaderStyle}>{group.name}</div>
            <div style={groupBodyStyle}>
              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                <thead>
                  <tr style={tableHeadRowStyle}>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Slug</th>
                    <th style={thStyle}>Products</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topInGroup.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ ...tdStyle, color: "#94a3b8" }}>No categories defined for this group.</td>
                    </tr>
                  )}
                  {topInGroup.flatMap((cat) => {
                    const dbCat = dbBySlug.get(cat.slug);
                    const subCats = catalogCategories.filter((c) => c.parentSlug === cat.slug);

                    const parentRow = (
                      <tr key={cat.slug}>
                        <td style={tdStyle}><strong>{cat.name}</strong></td>
                        <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13 }}>{cat.slug}</td>
                        <td style={tdStyle}>{dbCat?.productCount ?? "—"}</td>
                        <td style={tdStyle}>
                          {dbCat
                            ? <span style={badgeInDb}>In DB</span>
                            : <span style={badgeMissing}>Not saved</span>}
                        </td>
                        <td style={tdStyle}>
                          {dbCat
                            ? <button type="button" onClick={() => onDelete(dbCat.id, cat.slug, dbCat.productCount)} style={btnDeleteStyle}>Delete</button>
                            : <button type="button" onClick={() => preFill(cat, group.key)} style={btnSeedStyle}>Pre-fill form</button>}
                        </td>
                      </tr>
                    );

                    const subRows = subCats.map((sub) => {
                      const dbSub = dbBySlug.get(sub.slug);
                      return (
                        <tr key={sub.slug} style={{ background: "#fafbfc" }}>
                          <td style={{ ...tdStyle, paddingLeft: 28 }}>
                            <span style={{ color: "#94a3b8", marginRight: 6 }}>↳</span>
                            <span style={{ color: "#475569" }}>{sub.name}</span>
                          </td>
                          <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "#475569" }}>{sub.slug}</td>
                          <td style={tdStyle}>{dbSub?.productCount ?? "—"}</td>
                          <td style={tdStyle}>
                            {dbSub
                              ? <span style={badgeInDb}>In DB</span>
                              : <span style={badgeMissing}>Not saved</span>}
                          </td>
                          <td style={tdStyle}>
                            {dbSub
                              ? <button type="button" onClick={() => onDelete(dbSub.id, sub.slug, dbSub.productCount)} style={btnDeleteStyle}>Delete</button>
                              : <button type="button" onClick={() => preFill(sub, group.key, cat.slug)} style={btnSeedStyle}>Pre-fill form</button>}
                          </td>
                        </tr>
                      );
                    });

                    return [parentRow, ...subRows];
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── DB-only (custom) categories ── */}
      {extraDbCategories.length > 0 && (
        <div style={groupCardStyle}>
          <div style={{ ...groupHeaderStyle, background: "#475569" }}>Custom / Uncategorised</div>
          <div style={groupBodyStyle}>
            <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeadRowStyle}>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Slug</th>
                  <th style={thStyle}>Products</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {extraDbCategories.map((c) => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{c.title || "—"}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13 }}>{c.slug}</td>
                    <td style={tdStyle}>{c.productCount ?? 0}</td>
                    <td style={tdStyle}>
                      <button type="button" onClick={() => onDelete(c.id, c.slug, c.productCount)} style={btnDeleteStyle}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {loading && <p style={loadingStyle}>Loading categories from database…</p>}
    </section>
  );
}

// ── Shared styles ──────────────────────────────────────────────

const pageShellStyle = adminPageShellStyle;

const ambientGlowTopStyle = adminAmbientGlowTopStyle;

const ambientGlowSideStyle = adminAmbientGlowSideStyle;

const heroStyle = adminHeroStyle;

const pageTitleStyle = {
  ...adminPageTitleStyle,
  margin: "0 0 6px",
};

const heroSubtitleStyle = adminHeroSubtitleStyle;

const heroStatsStyle = adminHeroMetaWrapStyle;

const summaryTextStyle = adminSummaryTextStyle;

const btnPrimaryStyle = adminPrimaryCtaStyle;

const btnDeleteStyle = adminActionDeleteStyle;

const btnSeedStyle = adminActionViewStyle;

const groupHeaderStyle = adminGroupHeaderStyle;

const groupBodyStyle = adminGroupBodyStyle;

const groupCardStyle = adminGroupCardStyle;

const tableContainerStyle = adminTableContainerStyle;

const tableStyle = adminTableStyle;

const tableHeadRowStyle = adminTableHeadRowStyle;

const badgeInDb = {
  background: "#DCFCE7",
  color: "#166534",
  borderRadius: 6,
  padding: "2px 8px",
  fontSize: 11,
  fontWeight: 700,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const badgeMissing = {
  background: "#F5F6F8",
  color: "#A3A3AA",
  borderRadius: 6,
  padding: "2px 8px",
  fontSize: 11,
  fontWeight: 600,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const thStyle = adminThStyle;
const tdStyle = adminTdStyle;

const alertSuccessStyle = adminAlertSuccessStyle;

const alertErrorStyle = adminAlertErrorStyle;

const loadingStyle = adminLoadingTextStyle;

const metaPillStyle = adminMetaPillStyle;

const metaLabelStyle = adminMetaLabelStyle;

const metaValueStyle = adminMetaValueStyle;
