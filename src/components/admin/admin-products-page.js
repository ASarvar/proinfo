"use client";

import { useCallback, useEffect, useState } from "react";
import { catalogCategories, categoryGroups, getCategoryBySlug } from "@data/catalog-categories";

// Mirrors server-side normalizeSlug in src/lib/admin-content.ts
const slugify = (v = "") =>
  v.toString().trim().toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const EMPTY_FORM = {
  title: "",
  slug: "",
  categorySlug: "",
  price: "",
  description: "",
  imageUrl: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [slugManual, setSlugManual] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/categories?lang=RU&limit=200"),
      ]);
      const [prodJson, catJson] = await Promise.all([prodRes.json(), catRes.json()]);
      if (!prodRes.ok || !prodJson?.success) throw new Error(prodJson?.error || "Failed to load products");
      if (!catRes.ok || !catJson?.success) throw new Error(catJson?.error || "Failed to load categories");
      setProducts(Array.isArray(prodJson.data) ? prodJson.data : []);
      setDbCategories(Array.isArray(catJson.data) ? catJson.data : []);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  };

  const onSlugChange = (e) => {
    setSlugManual(e.target.value.length > 0);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setSlugManual(false);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const finalSlug = form.slug || slugify(form.title);
    if (!finalSlug) {
      setError("Slug is required. For non-Latin titles, enter a slug manually.");
      return;
    }
    if (!form.categorySlug) {
      setError("Category is required.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      slug: finalSlug,
      categorySlug: form.categorySlug,
      ...(form.price ? { price: parseFloat(form.price) } : {}),
      ...(form.description ? { description: form.description.trim() } : {}),
      ...(form.imageUrl ? { imageUrl: form.imageUrl } : {}),
    };
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Create failed");
      resetForm();
      setMessage(`Created: ${json.data?.slug}`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

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

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Upload failed");
      setForm((prev) => ({ ...prev, imageUrl: json.data?.publicUrl || "" }));
      setMessage(`Uploaded: ${json.data?.name}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Build category title map from DB for display
  const catTitleMap = new Map(dbCategories.map((c) => [c.slug, c.title || c.slug]));

  // Group DB categories by group for <optgroup> select
  const catsByGroup = categoryGroups.map((group) => ({
    ...group,
    cats: dbCategories.filter((c) => {
      const catalogCat = getCategoryBySlug(c.slug);
      return catalogCat?.groupKey === group.key;
    }),
  }));
  const unmappedCats = dbCategories.filter((c) => !getCategoryBySlug(c.slug));

  // Group products for display
  const productsByGroup = categoryGroups.map((group) => ({
    ...group,
    products: products.filter((p) => {
      const catalogCat = getCategoryBySlug(p.categorySlug);
      return catalogCat?.groupKey === group.key;
    }),
  }));
  const uncategorisedProducts = products.filter((p) => !getCategoryBySlug(p.categorySlug));

  const totalCatsWithProducts = new Set(products.map((p) => p.categorySlug)).size;

  return (
    <section>
      <h1 style={{ marginBottom: 4 }}>Products</h1>
      <p style={{ marginBottom: 18, color: "#64748b" }}>
        {products.length} product{products.length !== 1 ? "s" : ""} across {totalCatsWithProducts} categor{totalCatsWithProducts !== 1 ? "ies" : "y"}.
        Slug is auto-generated from title (Latin only).
      </p>

      {/* ── Create form ── */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>New Product</h3>
        <form onSubmit={onCreate}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>

            <div style={fieldStyle}>
              <label style={labelStyle}>Title</label>
              <input
                required
                placeholder="Product title"
                value={form.title}
                onChange={onTitleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Slug&nbsp;
                <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11 }}>
                  {slugManual ? "(manual)" : "(auto)"}
                </span>
              </label>
              <input
                placeholder="auto-from-title"
                value={form.slug}
                onChange={onSlugChange}
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Category</label>
              <select
                required
                value={form.categorySlug}
                onChange={(e) => setForm((prev) => ({ ...prev, categorySlug: e.target.value }))}
                style={inputStyle}
              >
                <option value="">— select category —</option>
                {catsByGroup.map((group) =>
                  group.cats.length > 0 ? (
                    <optgroup key={group.key} label={group.name}>
                      {group.cats.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.title || c.slug}</option>
                      ))}
                    </optgroup>
                  ) : null
                )}
                {unmappedCats.length > 0 && (
                  <optgroup label="Custom / Uncategorised">
                    {unmappedCats.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.title || c.slug}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Image URL</label>
              <input
                placeholder="Paste URL or upload →"
                value={form.imageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                rows={2}
                placeholder="Short description (optional)"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <label style={uploadLabelStyle}>
              {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
            </label>
            <button type="submit" style={btnPrimaryStyle}>Create</button>
            <button type="button" onClick={resetForm} style={btnOutlineStyle}>Clear</button>
          </div>
        </form>
      </div>

      {message && <p style={{ color: "#166534", marginBottom: 10 }}>{message}</p>}
      {error && <p style={{ color: "#b91c1c", marginBottom: 10 }}>{error}</p>}

      {/* ── Products grouped by category group ── */}
      {productsByGroup.map((group) => {
        if (group.products.length === 0) return null;
        return (
          <div key={group.key} style={{ marginBottom: 20 }}>
            <div style={groupHeaderStyle}>{group.name}</div>
            <div style={groupBodyStyle}>
              <ProductTable
                products={group.products}
                catTitleMap={catTitleMap}
                onDelete={onDelete}
              />
            </div>
          </div>
        );
      })}

      {uncategorisedProducts.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...groupHeaderStyle, background: "#475569" }}>Other / Custom</div>
          <div style={groupBodyStyle}>
            <ProductTable
              products={uncategorisedProducts}
              catTitleMap={catTitleMap}
              onDelete={onDelete}
            />
          </div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <p style={{ color: "#94a3b8", marginTop: 8 }}>No products yet. Use the form above to create one.</p>
      )}
      {loading && <p style={{ color: "#64748b", marginTop: 8 }}>Loading…</p>}
    </section>
  );
}

function ProductTable({ products, catTitleMap, onDelete }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f8fafc", textAlign: "left" }}>
          <th style={thStyle}>Title</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Price</th>
          <th style={thStyle}>Slug</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td style={tdStyle}>{p.title || "—"}</td>
            <td style={tdStyle}>{catTitleMap.get(p.categorySlug) || p.categorySlug || "—"}</td>
            <td style={tdStyle}>{p.price != null ? p.price : "—"}</td>
            <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13 }}>{p.slug}</td>
            <td style={tdStyle}>
              <button
                type="button"
                onClick={() => onDelete(p.id, p.slug)}
                style={btnDeleteStyle}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Shared styles ──────────────────────────────────────────────

const cardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
};

const fieldStyle = { display: "flex", flexDirection: "column", gap: 4 };

const labelStyle = { fontSize: 12, fontWeight: 600, color: "#374151" };

const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box",
};

const uploadLabelStyle = {
  border: "1px dashed #94a3b8",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
  background: "#f8fafc",
  fontSize: 14,
};

const btnPrimaryStyle = {
  border: "none",
  background: "#0f172a",
  color: "#fff",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: 14,
};

const btnOutlineStyle = {
  border: "1px solid #cbd5e1",
  background: "#fff",
  borderRadius: 8,
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: 14,
};

const btnDeleteStyle = {
  border: "1px solid #fca5a5",
  background: "#fff",
  color: "#dc2626",
  borderRadius: 6,
  padding: "4px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const groupHeaderStyle = {
  background: "#0f172a",
  color: "#fff",
  borderRadius: "10px 10px 0 0",
  padding: "9px 14px",
  fontWeight: 600,
  fontSize: 14,
};

const groupBodyStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderTop: "none",
  borderRadius: "0 0 10px 10px",
  overflow: "hidden",
};

const thStyle = { padding: "10px 12px", borderBottom: "1px solid #e2e8f0", fontSize: 13 };
const tdStyle = { padding: "10px 12px", borderBottom: "1px solid #f1f5f9", fontSize: 14 };
