"use client";

import { useEffect } from "react";

// Em algum momento o app rodou com PWA/service worker ativo, e isso ficou
// guardando páginas antigas em cache no navegador — fazendo correções já
// publicadas "sumirem" e a versão velha voltar. Este componente roda uma vez,
// remove qualquer service worker e cache antigos, e nunca mais faz nada
// depois que a limpeza é feita.
export default function KillOldServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let foundSomethingOld = false;

    const cleanup = async () => {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) foundSomethingOld = true;
        registrations.forEach((registration) => registration.unregister());
      }

      if ("caches" in window) {
        const names = await caches.keys();
        if (names.length > 0) foundSomethingOld = true;
        await Promise.all(names.map((name) => caches.delete(name)));
      }

      // Se achou service worker/cache velho, essa própria página pode já
      // ter carregado uma versão quebrada (JS antigo apontando pra arquivos
      // que não existem mais). Um único reload garante que o navegador
      // busque a versão atual — a flag no sessionStorage evita loop infinito.
      if (foundSomethingOld && sessionStorage.getItem("talmidim-sw-cleaned") !== "1") {
        sessionStorage.setItem("talmidim-sw-cleaned", "1");
        window.location.reload();
      }
    };

    cleanup();
  }, []);

  return null;
}
