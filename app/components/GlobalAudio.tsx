"use client";

import { useEffect, useState, useRef } from "react";

export default function GlobalAudio() {
  const [playJourney, setPlayJourney] = useState(false);
  const splashRef = useRef<HTMLAudioElement>(null);
  const journeyRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Tenta tocar o áudio de abertura do Splash imediatamente
    if (splashRef.current) {
      splashRef.current.volume = 0.6;
      splashRef.current.play().catch(e => console.log("Autoplay do splash bloqueado pelo navegador", e));
    }

    // Após 4.5s (duração exata do splash screen), começa a música da jornada
    const timer = setTimeout(() => {
      setPlayJourney(true);
      if (journeyRef.current) {
        journeyRef.current.volume = 0.25; // Volume bem suave e de fundo
        journeyRef.current.play().catch(e => console.log("Autoplay da jornada bloqueado pelo navegador", e));
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Para navegadores muito restritos, a música da jornada começa no primeiro clique do usuário
  // caso o autoplay automático tenha sido bloqueado.
  useEffect(() => {
    const handleInteraction = () => {
      if (playJourney && journeyRef.current && journeyRef.current.paused) {
        journeyRef.current.play().catch(() => {});
      }
    };
    
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [playJourney]);

  return (
    <>
      <audio ref={splashRef} src="/splash.mp3" autoPlay preload="auto" />
      <audio ref={journeyRef} src="/journey.mp3" loop preload="auto" />
    </>
  );
}
