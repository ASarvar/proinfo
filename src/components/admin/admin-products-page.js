"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@ui/Pagination";
import {
  adminAlertErrorStyle,
  adminAlertSuccessStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminLoadingTextStyle,
  adminHeroMetaWrapStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
  adminSummaryTextStyle,
} from "./admin-ui-tokens";

const ITEMS_PER_PAGE = 16;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Failed to load products");
      setProducts(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onDelete = async (id, slug) => {
    if (!confirm(`Delete product "${slug}"?`)) return;
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Delete failed");
      setMessage(`Deleted: ${slug}`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      (p.title || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q)
    );
  }, [search, products]);

  const { currentItems, pageCount } = useMemo(() => {
    const endOffset = itemOffset + ITEMS_PER_PAGE;
    return {
      currentItems: filtered.slice(itemOffset, endOffset),
      pageCount: Math.ceil(filtered.length / ITEMS_PER_PAGE),
    };
  }, [itemOffset, filtered]);

  useEffect(() => {
    setItemOffset(0);
  }, [search]);

  const handlePageClick = (event) => {
    if (filtered.length === 0) return;
    setItemOffset((event.selected * ITEMS_PER_PAGE) % filtered.length);
  };

  return (
    <section style={pageShellStyle}>
      <div style={ambientGlowTopStyle} />
      <div style={ambientGlowSideStyle} />

      <div style={heroStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={pageTitleStyle}>Products</h1>
          <p style={heroSubtitleStyle}>Manage your product catalog.</p>
        </div>
        <div style={heroActionsStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Total</span>
            <strong style={metaValueStyle}>{products.length}</strong>
          </div>
          <button type="button" onClick={() => router.push("/admin/products/new")} style={btnPrimaryStyle}>
            + Add Product
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={toolbarStyle}>
        <div style={searchBoxStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} style={searchClearStyle}>×</button>
          )}
        </div>
      </div>

      {message && <div style={alertSuccessStyle}>{message}</div>}
      {error && <div style={alertErrorStyle}>{error}</div>}

      {loading && <p style={loadingStyle}>Loading…</p>}

      {!loading && filtered.length === 0 && (
        <div style={emptyStateStyle}>
          {search ? `No products found for "${search}"` : "No products yet."}
          {!search && (
            <button type="button" onClick={() => router.push("/admin/products/new")} style={emptyStateActionStyle}>
              Create one →
            </button>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={cardGridStyle}>
          {currentItems.map((p) => {
            let extras = {};
            try { if (p.content) extras = JSON.parse(p.content); } catch {}
            const imageUrl = p.imageUrl || (Array.isArray(extras.images) ? extras.images[0] : null) || null;
            const price = p.price != null ? p.price : null;
            return (
              <div key={p.id} style={cardStyle}>
                {/* Image area */}
                <div style={cardImgAreaStyle}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={p.title || p.slug} style={cardImgStyle} />
                  ) : (
                    <div style={cardNoImgStyle}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                  )}
                  {/* Action buttons */}
                  <div style={cardActionsStyle}>
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                      style={cardEditBtnStyle}
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p.id, p.slug)}
                      style={cardDeleteBtnStyle}
                      title="Delete"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Card body */}
                <div style={cardBodyStyle}>
                  <div style={cardTitleStyle}>{p.title || p.slug}</div>
                  {price != null && (
                    <div style={cardPriceStyle}>${Number(price).toLocaleString("en", { minimumFractionDigits: 2 })}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > ITEMS_PER_PAGE && (
        <div className="tp-pagination tp-pagination-style-2" style={paginationWrapStyle}>
          <Pagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            focusPage={Math.floor(itemOffset / ITEMS_PER_PAGE)}
          />
        </div>
      )}
    </section>
  );
}

const pageShellStyle = adminPageShellStyle;
const ambientGlowTopStyle = adminAmbientGlowTopStyle;
const ambientGlowSideStyle = adminAmbientGlowSideStyle;
const heroStyle = { ...adminHeroStyle, alignItems: "center" };
const pageTitleStyle = { ...adminPageTitleStyle, margin: "0 0 6px" };
const heroSubtitleStyle = adminHeroSubtitleStyle;
const heroActionsStyle = adminHeroMetaWrapStyle;
const metaPillStyle = adminMetaPillStyle;
const metaLabelStyle = adminMetaLabelStyle;
const metaValueStyle = adminMetaValueStyle;
const btnPrimaryStyle = adminPrimaryCtaStyle;
const alertSuccessStyle = adminAlertSuccessStyle;
const alertErrorStyle = adminAlertErrorStyle;
const loadingStyle = adminLoadingTextStyle;

const toolbarStyle = { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 };

const searchBoxStyle = {
  display: "flex", alignItems: "center", gap: 8,
  background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
  padding: "8px 14px", flex: "0 0 auto", width: 280,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const searchInputStyle = {
  border: "none", outline: "none", fontSize: 13, color: "#1E293B",
  background: "transparent", flex: 1, minWidth: 0,
};

const searchClearStyle = {
  background: "none", border: "none", cursor: "pointer",
  color: "#94A3B8", fontSize: 16, lineHeight: 1, padding: 0,
};

const cardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 18,
};

const cardStyle = {
  background: "#fff", borderRadius: 16, overflow: "hidden",
  border: "1px solid #EEF1F8", boxShadow: "0 2px 8px rgba(3,4,28,0.05)",
};

const cardImgAreaStyle = {
  position: "relative", height: 200, background: "#F4F6FA",
  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
};

const cardImgStyle = { width: "100%", height: "100%", objectFit: "contain", padding: 12 };

const cardNoImgStyle = { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" };

const cardActionsStyle = {
  position: "absolute", top: 10, right: 10,
  display: "flex", flexDirection: "column", gap: 6,
};

const cardEditBtnStyle = {
  width: 32, height: 32, borderRadius: 8, background: "#22C55E", border: "none",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 2px 6px rgba(34,197,94,0.35)",
};

const cardDeleteBtnStyle = {
  width: 32, height: 32, borderRadius: 8, background: "#fff",
  border: "1px solid #E2E8F0", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const cardBodyStyle = { padding: "12px 14px 14px" };

const cardTitleStyle = { fontSize: 14, fontWeight: 600, color: "#0F172A", lineHeight: 1.4, marginBottom: 4 };

const cardPriceStyle = { fontSize: 14, fontWeight: 700, color: "#1E293B" };

const emptyStateStyle = {
  color: "#667085", marginTop: 8, fontSize: 14, background: "#fff",
  border: "1px solid #E6E9F2", borderRadius: 12, padding: "14px 16px",
  display: "flex", alignItems: "center", gap: 10,
};

const emptyStateActionStyle = {
  color: "#1D4ED8", background: "none", border: "none",
  cursor: "pointer", fontSize: 14, padding: 0, fontWeight: 700,
};

const paginationWrapStyle = {
  marginTop: 16, padding: "12px 14px", background: "#fff",
  border: "1px solid #E6E9F2", borderRadius: 12,
};
