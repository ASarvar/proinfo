"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { catalogCategories, categoryGroups } from "@data/catalog-categories";
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
  adminResponsiveGridStyle,
  adminSecondaryButtonStyle,
  adminSectionStyle,
  adminSectionTitleStyle,
  adminUploadLabelStyle,
} from "./admin-ui-tokens";

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getEmptyForm = () => ({
  title: "",
  slug: "",
  groupKey: categoryGroups[0]?.key ?? "",
  parentSlug: "",
  imageUrl: "",
});

export default function AdminCategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState(getEmptyForm);
  const [slugManual, setSlugManual] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const initialPrefill = useMemo(() => {
    const nextForm = getEmptyForm();
    const title = searchParams.get("title") || "";
    const slug = searchParams.get("slug") || "";
    const groupKey = searchParams.get("groupKey") || nextForm.groupKey;
    const parentSlug = searchParams.get("parentSlug") || "";
    const imageUrl = searchParams.get("imageUrl") || "";

    return {
      form: {
        title,
        slug,
        groupKey,
        parentSlug,
        imageUrl,
      },
      slugManual: slug.length > 0,
    };
  }, [searchParams]);

  useEffect(() => {
    setForm(initialPrefill.form);
    setSlugManual(initialPrefill.slugManual);
  }, [initialPrefill]);

  const onTitleChange = (event) => {
    const title = event.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  };

  const onSlugChange = (event) => {
    const slug = event.target.value;
    setSlugManual(slug.length > 0);
    setForm((prev) => ({ ...prev, slug }));
  };

  const onGroupChange = (event) => {
    setForm((prev) => ({ ...prev, groupKey: event.target.value, parentSlug: "" }));
  };

  const resetForm = () => {
    const nextForm = getEmptyForm();
    setForm(nextForm);
    setSlugManual(false);
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

    const finalSlug = form.slug || slugify(form.title);
    if (!finalSlug) {
      setSaving(false);
      setError("Slug is required. For non-Latin titles, enter a slug manually.");
      return;
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: finalSlug,
          imageUrl: form.imageUrl || null,
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

  const parentOptions = catalogCategories.filter((category) => category.groupKey === form.groupKey && !category.parentSlug);

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
            Add a new category in a dedicated flow, with optional pre-filled values from the catalog structure.
          </p>
        </div>
        <div style={heroMetaStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Mode</span>
            <strong style={metaValueStyle}>Creating</strong>
          </div>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Group</span>
            <strong style={metaValueStyle}>{form.groupKey || "—"}</strong>
          </div>
        </div>
      </div>

      {message && <div style={alertSuccessStyle}>{message}</div>}
      {error && <div style={alertErrorStyle}>{error}</div>}

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Category Details</div>
        <form onSubmit={onSubmit}>
          <div style={formGridStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Title</label>
              <input required placeholder="Category title" value={form.title} onChange={onTitleChange} style={inputStyle} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Slug <span style={inlineHintStyle}>{slugManual ? "(manual)" : "(auto)"}</span>
              </label>
              <input placeholder="auto-from-title" value={form.slug} onChange={onSlugChange} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Group</label>
              <select value={form.groupKey} onChange={onGroupChange} style={inputStyle}>
                {categoryGroups.map((group) => (
                  <option key={group.key} value={group.key}>{group.name}</option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Parent category <span style={inlineHintStyle}>(optional)</span>
              </label>
              <select value={form.parentSlug} onChange={(event) => setForm((prev) => ({ ...prev, parentSlug: event.target.value }))} style={inputStyle}>
                <option value="">— top level —</option>
                {parentOptions.map((category) => (
                  <option key={category.slug} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Image URL</label>
              <input placeholder="Paste URL or upload →" value={form.imageUrl} onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))} style={inputStyle} />
            </div>
          </div>

          <div style={actionRowStyle}>
            <label style={uploadLabelStyle}>
              {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
            </label>
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
  ...adminResponsiveGridStyle,
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
};
const fieldStyle = { display: "flex", flexDirection: "column", gap: 4 };
const labelStyle = adminLabelStyle;
const inputStyle = adminInputStyle;
const uploadLabelStyle = adminUploadLabelStyle;
const primaryButtonStyle = adminPrimaryCtaStyle;
const secondaryButtonStyle = adminSecondaryButtonStyle;
const actionRowStyle = {
  marginTop: 12,
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};
const inlineHintStyle = { color: "#94a3b8", fontWeight: 400, fontSize: 11 };
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