import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomTab from "../components/BottomTab";
import theme from "../styles/theme";

const statCards = [
  { label: "오늘 주문", value: 18 },
  { label: "배송 중", value: 6 },
  { label: "완료", value: 12 },
];

const recentOrders = [
  { id: "A-1024", name: "해열제", address: "대전 서구 둔산동", status: "배송중" },
  { id: "A-1025", name: "감기약", address: "대전 유성구 봉명동", status: "접수" },
  { id: "A-1026", name: "소화제", address: "대전 중구 오류동", status: "완료" },
];

const statusStyle = {
  배송중: { bg: "#FFF1E8", color: "#F97316" },
  접수: { bg: "#EAF2FF", color: "#2563EB" },
  완료: { bg: "#ECFDF3", color: "#16A34A" },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        maxWidth: theme.layout.maxWidth,
        margin: "0 auto",
        paddingBottom: theme.layout.bottomTabHeight,
      }}
    >
      <AppHeader title="약국 배송" />

      <div style={{ padding: 18 }}>
        <div
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #56CCF2 100%)",
            borderRadius: 28,
            padding: 22,
            color: "#fff",
            boxShadow: theme.shadow.card,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, opacity: 0.95 }}>
            오늘도 안전한 배송
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 28,
              lineHeight: 1.35,
              fontWeight: 800,
              wordBreak: "keep-all",
            }}
          >
            기사님, 18건 배달 예정입니다
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/map")}
              style={{
                border: "none",
                borderRadius: 16,
                padding: "14px 18px",
                fontWeight: 800,
                background: "#fff",
                color: theme.colors.primary,
                cursor: "pointer",
              }}
            >
              지도 보기
            </button>

            <button
              onClick={() => navigate("/orders")}
              style={{
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 16,
                padding: "14px 18px",
                fontWeight: 700,
                background: "rgba(255,255,255,0.10)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              주문 확인
            </button>

            <button
              onClick={() => navigate("/prescription")}
              style={{
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 16,
                padding: "14px 18px",
                fontWeight: 700,
                background: "rgba(255,255,255,0.10)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              처방전 보기
            </button>
            <button onClick={() => {
              window.location.href = "/video";
              }}
            >
              화상진료 시작
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {statCards.map((item) => (
            <div
              key={item.label}
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: 18,
                boxShadow: theme.shadow.soft,
              }}
            >
              <div style={{ color: theme.colors.subtext, fontSize: 14 }}>
                {item.label}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontWeight: 800,
                  fontSize: 24,
                  color: theme.colors.text,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            background: "#fff",
            borderRadius: 28,
            padding: 18,
            boxShadow: theme.shadow.soft,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 18,
              color: theme.colors.text,
              marginBottom: 16,
            }}
          >
            최근 주문
          </div>

          {recentOrders.map((order, index) => (
            <div
              key={order.id}
              style={{
                padding: "14px 0",
                borderBottom:
                  index === recentOrders.length - 1 ? "none" : "1px solid #EAEFF5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: theme.colors.text,
                  }}
                >
                  {order.id} · {order.name}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: theme.colors.subtext,
                  }}
                >
                  {order.address}
                </div>
              </div>

              <div
                style={{
                  minWidth: 56,
                  textAlign: "center",
                  padding: "8px 10px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 800,
                  background: statusStyle[order.status].bg,
                  color: statusStyle[order.status].color,
                }}
              >
                {order.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomTab />
    </div>
  );
}