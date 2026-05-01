"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategoryGroups } from "@data/catalog-categories";
import {
  adminAlertErrorStyle,
  adminAlertSuccessStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminHeroMetaWrapStyle,
  adminHintStyle,
  adminImageGridStyle,
  adminInputStyle,
  adminLabelStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminResponsiveGridStyle,
  adminSecondaryButtonStyle,
  adminSectionStyle,
  adminSectionTitleStyle,
} from "./admin-ui-tokens";

// ── helpers ──────────────────────────────────────────────────────────────────

function toSlug(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseTags(str) {
  return str
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseSpecifications(str) {
  const obj = {};
  str.split("\n").forEach((line) => {
    const colon = line.indexOf(":");
    if (colon < 1) return;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (key && val) obj[key] = val;
  });
  return obj;
}

const EMPTY_FORM = {
  title: "",
  slug: "",
  categorySlugs: [],
  sku: "",
  stockQuantity: "",
  description: "",
  images: ["", "", "", ""],
  videoUrl: "",
  brochureUrl: "",
  specifications: "",
  tags: "",
  longDescription: "",
};

function ensureImageSlots(images) {
  const source = Array.isArray(images) ? images : [];
  return [
    source[0] || "",
    source[1] || "",
    source[2] || "",
    source[3] || "",
  ];
}

// ── component ────────────────────────────────────────────────────────────────

/**
 * Shared create/edit form.
 *
 * Props:
 *  - mode: "create" | "edit"
 *  - productId?: string   (only for edit mode)
 */
export default function AdminProductForm({ mode = "create", productId }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(EMPTY_FORM);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ── Load categories ──
  useEffect(() => {
    fetch("/api/categories?lang=RU&limit=200")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success) setDbCategories(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {});
  }, []);

  // ── Load product for edit ──
  useEffect(() => {
    if (!isEdit || !productId) return;
    setLoading(true);
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json?.success || !json.data) {
          setError("Product not found");
          return;
        }
        const p = json.data;
        let extras = {};
        try { if (p.content) extras = JSON.parse(p.content); } catch {}
        const rawImages = Array.isArray(extras.images) ? extras.images : [];
        const slot0 = rawImages[0] || p.imageUrl || "";
        const slots = ensureImageSlots([slot0, rawImages[1], rawImages[2], rawImages[3]]);
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          categorySlugs: Array.isArray(extras.categorySlugs) && extras.categorySlugs.length > 0
            ? extras.categorySlugs
            : [p.categorySlug].filter(Boolean),
          sku: extras.sku || "",
          stockQuantity: extras.quantity == null ? "" : extras.quantity > 0 ? "available" : "order",
          description: p.description || "",
          images: slots,
          videoUrl: extras.videoUrl || "",
          brochureUrl: extras.brochureUrl || "",
          specifications: extras.specifications && typeof extras.specifications === "object"
            ? Object.entries(extras.specifications).map(([k, v]) => `${k}: ${v}`).join("\n")
            : "",
          tags: Array.isArray(extras.tags) ? extras.tags.join(", ") : "",
          longDescription: extras.longDescription || "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isEdit, productId]);

  // ── Title → slug auto ──
  const onTitleChange = useCallback((e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isEdit ? prev.slug : toSlug(val),
    }));
  }, [isEdit]);

  // ── Image slot ──
  const onUpload = async (e, slotIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlot(slotIndex);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Upload failed");
      setForm((prev) => {
        const imgs = ensureImageSlots(prev.images);
        imgs[slotIndex] = json?.data?.publicUrl || json?.publicUrl || "";
        return { ...prev, images: imgs };
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingSlot(null);
      e.target.value = "";
    }
  };

  // ── Submit ──
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const images = ensureImageSlots(form.images).filter(Boolean);
      if (form.categorySlugs.length === 0) {
        setError("Kamida bitta kategoriya tanlang");
        setSaving(false);
        return;
      }
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        categorySlug: form.categorySlugs[0] || "",
        categorySlugs: form.categorySlugs,
        sku: form.sku.trim(),
        stockQuantity: form.stockQuantity === "available" ? 1 : form.stockQuantity === "order" ? 0 : null,
        description: form.description.trim(),
        images,
        imageUrl: images[0] || "",
        videoUrl: form.videoUrl.trim(),
        brochureUrl: form.brochureUrl.trim(),
        specifications: parseSpecifications(form.specifications),
        tags: parseTags(form.tags),
        longDescription: form.longDescription,
      };

      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Save failed");
      setMessage(isEdit ? "Changes saved!" : "Product created!");
      setTimeout(() => router.push("/admin/products"), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Category grouping ──
  const dbCatSlugs = new Set(dbCategories.map((c) => c.slug));
  const groupedCats = getCategoryGroups().map((group) => {
    const cats = group.categories.flatMap((topCat) => {
      if (topCat.children.length === 0) {
        if (!dbCatSlugs.has(topCat.slug)) return [];
        const dbCat = dbCategories.find((c) => c.slug === topCat.slug);
        return [{ slug: topCat.slug, title: dbCat?.title || topCat.name }];
      }
      return topCat.children
        .filter((child) => dbCatSlugs.has(child.slug))
        .map((child) => {
          const dbChild = dbCategories.find((c) => c.slug === child.slug);
          return { slug: child.slug, title: dbChild?.title || child.name };
        });
    });
    return { ...group, cats };
  }).filter((g) => g.cats.length > 0);
  const imageSlots = ensureImageSlots(form.images);
  const selectedImagesCount = imageSlots.filter(Boolean).length;

  if (loading) {
    return <p style={loadingStyle}>Loading…</p>;
  }

  return (
    <div style={pageShellStyle}>
      <div style={ambientGlowTopStyle} />
      <div style={ambientGlowSideStyle} />

      <div style={heroStyle}>
          <div style={{ minWidth: 0 }}>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              style={btnBackStyle}
            >
              ← Back To Products
            </button>
            <h1 style={pageTitleStyle}>
              {isEdit ? `Edit Product — ${form.slug || productId}` : "Create New Product"}
            </h1>
            <p style={heroSubtitleStyle}>
              {isEdit
                ? "Update product details, images, categories, and description."
                : "Fill in product details, images, categories, and description."}
            </p>
          </div>
          <div style={heroStatsStyle}>
            <div style={metaItemStyle}>
              <span style={metaLabelStyle}>Mode</span>
              <strong style={metaValueStyle}>{isEdit ? "Editing" : "Creating"}</strong>
            </div>
            <div style={metaItemStyle}>
              <span style={metaLabelStyle}>Categories</span>
              <strong style={metaValueStyle}>{dbCategories.length}</strong>
            </div>
            <div style={metaItemStyle}>
              <span style={metaLabelStyle}>Images</span>
              <strong style={metaValueStyle}>{selectedImagesCount}/4</strong>
            </div>
          </div>
        </div>

      {message && (
        <div style={alertSuccessStyle}>{message}</div>
      )}
      {error && (
        <div style={alertErrorStyle}>{error}</div>
      )}

      <form onSubmit={onSubmit} style={formLayoutStyle}>
        {/* ── Section: Basic Info ── */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Основная информация</div>

          {/* Row 1: Title | SKU | Наличие */}
          <div style={threeColGridStyle}>
            <div style={{ ...fieldStyle, gridColumn: "1 / 2" }}>
              <label style={labelStyle}>Название *</label>
              <input
                required
                placeholder="Название продукта"
                value={form.title}
                onChange={onTitleChange}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>SKU</label>
              <input
                placeholder="Артикул (ABC-123)"
                value={form.sku}
                onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
                style={{ ...inputStyle, fontFamily: "monospace" }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Наличие</label>
              <select
                value={form.stockQuantity}
                onChange={(e) => setForm((prev) => ({ ...prev, stockQuantity: e.target.value }))}
                style={inputStyle}
              >
                <option value="">— не указано —</option>
                <option value="available">В наличии</option>
                <option value="order">Под заказ</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category pills */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Категории *
              {form.categorySlugs.length > 0 && (
                <span style={catSelectedBadgeStyle}>{form.categorySlugs.length} tanlangan</span>
              )}
            </label>
            <div style={catPillsPanelStyle}>
              {groupedCats.map((group) => (
                <div key={group.key} style={catPillGroupStyle}>
                  <span style={catPillGroupLabelStyle}>{group.name}</span>
                  <div style={catPillsRowStyle}>
                    {group.cats.map((cat) => {
                      const checked = form.categorySlugs.includes(cat.slug);
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              categorySlugs: checked
                                ? prev.categorySlugs.filter((s) => s !== cat.slug)
                                : [...prev.categorySlugs, cat.slug],
                            }))
                          }
                          style={catPillStyle(checked)}
                        >
                          {checked && <span style={{ marginRight: 4, fontSize: 10 }}>✓</span>}
                          {cat.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {form.categorySlugs.length === 0 && (
              <span style={{ color: "#ef4444", fontSize: 11 }}>Kamida bitta kategoriya tanlang</span>
            )}
          </div>

        </div>

        {/* ── Section: Images ── */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Images (up to 4)</div>
          <div style={imageGridStyle}>
            {imageSlots.map((url, i) => (
              <div key={i} style={imageSlotStyle}>
                {/* Thumbnail */}
                <div style={thumbContainerStyle}>
                  {url ? (
                    <img
                      src={url}
                      alt={`slot ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <span style={{ color: "#C0C0C8", fontSize: 12 }}>
                      {i === 0 ? "Main" : `Photo ${i + 1}`}
                    </span>
                  )}
                </div>
                {/* URL input */}
                <input
                  placeholder="Paste URL…"
                  value={url}
                  onChange={(e) => {
                    const imgs = ensureImageSlots(form.images);
                    imgs[i] = e.target.value;
                    setForm((prev) => ({ ...prev, images: imgs }));
                  }}
                  style={{ ...inputStyle, fontSize: 11, fontFamily: "monospace", padding: "5px 8px" }}
                />
                {/* Upload + remove */}
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <label style={{ ...btnUploadStyle, flex: 1, textAlign: "center", cursor: "pointer" }}>
                    {uploadingSlot === i ? "…" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => onUpload(e, i)}
                      disabled={uploadingSlot !== null}
                    />
                  </label>
                  {url && (
                    <button
                      type="button"
                      onClick={() => {
                        const imgs = ensureImageSlots(form.images);
                        imgs[i] = "";
                        setForm((prev) => ({ ...prev, images: imgs }));
                      }}
                      style={btnRemoveImgStyle}
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: Описания ── */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Описание</div>
          <div style={descRowStyle}>
            <div style={{ ...fieldStyle, flex: "0 0 300px" }}>
              <label style={labelStyle}>Краткое описание</label>
              <textarea
                rows={7}
                placeholder="Краткое описание продукта…"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical", height: "100%", minHeight: 120 }}
              />
            </div>
            <div style={{ ...fieldStyle, flex: 1, minWidth: 0 }}>
              <label style={labelStyle}>Полное описание</label>
              <textarea
                rows={10}
                placeholder="Полное описание продукта…"
                value={form.longDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, longDescription: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical", width: "100%", minHeight: 160 }}
              />
            </div>
          </div>
        </div>

        {/* ── Section: Дополнительно ── */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Дополнительно</div>
          <div style={responsiveGridStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Теги <span style={hintStyle}>(через запятую)</span></label>
              <input
                type="text"
                placeholder="rfid, библиотека, считыватель"
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Характеристики <span style={hintStyle}>(Ключ: Значение, по одному на строку)</span></label>
              <textarea
                rows={3}
                placeholder={"Вес: 1.2 кг\nЦвет: Чёрный"}
                value={form.specifications}
                onChange={(e) => setForm((prev) => ({ ...prev, specifications: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Видео URL</label>
              <input
                placeholder="https://youtube.com/…"
                value={form.videoUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                style={inputStyle}
              />
              <label style={{ ...labelStyle, marginTop: 10 }}>Брошюра URL</label>
              <input
                placeholder="https://… или /uploads/…"
                value={form.brochureUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, brochureUrl: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={footerBarStyle}>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            style={btnCancelStyle}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{ ...btnSaveStyle, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const pageShellStyle = {
  ...adminPageShellStyle,
  padding: "14px 4px 6px",
};

const ambientGlowTopStyle = {
  ...adminAmbientGlowTopStyle,
  top: -50,
  width: 240,
  height: 240,
  background: "radial-gradient(circle, rgba(226,102,102,0.18) 0%, rgba(226,102,102,0) 75%)",
};

const ambientGlowSideStyle = {
  ...adminAmbientGlowSideStyle,
  left: "-3%",
  top: 180,
  width: 190,
  height: 190,
  background: "radial-gradient(circle, rgba(3,4,28,0.1) 0%, rgba(3,4,28,0) 72%)",
};

const heroStyle = {
  ...adminHeroStyle,
  marginBottom: 18,
};

const pageTitleStyle = {
  ...adminPageTitleStyle,
  margin: "12px 0 8px",
};

const heroStatsStyle = adminHeroMetaWrapStyle;

const heroSubtitleStyle = adminHeroSubtitleStyle;

const metaItemStyle = adminMetaPillStyle;

const metaLabelStyle = adminMetaLabelStyle;

const metaValueStyle = adminMetaValueStyle;

const loadingStyle = {
  color: "#525258",
  fontSize: 14,
  marginTop: 20,
  background: "#fff",
  border: "1px solid #EAEAF0",
  borderRadius: 10,
  padding: "12px 14px",
};

const formLayoutStyle = {
  display: "grid",
  gap: 14,
};

const responsiveGridStyle = adminResponsiveGridStyle;

const threeColGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 180px 180px",
  gap: 12,
  alignItems: "start",
};

const imageGridStyle = adminImageGridStyle;

const sectionStyle = adminSectionStyle;

const sectionTitleStyle = adminSectionTitleStyle;

const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };

const labelStyle = adminLabelStyle;

const hintStyle = adminHintStyle;

const inputStyle = adminInputStyle;

const imageSlotStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const thumbContainerStyle = {
  height: 90,
  background: "linear-gradient(145deg, #F3F5FA 0%, #ECEFF7 100%)",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  border: "1px dashed #CDD5E6",
};

const btnUploadStyle = {
  fontSize: 12,
  fontWeight: 700,
  padding: "5px 0",
  background: "#EEF2FF",
  color: "#2B3A8B",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#CCD5FF",
  borderRadius: 6,
};

const btnRemoveImgStyle = {
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1,
  padding: "4px 8px",
  background: "#FFF5F5",
  color: "#DC2626",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#FECACA",
  borderRadius: 6,
  cursor: "pointer",
};

const alertSuccessStyle = adminAlertSuccessStyle;

const alertErrorStyle = adminAlertErrorStyle;

const btnBackStyle = {
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

const btnCancelStyle = {
  ...adminSecondaryButtonStyle,
};

const btnSaveStyle = {
  background: "linear-gradient(140deg, #03041C 0%, #2A2E61 100%)",
  border: "none",
  borderRadius: 10,
  padding: "11px 24px",
  fontSize: 14,
  fontWeight: 700,
  color: "#fff",
  cursor: "pointer",
  fontFamily: "'Space Grotesk', sans-serif",
  boxShadow: "0 10px 20px rgba(10, 14, 50, 0.26)",
};

const footerBarStyle = {
  display: "flex",
  gap: 10,
  justifyContent: "flex-end",
  marginTop: 4,
  flexWrap: "wrap",
};

const catPillsPanelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: "10px 14px",
  background: "#F8F9FD",
  borderRadius: 10,
  border: "1px solid #E0E4F0",
};

const catPillGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const catPillGroupLabelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B7280",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
  minWidth: 160,
  flexShrink: 0,
};

const catPillsRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

const catPillStyle = (checked) => ({
  fontSize: 12,
  fontWeight: checked ? 700 : 400,
  padding: "4px 12px",
  borderRadius: 999,
  border: checked ? "1.5px solid #2B3A8B" : "1.5px solid #D0D5E8",
  background: checked ? "#EEF0FF" : "#fff",
  color: checked ? "#1a2460" : "#4B5563",
  cursor: "pointer",
  transition: "all 0.12s",
  display: "flex",
  alignItems: "center",
  gap: 4,
});

const catSelectedBadgeStyle = {
  marginLeft: 8,
  background: "#2B3A8B",
  color: "#fff",
  borderRadius: 999,
  padding: "1px 8px",
  fontSize: 10,
  fontWeight: 700,
};

const descRowStyle = {
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
};
