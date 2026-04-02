import React from "react";
import AppHeader from "../components/AppHeader";
import BottomTab from "../components/BottomTab";
import theme from "../styles/theme";
import Map from "./Map";

export default function MapPage() {
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
      <AppHeader title="배송 지도" />

      <div style={{ padding: 18 }}>
        <Map />
      </div>

      <BottomTab />
    </div>
  );
}