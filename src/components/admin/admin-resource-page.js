"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminAlertErrorStyle,
  adminAlertSuccessStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminGroupBodyStyle,
  adminGroupHeaderStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminInputStyle,
  adminLoadingTextStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
  adminSectionStyle,
  adminSummaryTextStyle,
  adminTableContainerStyle,
  adminTableHeadRowStyle,
  adminTableStyle,
  adminTdStyle,
  adminThStyle,
  adminUploadLabelStyle,
  adminHeroMetaWrapStyle,
} from "./admin-ui-tokens";

export default function AdminResourcePage({
  title,
  resource,
  supportsPublishing = false,
  requiresCategory = false,
  requiresVideoUrl = false,
  requiresFileUrl = false,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    categorySlug: "",
    imageUrl: "",
    videoUrl: "",
    fileUrl: "",
    status: "draft",
  });

  const endpoint = useMemo(() => `/api/admin/${resource}`, [resource]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || `Failed to load ${resource}`);
      }
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [endpoint, resource]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        status: supportsPublishing ? form.status : "draft",
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Create failed");
      }

      setForm({
        title: "",
        slug: "",
        description: "",
        categorySlug: "",
        imageUrl: "",
        videoUrl: "",
        fileUrl: "",
        status: "draft",
      });
      setMessage("Created successfully");
      await load();
    } catch (e) {
      setError(e.message || "Create failed");
    }
  };

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Upload failed");
      }

      const url = json.data?.publicUrl || "";
      if (requiresFileUrl) {
        setForm((prev) => ({ ...prev, fileUrl: url }));
      } else {
        setForm((prev) => ({ ...prev, imageUrl: url }));
      }

      setMessage(`Uploaded: ${json.data?.name} (${json.data?.sizeBytes} bytes)`);
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const setPublishState = async (id, status) => {
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Status update failed");
      }
      await load();
    } catch (e) {
      setError(e.message || "Status update failed");
    }
  };

  return (
    <section style={pageShellStyle}>
      <div style={ambientGlowTopStyle} />
      <div style={ambientGlowSideStyle} />

      <div style={heroStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={pageTitleStyle}>{title}</h1>
          <p style={heroSubtitleStyle}>
            {supportsPublishing ? "Draft / publish workflow enabled." : "Content management."}
          </p>
        </div>
        <div style={heroStatsStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Items</span>
            <strong style={metaValueStyle}>{items.length}</strong>
          </div>
          {supportsPublishing ? (
            <div style={metaPillStyle}>
              <span style={metaLabelStyle}>Workflow</span>
              <strong style={metaValueStyle}>Draft/Live</strong>
            </div>
          ) : null}
        </div>
      </div>

      <p style={summaryTextStyle}>
        {supportsPublishing ? "Draft / publish workflow enabled." : "Content management."}
      </p>

      <form onSubmit={onCreate} style={formStyle}>
        <div style={formGridStyle}>
          <input placeholder="Title" required value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} style={inputStyle} />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} style={inputStyle} />
          {requiresCategory ? (
            <input placeholder="Category slug" required value={form.categorySlug} onChange={(e) => setForm((prev) => ({ ...prev, categorySlug: e.target.value }))} style={inputStyle} />
          ) : null}
          <input placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} style={inputStyle} />
          {!requiresFileUrl ? (
            <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} style={inputStyle} />
          ) : null}
          {requiresVideoUrl ? (
            <input placeholder="Video URL" required value={form.videoUrl} onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))} style={inputStyle} />
          ) : null}
          {requiresFileUrl ? (
            <input placeholder="File URL" required value={form.fileUrl} onChange={(e) => setForm((prev) => ({ ...prev, fileUrl: e.target.value }))} style={inputStyle} />
          ) : null}
          {supportsPublishing ? (
            <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} style={inputStyle}>
              <option value="draft">Draft</option>
              <option value="published">Publish</option>
            </select>
          ) : null}
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={uploadLabelStyle}>
            {uploading ? "Uploading..." : "Upload file"}
            <input type="file" onChange={onUpload} style={{ display: "none" }} />
          </label>
          <button type="submit" style={buttonStyle}>Create</button>
        </div>
      </form>

      {message && (
        <div style={alertSuccessStyle}>
          {message}
        </div>
      )}
      {error && (
        <div style={alertErrorStyle}>
          {error}
        </div>
      )}

      <div style={tableWrapStyle}>
        <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeadRowStyle}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Slug</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Updated</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={tdStyle} colSpan={5}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td style={tdStyle} colSpan={5}>No items yet</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.title || "-"}</td>
                  <td style={tdStyle}>{item.slug}</td>
                  <td style={tdStyle}>{item.status || "published"}</td>
                  <td style={tdStyle}>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}</td>
                  <td style={tdStyle}>
                    {supportsPublishing ? (
                      <div style={actionGroupStyle}>
                        <button type="button" onClick={() => setPublishState(item.id, "draft")} style={smallButtonStyle}>Draft</button>
                        <button type="button" onClick={() => setPublishState(item.id, "published")} style={smallButtonStyle}>Publish</button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}

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

const formStyle = {
  ...adminSectionStyle,
  marginBottom: 18,
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 10,
};

const inputStyle = adminInputStyle;

const uploadLabelStyle = adminUploadLabelStyle;

const buttonStyle = adminPrimaryCtaStyle;

const alertSuccessStyle = adminAlertSuccessStyle;

const alertErrorStyle = adminAlertErrorStyle;

const tableWrapStyle = {
  ...adminGroupBodyStyle,
  marginTop: 14,
  borderTop: "1px solid #E6E9F2",
  borderRadius: 14,
};

const tableContainerStyle = adminTableContainerStyle;

const tableStyle = adminTableStyle;

const tableHeadRowStyle = adminTableHeadRowStyle;

const thStyle = adminThStyle;

const tdStyle = adminTdStyle;

const smallButtonStyle = {
  border: "1px solid #CCD5E6",
  background: "#EEF2FF",
  color: "#1F3A8A",
  borderRadius: 8,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const actionGroupStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const metaPillStyle = adminMetaPillStyle;

const metaLabelStyle = adminMetaLabelStyle;

const metaValueStyle = adminMetaValueStyle;
