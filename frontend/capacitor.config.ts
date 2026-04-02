import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.eruro.pharmacy",
  appName: "처방전 주문",
  webDir: "build",
  server: {
    androidScheme: "http",
    cleartext: true
  }
};

export default config;