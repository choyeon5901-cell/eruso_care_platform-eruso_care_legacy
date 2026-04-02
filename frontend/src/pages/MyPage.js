import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import MenuListItem from "../components/MenuListItem";
import theme from "../styles/theme";

export default function MyPage() {
  const navigate = useNavigate();

  const goInfo = (title) => {
    navigate("/info", { state: { title } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        maxWidth: theme.layout.maxWidth,
        margin: "0 auto",
      }}
    >
      <AppHeader title="마이페이지" />

      <div style={{ padding: 18 }}>
        <div
          style={{
            background: "linear-gradient(135deg, #2F80ED, #56CCF2)",
            borderRadius: 24,
            padding: 20,
            color: "#fff",
            marginBottom: 16,
            boxShadow: theme.shadow.card,
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.9 }}>환영합니다</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>홍길동님</div>
        </div>

        <MenuListItem title="내정보" onClick={() => navigate("/profile")} />
        <MenuListItem title="가족관리" onClick={() => goInfo("가족관리")} />
        <MenuListItem title="건강정보" onClick={() => goInfo("건강정보")} />
        <MenuListItem title="카드관리" onClick={() => goInfo("카드관리")} />
        <MenuListItem title="서비스 이용약관" onClick={() => goInfo("서비스 이용약관")} />
        <MenuListItem title="위치정보 이용약관" onClick={() => goInfo("위치정보 이용약관")} />
        <MenuListItem title="개인정보처리방침" onClick={() => goInfo("개인정보처리방침")} />
        <MenuListItem title="리뷰" onClick={() => goInfo("리뷰")} />
      </div>
    </div>
  );
}