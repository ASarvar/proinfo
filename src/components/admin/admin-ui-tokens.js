export const adminPageShellStyle = {
  position: "relative",
  isolation: "isolate",
  padding: "12px 4px 6px",
};

export const adminAmbientGlowTopStyle = {
  position: "absolute",
  top: -55,
  right: "6%",
  width: 250,
  height: 250,
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(226,102,102,0.2) 0%, rgba(226,102,102,0) 74%)",
  pointerEvents: "none",
  zIndex: -1,
};

export const adminAmbientGlowSideStyle = {
  position: "absolute",
  left: "-2%",
  top: 200,
  width: 200,
  height: 200,
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(3,4,28,0.11) 0%, rgba(3,4,28,0) 72%)",
  pointerEvents: "none",
  zIndex: -1,
};

export const adminHeroStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gap: 16,
  background: "linear-gradient(140deg, #03041C 0%, #171A40 58%, #212761 100%)",
  borderRadius: 18,
  padding: "18px 20px",
  boxShadow: "0 12px 34px rgba(3, 4, 28, 0.26)",
};

export const adminPageTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 28,
  fontWeight: 700,
  color: "#F7F8FC",
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
};

export const adminHeroSubtitleStyle = {
  color: "rgba(247,248,252,0.82)",
  fontSize: 14,
  lineHeight: 1.55,
  margin: 0,
};

export const adminMetaPillStyle = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: "8px 11px",
  minWidth: 84,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const adminMetaLabelStyle = {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "rgba(247,248,252,0.62)",
  fontWeight: 700,
};

export const adminMetaValueStyle = {
  color: "#fff",
  fontSize: 14,
  fontWeight: 700,
};

export const adminHeroMetaWrapStyle = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

export const adminSummaryTextStyle = {
  color: "#667085",
  fontSize: 14,
  margin: "14px 0 18px",
};

export const adminAlertSuccessStyle = {
  background: "#F0FDF4",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#BBF7D0",
  borderRadius: 10,
  padding: "11px 14px",
  marginBottom: 14,
  fontSize: 13,
  color: "#166534",
  boxShadow: "0 4px 14px rgba(22, 101, 52, 0.08)",
};

export const adminAlertErrorStyle = {
  background: "#FFF5F5",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#FECACA",
  borderRadius: 10,
  padding: "11px 14px",
  marginBottom: 14,
  fontSize: 13,
  color: "#B91C1C",
  boxShadow: "0 4px 14px rgba(185, 28, 28, 0.08)",
};

export const adminSectionStyle = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFF 100%)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#E6E9F2",
  borderRadius: 14,
  padding: "18px 20px",
  boxShadow: "0 6px 18px rgba(3, 4, 28, 0.05)",
};

export const adminSectionTitleStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#5A6078",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 16,
};

export const adminResponsiveGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  marginBottom: 12,
};

export const adminImageGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
};

export const adminLabelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#5A6078",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

export const adminHintStyle = {
  fontWeight: 400,
  textTransform: "none",
  fontSize: 11,
  color: "#8590AA",
  letterSpacing: 0,
};

export const adminInputStyle = {
  background: "#F8F9FC",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#DCE0EA",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  color: "#03041C",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 160ms ease, background 160ms ease",
};

export const adminUploadLabelStyle = {
  border: "1px dashed #CCD5E6",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  background: "#F4F7FF",
  fontSize: 13,
  color: "#4E556B",
  fontWeight: 700,
};

export const adminPrimaryCtaStyle = {
  border: "none",
  background: "linear-gradient(140deg, #E26666 0%, #D84F4F 100%)",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 16px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "'Space Grotesk', sans-serif",
  letterSpacing: "0.01em",
  boxShadow: "0 10px 20px rgba(216, 79, 79, 0.32)",
};

export const adminSecondaryButtonStyle = {
  background: "#F2F4F9",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#DBE0EC",
  borderRadius: 10,
  padding: "11px 20px",
  fontSize: 14,
  fontWeight: 700,
  color: "#4E556B",
  cursor: "pointer",
};

export const adminLoadingTextStyle = {
  color: "#667085",
  marginTop: 8,
  fontSize: 14,
};

export const adminGroupCardStyle = {
  marginBottom: 18,
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 8px 22px rgba(3, 4, 28, 0.08)",
};

export const adminGroupHeaderStyle = {
  background: "linear-gradient(130deg, #03041C 0%, #1E2253 100%)",
  color: "#fff",
  padding: "11px 16px",
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: "0.01em",
};

export const adminGroupBodyStyle = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFF 100%)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#E6E9F2",
  borderTop: "none",
  overflow: "hidden",
};

export const adminTableContainerStyle = {
  overflowX: "auto",
};

export const adminTableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 760,
};

export const adminTableHeadRowStyle = {
  background: "#F7F9FF",
  textAlign: "left",
};

export const adminThStyle = {
  padding: "11px 14px",
  borderBottom: "1px solid #E6E9F2",
  fontSize: 10,
  fontWeight: 700,
  color: "#6A7188",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

export const adminTdStyle = {
  padding: "11px 14px",
  borderBottom: "1px solid #F0F2F7",
  fontSize: 14,
  color: "#101828",
};

export const adminActionGroupStyle = {
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};

export const adminActionDeleteStyle = {
  border: "1px solid #FECACA",
  background: "#FFF5F5",
  color: "#DC2626",
  borderRadius: 8,
  padding: "6px 11px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
};

export const adminActionViewStyle = {
  border: "1px solid #BFDBFE",
  background: "#EFF6FF",
  color: "#1D4ED8",
  borderRadius: 8,
  padding: "6px 11px",
  fontSize: 12,
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
};

export const adminActionEditStyle = {
  border: "1px solid #D1FAE5",
  background: "#ECFDF5",
  color: "#065F46",
  borderRadius: 8,
  padding: "6px 11px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
};

export const adminStatusPublishedStyle = {
  background: "#DCFCE7",
  color: "#166534",
  borderRadius: 999,
  padding: "3px 9px",
  fontSize: 10,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

export const adminStatusDraftStyle = {
  background: "#F2F4F7",
  color: "#667085",
  borderRadius: 999,
  padding: "3px 9px",
  fontSize: 10,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};
