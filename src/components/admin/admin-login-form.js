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
    <div style={{
      minHeight: "100vh",
      background: "#03041C",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>
            ProInfo
          </div>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#E26666",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginTop: 8,
          }}>
            Admin Panel
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 28px",
          boxShadow: "0 24px 60px rgba(3,4,28,0.5)",
        }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#03041C",
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
          }}>
            Sign in
          </h2>
          <p style={{ fontSize: 14, color: "#A3A3AA", margin: "0 0 24px" }}>
            Enter your credentials to continue.
          </p>

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="username" style={labelStyle}>Username</label>
              <input
                id="username"
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                required
                placeholder="Enter username"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Enter password"
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{
                background: "#FFF5F5",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 18,
                fontSize: 13,
                color: "#B91C1C",
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px 16px",
                border: "none",
                background: loading ? "#525258" : "#03041C",
                color: "#fff",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.01em",
                transition: "background 0.2s ease",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  background: "#EFF0F2",
  border: "2px solid #EFF0F2",
  borderRadius: 8,
  padding: "11px 14px",
  fontSize: 14,
  color: "#03041C",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  transition: "border-color 0.2s ease",
};
