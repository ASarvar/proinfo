"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
} from "./admin-ui-tokens";

const SOLUTION_LABELS = {
  libraries:   "Библиотеки",
  archives:    "Архивы",
  educational: "Образовательные учреждения",
  commercial:  "Коммерческие учреждения",
};

export default function AdminSolutionEditPage({ slug }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productsRes, dirRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch(`/api/admin/solutions/${slug}`),
      ]);
      const productsJson = await productsRes.json();
      const dirJson = await dirRes.json();

      if (!productsRes.ok || !productsJson?.success) throw new Error(productsJson?.error || "Failed to load products");
      if (!dirRes.ok || !dirJson?.success) throw new Error(dirJson?.error || "Failed to load solution");

      setProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
      setSelected(new Set(dirJson.data?.relatedProductSlugs || []));
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.slug || "").toLowerCase().includes(q) ||
        (p.categorySlug || "").toLowerCase().includes(q)
    );
  }, [search, products]);

  const toggle = (slug) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/solutions/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlugs: Array.from(selected) }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Save failed");
      setMessage("Saved successfully!");
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const clearAll = () => setSelected(new Set());

  return (
    <section style={adminPageShellStyle}>
      <div style={adminAmbientGlowTopStyle} />
      <div style={adminAmbientGlowSideStyle} />

      {/* Header */}
      <div style={adminHeroStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={adminPageTitleStyle}>{SOLUTION_LABELS[slug] ?? slug}</h1>
          <p style={adminHeroSubtitleStyle}>
            Select products to pin on this solution page. If none are selected, products are filtered by category automatically.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => router.push("/admin/solutions")}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#f7f8fc",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            style={{ ...adminPrimaryCtaStyle, fontSize: 13, padding: "8px 20px", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving…" : `Save (${selected.size} selected)`}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div style={{ marginTop: 12, padding: "10px 16px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, color: "#166534", fontSize: 14 }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ marginTop: 12, padding: "10px 16px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#991b1b", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 8, background: "#f4f6fa", borderRadius: 8, padding: "8px 12px", border: "1px solid #e8eaf0" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#1a2540", width: "100%" }}
          />
        </div>
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {selected.size} selected · {products.length} total
        </span>
        {selected.size > 0 && (
          <button
            type="button"
            onClick={clearAll}
            style={{ fontSize: 13, color: "#ef4444", background: "none", border: "1px solid #fca5a5", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Product grid */}
      {loading ? (
        <p style={{ marginTop: 32, color: "#6b7280", fontSize: 14 }}>Loading products…</p>
      ) : filtered.length === 0 ? (
        <p style={{ marginTop: 32, color: "#6b7280", fontSize: 14 }}>No products found.</p>
      ) : (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((product) => {
            const isSelected = selected.has(product.slug);
            return (
              <button
                key={product.slug}
                type="button"
                onClick={() => toggle(product.slug)}
                style={{
                  background: isSelected ? "#eff6ff" : "#ffffff",
                  border: isSelected ? "2px solid #3b82f6" : "2px solid #e8eaf0",
                  borderRadius: 10,
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  overflow: "hidden",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  boxShadow: isSelected ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
                }}
              >
                {/* Checkbox indicator */}
                <div
                  style={{
                    position: "relative",
                    height: 140,
                    background: "#f1f5f9",
                  }}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title || product.slug}
                      fill
                      style={{ objectFit: "contain", padding: 10 }}
                    />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#cbd5e1", fontSize: 28 }}>
                      📦
                    </div>
                  )}
                  {/* Selection badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: isSelected ? "#3b82f6" : "#ffffff",
                      border: isSelected ? "2px solid #3b82f6" : "2px solid #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                </div>

                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2540", lineHeight: 1.3, marginBottom: 4 }}>
                    {product.title || product.slug}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{product.categorySlug}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom save bar */}
      {selected.size > 0 && (
        <div style={{ marginTop: 28, padding: "14px 20px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 14, color: "#1d4ed8" }}>
            {selected.size} product{selected.size === 1 ? "" : "s"} selected to show on this solution page.
          </span>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            style={{ ...adminPrimaryCtaStyle, fontSize: 13, padding: "8px 20px", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}
    </section>
  );
}
