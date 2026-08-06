"use client";

import { useEffect, useState } from "react";

const SPLASH_SEEN_KEY = "talmidim-splash-seen";

export default function SplashScreen() {
  // Só decide se mostra depois de checar o localStorage (evita mostrar de novo
  // em cada navegação/retorno do login do Google, que recarrega a página toda).
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // sessionStorage (não localStorage): some quando fecha a aba/navegador,
    // então o vídeo volta a aparecer toda vez que o app é aberto de novo —
    // só não repete no meio do mesmo login (ida e volta do Google).
    const alreadySeen = typeof window !== "undefined" && sessionStorage.getItem(SPLASH_SEEN_KEY) === "1";
    setShow(!alreadySeen);
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    // Fallback absoluto de 15 segundos caso o vídeo trave
    const t = setTimeout(() => finish(), 15000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const finish = () => {
    sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
    setShow(false);
  };

  if (!checked || !show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <video
        src="/splash_v2.mp4"
        autoPlay
        muted
        loop={false}
        playsInline
        controls={false}
        onEnded={finish}
        onError={finish}
        className="w-full h-full object-cover"
      />

      <button
        onClick={finish}
        className="absolute bottom-10 right-8 z-50 text-white bg-black/50 px-6 py-3 rounded-full text-sm uppercase tracking-widest font-bold backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all"
      >
        PULAR
      </button>
    </div>
  );
}
