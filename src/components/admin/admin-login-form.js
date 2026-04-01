"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Login failed");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "8vh auto", padding: 24, border: "1px solid #ddd", borderRadius: 12, background: "#fff" }}>
      <h1 style={{ marginBottom: 8 }}>Admin Login</h1>
      <p style={{ marginBottom: 18, color: "#666" }}>Roles: SuperAdmin and Editor</p>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: 6 }}>Username</label>
          <input
            id="username"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            required
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: 6 }}>Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </div>
        {error ? <p style={{ color: "#b42318", marginBottom: 12 }}>{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: "#111", color: "#fff" }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
