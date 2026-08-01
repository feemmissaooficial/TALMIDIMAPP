"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sun, Map, Target, UserCircle } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Hoje", path: "/hoje", icon: Sun },
    { name: "Jornada", path: "/", icon: Map },
    { name: "Radar", path: "/report", icon: Target },
    { name: "Perfil", path: "/settings", icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-[420px] left-1/2 -translate-x-1/2 pb-safe z-40">
      {/* linha de corte perfurada — mesma linguagem visual do cartão de
          embarque no topo do mapa, "costurando" o rodapé como se fosse a
          continuação do talão do bilhete */}
      <div className="relative" style={{ height: 1 }}>
        <span
          className="absolute rounded-full"
          style={{ left: 0, top: -11, width: 22, height: 22, transform: "translateX(-50%)", background: "#0a0f0a" }}
        />
        <span
          className="absolute rounded-full"
          style={{ right: 0, top: -11, width: 22, height: 22, transform: "translateX(50%)", background: "#0a0f0a" }}
        />
        <div
          className="absolute"
          style={{ left: 16, right: 16, top: 0, borderTop: "2px dashed #4a3c2266" }}
        />
      </div>

      <div className="bg-[#0a0f0a]/95 backdrop-blur-md">
        <div className="flex px-2 pt-4 pb-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex-1 flex flex-col items-center transition-all"
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-[#c69b5c]" : "text-[#eaddc5]/45"}
                />
                <span
                  className={`uppercase mt-1 ${isActive ? "text-[#c69b5c]" : "text-[#eaddc5]/45"}`}
                  style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.08em" }}
                >
                  {item.name}
                </span>
                <span
                  className="rounded-full mt-1"
                  style={{
                    width: 14,
                    height: 2,
                    background: isActive ? "#c69b5c" : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
