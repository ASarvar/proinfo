"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminAlertErrorStyle,
  adminAlertSuccessStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminLoadingTextStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
  adminSummaryTextStyle,
  adminHeroMetaWrapStyle,
} from "./admin-ui-tokens";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null); // { id, slug, productCount }
  const [blockedTarget, setBlockedTarget] = useState(null); // { slug, subCount }
  const [deleting, setDeleting] = useState(false);

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

  // Step 1: open confirm modal (subCount > 0 shows blocked modal)
  const requestDelete = (id, slug, productCount, subCount = 0) => {
    setMessage("");
    setError("");
    if (subCount > 0) {
      setBlockedTarget({ slug, subCount, productCount: 0 });
      return;
    }
    if (productCount > 0) {
      setBlockedTarget({ slug, subCount: 0, productCount });
      return;
    }
    setConfirmTarget({ id, slug, productCount });
  };

  // Step 2: confirmed — handle products then delete category
  const confirmDelete = async () => {
    if (!confirmTarget) return;
    const { id, slug, productCount } = confirmTarget;
    setConfirmTarget(null);
    setDeleting(true);
    setError("");
    try {
      // Delete the category itself
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Delete failed");
      setMessage(`Deleted: ${slug}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  // Split into top-level and subcategories
  const topLevel = dbCategories.filter((c) => !c.parentSlug);
  const subsByParent = dbCategories.reduce((acc, c) => {
    if (c.parentSlug) {
      if (!acc[c.parentSlug]) acc[c.parentSlug] = [];
      acc[c.parentSlug].push(c);
    }
    return acc;
  }, {});
  // Count only actually-rendered categories (orphans with missing parents are excluded)
  const renderedSubCount = topLevel.reduce((sum, cat) => sum + (subsByParent[cat.slug]?.length || 0), 0);
  const totalRendered = topLevel.length + renderedSubCount;

  return (
    <section style={pageShellStyle}>
      <div style={ambientGlowTopStyle} />
      <div style={ambientGlowSideStyle} />

      <div style={heroStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={pageTitleStyle}>Categories</h1>
          <p style={heroSubtitleStyle}>
            Manage top-level categories and subcategories.
          </p>
        </div>
        <div style={heroStatsStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Total</span>
            <strong style={metaValueStyle}>{totalRendered}</strong>
          </div>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Top-level</span>
            <strong style={metaValueStyle}>{topLevel.length}</strong>
          </div>
          <button type="button" onClick={() => router.push("/admin/categories/new")} style={btnPrimaryStyle}>
            + Create New
          </button>
        </div>
      </div>

      <p style={summaryTextStyle}>
        Select a parent when creating a subcategory, or leave it empty for a top-level category.
      </p>

      {message && <div style={alertSuccessStyle}>{message}</div>}
      {error && <div style={alertErrorStyle}>{error}</div>}

      {!loading && topLevel.length === 0 && (
        <p style={{ color: "#94a3b8", marginTop: 24 }}>No categories yet. Create one using the button above.</p>
      )}

      {!loading && topLevel.length > 0 && (
        <div style={catListStyle}>
          {topLevel.map((cat) => {
            const subs = subsByParent[cat.slug] || [];
            return (
              <div key={cat.slug} style={catCardStyle}>
                {/* ── Category header row ── */}
                <div style={catHeaderStyle}>
                  <div style={catHeaderLeftStyle}>
                    <span style={avatarStyle}>
                      {(cat.title || cat.slug).charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div style={catNameStyle}>{cat.title || cat.slug}</div>
                      <code style={slugStyle}>{cat.slug}</code>
                    </div>
                  </div>
                  <div style={catHeaderRightStyle}>
                    <span style={countBadgeStyle("#E26666", "#FFF0F0")}>
                      {cat.productCount ?? 0} products
                    </span>
                    <span style={countBadgeStyle("#6366F1", "#EEF2FF")}>
                      {subs.length} subcategories
                    </span>
                    <button
                      type="button"
                      onClick={() => requestDelete(cat.id, cat.slug, cat.productCount ?? 0, subs.length)}
                      style={deleteBtnStyle}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* ── Subcategory grid ── */}
                {subs.length > 0 && (
                  <div style={subGridStyle}>
                    {subs.map((sub) => (
                      <div key={sub.slug} style={subChipStyle}>
                        <div style={subChipTopStyle}>
                          <div style={subChipNameStyle}>{sub.title || sub.slug}</div>
                          <button
                            type="button"
                            onClick={() => requestDelete(sub.id, sub.slug, sub.productCount ?? 0)}
                            style={subDeleteBtnStyle}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                        <div style={subChipBottomStyle}>
                          <code style={subSlugStyle}>{sub.slug}</code>
                          <span style={countBadgeStyle("#E26666", "#FFF0F0")}>{sub.productCount ?? 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {subs.length === 0 && (
                  <div style={noSubsStyle}>No subcategories</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {loading && <p style={loadingStyle}>Loading categories from database…</p>}

      {/* ── Deleting overlay ── */}
      {deleting && (
        <div style={overlayStyle}>
          <div style={overlayBoxStyle}>
            <p style={{ margin: 0, color: "#e2e8f0", fontWeight: 600 }}>Deleting…</p>
          </div>
        </div>
      )}

      {/* ── Blocked modal (has subcategories) ── */}
      {blockedTarget && (
        <div style={overlayStyle}>
          <div style={overlayBoxStyle}>
            <p style={{ margin: "0 0 6px", color: "#f8fafc", fontWeight: 700, fontSize: 16 }}>
              Cannot Delete &ldquo;{blockedTarget.slug}&rdquo;
            </p>
            <p style={{ margin: "0 0 18px", color: "#fca5a5", fontSize: 13 }}>
              {blockedTarget.subCount > 0 && (
                <>This category has <strong>{blockedTarget.subCount}</strong> subcategor{blockedTarget.subCount === 1 ? "y" : "ies"}.<br />Please delete all subcategories first before removing the parent.</>
              )}
              {blockedTarget.productCount > 0 && (
                <>This category has <strong>{blockedTarget.productCount}</strong> product{blockedTarget.productCount === 1 ? "" : "s"}.<br />Please reassign or delete all products before removing this category.</>
              )}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setBlockedTarget(null)}
                style={modalCancelBtnStyle}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm modal ── */}
      {confirmTarget && (
        <div style={overlayStyle}>
          <div style={overlayBoxStyle}>
            <p style={{ margin: "0 0 6px", color: "#f8fafc", fontWeight: 700, fontSize: 16 }}>
              Delete &ldquo;{confirmTarget.slug}&rdquo;?
            </p>
            <p style={{ margin: "0 0 18px", color: "#94a3b8", fontSize: 13 }}>
              This action is irreversible.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                style={modalCancelBtnStyle}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={modalDeleteBtnStyle}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Styles ──────────────────────────────────────────────

const pageShellStyle = adminPageShellStyle;
const ambientGlowTopStyle = adminAmbientGlowTopStyle;
const ambientGlowSideStyle = adminAmbientGlowSideStyle;
const heroStyle = adminHeroStyle;
const pageTitleStyle = { ...adminPageTitleStyle, margin: "0 0 6px" };
const heroSubtitleStyle = adminHeroSubtitleStyle;
const heroStatsStyle = adminHeroMetaWrapStyle;
const summaryTextStyle = adminSummaryTextStyle;
const btnPrimaryStyle = adminPrimaryCtaStyle;
const alertSuccessStyle = adminAlertSuccessStyle;
const alertErrorStyle = adminAlertErrorStyle;
const loadingStyle = adminLoadingTextStyle;
const metaPillStyle = adminMetaPillStyle;
const metaLabelStyle = adminMetaLabelStyle;
const metaValueStyle = adminMetaValueStyle;

// ── Category cards ──
const catListStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 14,
  marginTop: 12,
};

const catCardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #E8EDF6",
  boxShadow: "0 2px 12px rgba(3,4,28,0.06)",
  overflow: "hidden",
};

const catHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "14px 18px",
  borderBottom: "1px solid #F0F4FA",
  background: "#FAFBFF",
};

const catHeaderLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const catHeaderRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
};

const avatarStyle = {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: "linear-gradient(140deg, #03041C 0%, #212761 100%)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 17,
  fontWeight: 700,
  fontFamily: "'Space Grotesk', sans-serif",
  flexShrink: 0,
};

const catNameStyle = {
  fontWeight: 700,
  fontSize: 15,
  color: "#0F172A",
  lineHeight: 1.3,
  fontFamily: "'Space Grotesk', sans-serif",
};

const slugStyle = {
  fontSize: 11,
  fontFamily: "monospace",
  color: "#94A3B8",
  background: "#F4F7FF",
  borderRadius: 5,
  padding: "1px 6px",
  border: "1px solid #E2E8F0",
};

const countBadgeStyle = (color, bg) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  color,
  background: bg,
  whiteSpace: "nowrap",
});

const deleteBtnStyle = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid #FECACA",
  background: "#FEF2F2",
  color: "#DC2626",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

// ── Subcategory grid ──
const subGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 10,
  padding: "14px 18px",
};

const subChipStyle = {
  background: "#F8FAFC",
  border: "1px solid #E8EDF6",
  borderRadius: 10,
  padding: "10px 12px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  transition: "box-shadow 0.15s",
};

const subChipTopStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 6,
};

const subChipNameStyle = {
  fontWeight: 600,
  fontSize: 13,
  color: "#1E293B",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
};

const subChipBottomStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 6,
};

const subSlugStyle = {
  fontSize: 10,
  fontFamily: "monospace",
  color: "#94A3B8",
};

const subDeleteBtnStyle = {
  flexShrink: 0,
  width: 22,
  height: 22,
  borderRadius: 6,
  border: "1px solid #FECACA",
  background: "#FEF2F2",
  color: "#DC2626",
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
  padding: 0,
};

const noSubsStyle = {
  padding: "12px 18px",
  fontSize: 12,
  color: "#CBD5E1",
  fontStyle: "italic",
};

// ── Modals ──
const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const overlayBoxStyle = {
  background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: "28px 32px", minWidth: 320, maxWidth: 440,
  boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
};
const modalCancelBtnStyle = {
  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 8, padding: "8px 18px", color: "#94a3b8", fontSize: 13,
  cursor: "pointer", fontWeight: 600,
};
const modalDeleteBtnStyle = {
  background: "#dc2626", border: "none", borderRadius: 8,
  padding: "8px 18px", color: "#fff", fontSize: 13,
  cursor: "pointer", fontWeight: 700,
};

