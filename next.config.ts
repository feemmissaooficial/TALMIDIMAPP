import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // Desativado por enquanto: o service worker do PWA estava guardando versões
  // antigas do app em cache e fazendo telas corrigidas "voltarem" sozinhas.
  disable: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);
