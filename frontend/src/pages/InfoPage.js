import React from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import theme from "../styles/theme";

export default function InfoPage() {
  const location = useLocation();
  const title = location.state?.title || "상세 페이지";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        maxWidth: theme.layout.maxWidth,
        margin: "0 auto",
      }}
    >
      <AppHeader title={title} />

      <div style={{ padding: 18 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            padding: 18,
            boxShadow: theme.shadow.soft,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: theme.colors.text,
              marginBottom: 12,
            }}
          >
            {title}
          </div>
          <div style={{ color: theme.colors.subtext, lineHeight: 1.6 }}>
            이 페이지는 {title} 상세 화면입니다.
            <br />
            다음 단계에서 실제 API와 입력/조회 기능을 연결하면 됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}