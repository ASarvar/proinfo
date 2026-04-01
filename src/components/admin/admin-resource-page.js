"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
    <section>
      <h1 style={{ marginBottom: 6 }}>{title}</h1>
      <p style={{ marginBottom: 16, color: "#64748b" }}>
        Upload pipeline with metadata and {supportsPublishing ? "draft/publish workflow" : "content management"}.
      </p>

      <form onSubmit={onCreate} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
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
          <label style={{ border: "1px dashed #94a3b8", borderRadius: 8, padding: "8px 10px", cursor: "pointer", background: "#f8fafc" }}>
            {uploading ? "Uploading..." : "Upload file"}
            <input type="file" onChange={onUpload} style={{ display: "none" }} />
          </label>
          <button type="submit" style={buttonStyle}>Create</button>
        </div>
      </form>

      {message ? <p style={{ color: "#166534" }}>{message}</p> : null}
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
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
                      <div style={{ display: "flex", gap: 8 }}>
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
    </section>
  );
}

const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 10px",
};

const buttonStyle = {
  border: "none",
  background: "#0f172a",
  color: "#fff",
  borderRadius: 8,
  padding: "8px 14px",
};

const smallButtonStyle = {
  border: "1px solid #cbd5e1",
  background: "#fff",
  borderRadius: 8,
  padding: "5px 8px",
};

const thStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #f1f5f9",
};
