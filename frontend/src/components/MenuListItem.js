import React from "react";
import theme from "../styles/theme";

export default function MenuListItem({ title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        background: "#fff",
        borderRadius: 18,
        padding: "16px 18px",
        boxShadow: theme.shadow.soft,
        marginBottom: 12,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ fontWeight: 800, color: theme.colors.text }}>{title}</div>
      {subtitle && (
        <div style={{ marginTop: 6, color: theme.colors.subtext, fontSize: 13 }}>
          {subtitle}
        </div>
      )}
    </button>
  );
}