"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Das 18h até 05h59 é noite (Modo Escuro / Companheiro)
      // Das 06h até 17h59 é dia (Modo Claro)
      const isNight = hour >= 18 || hour < 6;
      
      if (isNight) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    };

    // Executa ao montar
    checkTime();

    // Checa a cada 1 minuto caso o usuário fique com o app aberto na virada do turno
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Evita flash de conteúdo antes do script rodar
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <>{children}</>;
}
