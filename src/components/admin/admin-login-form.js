"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminAlertErrorStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminHeroSubtitleStyle,
  adminInputStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
  adminSectionStyle,
} from "./admin-ui-tokens";

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
    <div style={pageStyle}>
      <div style={glowTopStyle} />
      <div style={glowSideStyle} />
      <div style={contentStyle}>

        {/* Brand mark */}
        <div style={brandWrapStyle}>
          <div style={brandTitleStyle}>ProInfo</div>
          <div style={brandBadgeStyle}>Admin Panel</div>
          <p style={introStyle}>Secure sign-in for managing products, categories, and content.</p>
        </div>

        {/* Card */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Sign in</h2>
          <p style={cardSubtitleStyle}>Enter your credentials to continue.</p>

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
              <div style={{ ...adminAlertErrorStyle, marginBottom: 18, lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...submitStyle, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
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
  fontSize: 11,
  fontWeight: 700,
  color: "#5A6078",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 6,
};

const inputStyle = adminInputStyle;

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(160deg, #03041C 0%, #121633 62%, #1D2559 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Inter', sans-serif",
  padding: 20,
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
};

const glowTopStyle = {
  ...adminAmbientGlowTopStyle,
  width: 320,
  height: 320,
  top: -80,
  right: "8%",
};

const glowSideStyle = {
  ...adminAmbientGlowSideStyle,
  width: 280,
  height: 280,
  left: "8%",
  top: "auto",
  bottom: -80,
};

const contentStyle = {
  width: "100%",
  maxWidth: 460,
  position: "relative",
  zIndex: 1,
};

const brandWrapStyle = {
  textAlign: "center",
  marginBottom: 26,
};

const brandTitleStyle = {
  ...adminPageTitleStyle,
  fontSize: 38,
  margin: 0,
};

const brandBadgeStyle = {
  display: "inline-flex",
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(226,102,102,0.14)",
  color: "#FFB4B4",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginTop: 10,
};

const introStyle = {
  ...adminHeroSubtitleStyle,
  marginTop: 14,
  textAlign: "center",
};

const cardStyle = {
  ...adminSectionStyle,
  borderRadius: 18,
  padding: "30px 28px",
  boxShadow: "0 24px 60px rgba(3,4,28,0.38)",
};

const cardTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 24,
  fontWeight: 700,
  color: "#03041C",
  margin: "0 0 6px",
  letterSpacing: "-0.02em",
};

const cardSubtitleStyle = {
  fontSize: 14,
  color: "#667085",
  margin: "0 0 24px",
};

const submitStyle = {
  ...adminPrimaryCtaStyle,
  width: "100%",
  padding: "13px 16px",
  fontSize: 15,
};
