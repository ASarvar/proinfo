"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminAlertErrorStyle,
  adminAlertSuccessStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminHeroMetaWrapStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminInputStyle,
  adminLabelStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
  adminSecondaryButtonStyle,
  adminSectionStyle,
  adminSectionTitleStyle,
} from "./admin-ui-tokens";

const getEmptyForm = () => ({
  title: "",
  parentSlug: "",
  imageUrl: "",
});

export default function AdminCategoryForm() {
  const router = useRouter();
  const [form, setForm] = useState(getEmptyForm);
  const [allCategories, setAllCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories?lang=RU&limit=200");
      const json = await res.json();
      if (json?.success) setAllCategories(json.data || []);
    } catch {}
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  // Only top-level categories can be parents
  const topLevelCategories = allCategories.filter((c) => !c.parentSlug);

  const resetForm = () => {
    setForm(getEmptyForm());
    setMessage("");
    setError("");
  };

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await response.json();
      if (!response.ok || !json?.success) throw new Error(json?.error || "Upload failed");
      setForm((prev) => ({ ...prev, imageUrl: json.data?.publicUrl || "" }));
      setMessage(`Uploaded: ${json.data?.name}`);
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const title = form.title.trim();
    if (!title) {
      setSaving(false);
      setError("Title is required.");
      return;
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          imageUrl: form.imageUrl || null,
          parentSlug: form.parentSlug || null,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) throw new Error(json?.error || "Create failed");
      setMessage(`Created: ${json.data?.slug}`);
      setTimeout(() => router.push("/admin/categories"), 800);
    } catch (submitError) {
      setError(submitError.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const isSubcategory = !!form.parentSlug;

  return (
    <section style={pageShellStyle}>
      <div style={ambientGlowTopStyle} />
      <div style={ambientGlowSideStyle} />

      <div style={heroStyle}>
        <div style={{ minWidth: 0 }}>
          <button type="button" onClick={() => router.push("/admin/categories")} style={backButtonStyle}>
            ← Back To Categories
          </button>
          <h1 style={pageTitleStyle}>Create New Category</h1>
          <p style={heroSubtitleStyle}>
            Add a top-level category or a subcategory under an existing one.
          </p>
        </div>
        <div style={heroMetaStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Mode</span>
            <strong style={metaValueStyle}>Creating</strong>
          </div>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Level</span>
            <strong style={metaValueStyle}>{isSubcategory ? "Subcategory" : "Top-level"}</strong>
          </div>
        </div>
      </div>

      {message && <div style={alertSuccessStyle}>{message}</div>}
      {error && <div style={alertErrorStyle}>{error}</div>}

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Category Details</div>
        <form onSubmit={onSubmit}>
          <div style={formGridStyle}>
            {/* Left column: Category select + name input stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Category</label>
                <select value={form.parentSlug} onChange={(e) => setForm((prev) => ({ ...prev, parentSlug: e.target.value, title: "" }))} style={inputStyle}>
                  <option value="">— top-level category —</option>
                  {topLevelCategories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.title || cat.slug}</option>
                  ))}
                </select>
              </div>

              {!isSubcategory && (
                <div style={fieldStyle}>
                  <label style={labelStyle}>Category name</label>
                  <input
                    required
                    placeholder="Enter category name"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              )}

              {isSubcategory && (
                <div style={fieldStyle}>
                  <label style={labelStyle}>Subcategory</label>
                  <input
                    required
                    placeholder="Enter subcategory name"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              )}
            </div>

            {/* Right column: Upload image area (full height) */}
            <label style={uploadAreaStyle}>
              <div style={{ pointerEvents: "none" }}>
                {uploading ? "Uploading…" : form.imageUrl ? "Image uploaded ✓" : "Upload image"}
                {form.imageUrl && (
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, wordBreak: "break-all", maxWidth: 220 }}>
                    {form.imageUrl.split("/").pop()}
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
            </label>
          </div>

          <div style={actionRowStyle}>
            <button type="submit" disabled={saving} style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Creating…" : "Create"}
            </button>
            <button type="button" onClick={resetForm} style={secondaryButtonStyle}>Clear</button>
          </div>
        </form>
      </div>
    </section>
  );
}

const pageShellStyle = adminPageShellStyle;
const ambientGlowTopStyle = adminAmbientGlowTopStyle;
const ambientGlowSideStyle = adminAmbientGlowSideStyle;
const heroStyle = {
  ...adminHeroStyle,
  marginBottom: 18,
};
const pageTitleStyle = {
  ...adminPageTitleStyle,
  margin: "12px 0 8px",
};
const heroSubtitleStyle = adminHeroSubtitleStyle;
const heroMetaStyle = adminHeroMetaWrapStyle;
const metaPillStyle = adminMetaPillStyle;
const metaLabelStyle = adminMetaLabelStyle;
const metaValueStyle = adminMetaValueStyle;
const alertSuccessStyle = adminAlertSuccessStyle;
const alertErrorStyle = adminAlertErrorStyle;
const sectionStyle = adminSectionStyle;
const sectionTitleStyle = adminSectionTitleStyle;
const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  alignItems: "stretch",
};
const fieldStyle = { display: "flex", flexDirection: "column", gap: 4 };
const labelStyle = adminLabelStyle;
const inputStyle = adminInputStyle;
const uploadAreaStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
  border: "2px dashed #CCD5E6",
  borderRadius: 10,
  background: "#F4F7FF",
  color: "#4E556B",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  padding: 16,
  minHeight: 110,
};
const primaryButtonStyle = adminPrimaryCtaStyle;
const secondaryButtonStyle = adminSecondaryButtonStyle;
const actionRowStyle = {
  marginTop: 12,
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};
const backButtonStyle = {
  background: "rgba(255,255,255,0.09)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.24)",
  borderRadius: 999,
  padding: "8px 15px",
  fontSize: 13,
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 700,
  letterSpacing: "0.02em",
};