"use client";

import { useState, type CSSProperties, type ElementType } from "react";
import { Lock } from "lucide-react";

// Momento de ápice da jornada: o usuário toca no baú fechado e ele
// "explode" — flash de tela, raios girando, anéis de onda de choque,
// faíscas, confete caindo e a insígnia surgindo com um pop elástico e
// brilho pulsante contínuo. Bem mais dramático que uma simples troca de
// opacidade.
const badgeRevealStyles = `
  @keyframes chestFlash {
    0% { opacity: 0; }
    12% { opacity: 1; }
    100% { opacity: 0; }
  }
  .chest-flash {
    animation: chestFlash 0.7s ease-out forwards;
  }

  @keyframes chestBurstRing {
    0% { transform: scale(0.25); opacity: 0.95; }
    100% { transform: scale(3.4); opacity: 0; }
  }
  .chest-burst-ring {
    position: absolute;
    inset: -8px;
    border-radius: 9999px;
    border: 2px solid var(--ring-color, #d5b080);
    animation: chestBurstRing 1.1s cubic-bezier(0.15, 1, 0.4, 1) forwards;
    pointer-events: none;
  }
  .chest-burst-ring-2 { animation-delay: 0.12s; }
  .chest-burst-ring-3 { animation-delay: 0.26s; }

  @keyframes chestSpark {
    0% { transform: rotate(var(--angle)) translateX(0) scale(1); opacity: 1; }
    100% { transform: rotate(var(--angle)) translateX(var(--dist, 90px)) scale(0); opacity: 0; }
  }
  .chest-spark {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 7px;
    height: 7px;
    margin: -3.5px;
    border-radius: 9999px;
    box-shadow: 0 0 10px 3px rgba(198, 155, 92, 0.9);
    animation: chestSpark 0.95s cubic-bezier(0.1, 0.9, 0.3, 1) forwards;
    transform-origin: center;
    pointer-events: none;
  }

  @keyframes chestConfetti {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(360px) rotate(var(--rot, 420deg)); opacity: 0; }
  }
  .chest-confetti {
    position: absolute;
    top: 10%;
    width: 6px;
    height: 12px;
    border-radius: 1px;
    animation: chestConfetti 1.7s cubic-bezier(0.25, 0.6, 0.4, 1) forwards;
    pointer-events: none;
  }

  @keyframes chestRaysSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .chest-rays {
    animation: chestRaysSpin 16s linear infinite;
  }

  @keyframes chestBadgePop {
    0% { transform: scale(0) rotate(50deg); opacity: 0; }
    55% { transform: scale(1.3) rotate(-8deg); opacity: 1; }
    75% { transform: scale(0.92) rotate(4deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes chestBadgeGlow {
    0%, 100% { box-shadow: 0 0 40px 6px rgba(198, 155, 92, 0.35); }
    50% { box-shadow: 0 0 75px 16px rgba(198, 155, 92, 0.65); }
  }
  /* Uma única classe combinando as duas animações — "animation" é shorthand,
     então duas classes separadas cada uma setando "animation" se sobrepõem
     em vez de somar. Aqui as duas rodam juntas: o pop elástico de entrada,
     seguido (com atraso = duração do pop) do brilho pulsante contínuo. */
  .chest-badge-reveal {
    animation:
      chestBadgePop 0.85s cubic-bezier(0.2, 1, 0.4, 1) forwards,
      chestBadgeGlow 2.2s ease-in-out infinite 0.85s;
  }

  @keyframes chestShimmerText {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .chest-shimmer-text {
    background: linear-gradient(90deg, #b58b54 0%, #fdf0d5 45%, #b58b54 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: chestShimmerText 2s linear infinite;
  }
`;

const SPARK_COLORS = ["#eaddc5", "#fdf0d5", "#d5b080", "#c69b5c"];
const CONFETTI_COLORS = ["#d5b080", "#eaddc5", "#b58b54", "#fdf0d5"];

type Props = {
  BadgeIcon: ElementType<{ size?: number; className?: string }>;
  badgeName: string;
  theme?: "light" | "dark";
};

