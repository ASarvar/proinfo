"use client";

import { useCallback, useEffect, useState } from "react";
import { catalogCategories, categoryGroups } from "@data/catalog-categories";

// Mirrors server-side normalizeSlug in src/lib/admin-content.ts
const slugify = (v = "") =>
  v.toString().trim().toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const EMPTY_FORM = {
  title: "",
  slug: "",
  groupKey: categoryGroups[0]?.key ?? "",
  parentSlug: "",
  imageUrl: "",
};

export default function AdminCategoriesPage() {
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [slugManual, setSlugManual] = useState(false);

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

  // Auto-generate slug from title unless user has manually typed a slug
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

  const onGroupChange = (e) => {
    setForm((prev) => ({ ...prev, groupKey: e.target.value, parentSlug: "" }));
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setSlugManual(false);
  };

  // Clicking "Pre-fill" fills the form from static catalog data
  const preFill = (cat, groupKey, parentSlug = "") => {
    setForm({ title: cat.name, slug: cat.slug, groupKey, parentSlug, imageUrl: "" });
    setSlugManual(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title.trim(), slug: finalSlug, imageUrl: form.imageUrl || null }),
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

  const dbBySlug = new Map(dbCategories.map((c) => [c.slug, c]));
  const parentOptions = catalogCategories.filter((c) => c.groupKey === form.groupKey && !c.parentSlug);
  const catalogSlugSet = new Set(catalogCategories.map((c) => c.slug));
  const extraDbCategories = dbCategories.filter((c) => !catalogSlugSet.has(c.slug));

  return (
    <section>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#03041C", letterSpacing: "-0.02em", margin: "0 0 4px" }}>Categories</h1>
      <p style={{ marginBottom: 20, color: "#A3A3AA", fontSize: 14, margin: "0 0 20px" }}>
        Hierarchy: Group → Category → Subcategory. Slug is auto-generated from title (Latin only).
      </p>

      {/* ── Create form ── */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>New Category</h3>
        <form onSubmit={onCreate}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>

            <div style={fieldStyle}>
              <label style={labelStyle}>Title</label>
              <input
                required
                placeholder="Category title"
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
              <label style={labelStyle}>Group</label>
              <select value={form.groupKey} onChange={onGroupChange} style={inputStyle}>
                {categoryGroups.map((g) => (
                  <option key={g.key} value={g.key}>{g.name}</option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Parent category&nbsp;
                <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11 }}>(optional)</span>
              </label>
              <select value={form.parentSlug} onChange={(e) => setForm((prev) => ({ ...prev, parentSlug: e.target.value }))} style={inputStyle}>
                <option value="">— top level —</option>
                {parentOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
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

      {message && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#166534" }}>{message}</div>}
      {error && <div style={{ background: "#FFF5F5", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#B91C1C" }}>{error}</div>}

      {/* ── Hierarchy by group ── */}
      {categoryGroups.map((group) => {
        const topInGroup = catalogCategories.filter((c) => c.groupKey === group.key && !c.parentSlug);

        return (
          <div key={group.key} style={{ marginBottom: 20 }}>
            <div style={groupHeaderStyle}>{group.name}</div>
            <div style={groupBodyStyle}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left" }}>
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
        );
      })}

      {/* ── DB-only (custom) categories ── */}
      {extraDbCategories.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...groupHeaderStyle, background: "#475569" }}>Custom / Uncategorised</div>
          <div style={groupBodyStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left" }}>
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
      )}

      {loading && <p style={{ color: "#A3A3AA", marginTop: 8, fontSize: 14 }}>Loading categories from database…</p>}
    </section>
  );
}

// ── Shared styles ──────────────────────────────────────────────

const cardStyle = {
  background: "#fff",
  border: "1px solid #EAEAF0",
  borderRadius: 12,
  padding: 20,
  marginBottom: 22,
};

const fieldStyle = { display: "flex", flexDirection: "column", gap: 4 };

const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#525258",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const inputStyle = {
  background: "#EFF0F2",
  border: "2px solid #EFF0F2",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  color: "#03041C",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
};

const uploadLabelStyle = {
  border: "1.5px dashed #D5D5DF",
  borderRadius: 8,
  padding: "8px 14px",
  cursor: "pointer",
  background: "#F5F6F8",
  fontSize: 13,
  color: "#525258",
  fontWeight: 500,
};

const btnPrimaryStyle = {
  border: "none",
  background: "#03041C",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 18px",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "'Space Grotesk', sans-serif",
  letterSpacing: "-0.01em",
};

const btnOutlineStyle = {
  border: "1px solid #EAEAF0",
  background: "#F5F6F8",
  color: "#525258",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};

const btnDeleteStyle = {
  border: "1px solid #FECACA",
  background: "#FFF5F5",
  color: "#DC2626",
  borderRadius: 6,
  padding: "5px 11px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

const btnSeedStyle = {
  border: "1px solid #BFDBFE",
  background: "#EFF6FF",
  color: "#1D4ED8",
  borderRadius: 6,
  padding: "5px 11px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

const groupHeaderStyle = {
  background: "#03041C",
  color: "#fff",
  borderRadius: "10px 10px 0 0",
  padding: "10px 16px",
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: "-0.01em",
};

const groupBodyStyle = {
  background: "#fff",
  border: "1px solid #EAEAF0",
  borderTop: "none",
  borderRadius: "0 0 10px 10px",
  overflow: "hidden",
};

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

const thStyle = {
  padding: "10px 14px",
  borderBottom: "1px solid #EAEAF0",
  fontSize: 11,
  fontWeight: 700,
  color: "#A3A3AA",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};
const tdStyle = { padding: "10px 14px", borderBottom: "1px solid #F5F6F8", fontSize: 14 };