export default function BadgeRevealChest({ BadgeIcon, badgeName, theme = "light" }: Props) {
  const [chestOpened, setChestOpened] = useState(false);
  const isDark = theme === "dark";

  return (
    <div className="relative flex flex-col items-center">
      {/* Flash branco-dourado cobrindo a tela inteira no instante da abertura */}
      {chestOpened && (
        <div
          className="chest-flash fixed inset-0 z-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,250,235,0.95) 0%, rgba(255,250,235,0) 65%)",
          }}
        />
      )}

      <div className="relative w-40 h-40 flex items-center justify-center mb-2">
        {/* Raios girando lentamente atrás da insígnia revelada */}
        {chestOpened && (
          <div
            className="chest-rays absolute inset-[-34px] pointer-events-none"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${
                isDark ? "rgba(198,155,92,0.4)" : "rgba(181,139,84,0.4)"
              } 8deg, transparent 18deg, transparent 42deg, ${
                isDark ? "rgba(198,155,92,0.4)" : "rgba(181,139,84,0.4)"
              } 50deg, transparent 60deg, transparent 84deg, ${
                isDark ? "rgba(198,155,92,0.4)" : "rgba(181,139,84,0.4)"
              } 92deg, transparent 102deg)`,
              borderRadius: "9999px",
            }}
          />
        )}

        <button
          type="button"
          onClick={() => setChestOpened(true)}
          aria-label="Abrir insígnia"
          className="relative w-28 h-28 flex items-center justify-center"
        >
          {chestOpened && (
            <>
              <span
                className="chest-burst-ring"
                style={{ ["--ring-color" as string]: isDark ? "#c69b5c" : "#d5b080" } as CSSProperties}
              />
              <span
                className="chest-burst-ring chest-burst-ring-2"
                style={{ ["--ring-color" as string]: "#eaddc5" } as CSSProperties}
              />
              <span
                className="chest-burst-ring chest-burst-ring-3"
                style={{ ["--ring-color" as string]: isDark ? "#c69b5c" : "#b38a53" } as CSSProperties}
              />

              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={`spark-${i}`}
                  className="chest-spark"
                  style={
                    {
                      ["--angle" as string]: `${i * 16.4}deg`,
                      ["--dist" as string]: `${65 + (i % 4) * 22}px`,
                      background: SPARK_COLORS[i % SPARK_COLORS.length],
                      animationDelay: `${i * 0.012}s`,
                    } as unknown as CSSProperties
                  }
                />
              ))}

              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={`confetti-${i}`}
                  className="chest-confetti"
                  style={
                    {
                      left: `${4 + i * 6}%`,
                      background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                      ["--rot" as string]: `${280 + i * 35}deg`,
                      animationDelay: `${i * 0.025}s`,
                      transform: `rotate(${i * 23}deg)`,
                    } as unknown as CSSProperties
                  }
                />
              ))}
            </>
          )}

          {/* Baú fechado */}
          <div
            className={`absolute inset-0 rounded-[22px] flex items-center justify-center transition-all duration-500 ${
              isDark
                ? "bg-[#111812] border border-[#c69b5c]/30 shadow-[0_0_60px_rgba(198,155,92,0.2)]"
                : "border border-[#d5b080]/40 bg-gradient-to-br from-[#f6ecd8] to-[#fdfaf6] shadow-[0_15px_30px_rgba(213,176,128,0.2)]"
            } ${
              chestOpened
                ? "opacity-0 scale-75 rotate-6 pointer-events-none"
                : "opacity-100 scale-100 animate-pulse"
            }`}
          >
            <Lock size={32} className={isDark ? "text-[#c69b5c]" : "text-[#b58b54]"} />
          </div>

          {/* Insígnia revelada — pop elástico + brilho pulsante contínuo */}
          <div
            className={`absolute inset-0 rounded-full flex items-center justify-center ${
              isDark
                ? "bg-[#111812] border border-[#c69b5c]/30"
                : "bg-gradient-to-br from-[#fdfaf6] via-[#d5b080] to-[#b38a53]"
            } ${chestOpened ? "chest-badge-reveal" : "opacity-0 scale-0 pointer-events-none"}`}
            style={chestOpened ? { animationDelay: "0.28s, 1.13s" } : undefined}
          >
            <BadgeIcon size={46} className={isDark ? "text-[#c69b5c]" : "text-[#111812]"} />
          </div>
        </button>
      </div>

      <p
        className={`text-center text-[13px] font-bold uppercase tracking-widest mb-6 transition-opacity duration-500 ${
          chestOpened ? "chest-shimmer-text" : `${isDark ? "text-[#c69b5c]" : "text-[#b58b54]"} animate-pulse`
        }`}
      >
        {chestOpened ? badgeName : "Toque para revelar sua insígnia"}
      </p>

      <style>{badgeRevealStyles}</style>
    </div>
  );
}
