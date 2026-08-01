"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Mesmo padrão visual do onboarding (Fase 0): SVGs inline, sem lib externa.
const BookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const HandHeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c0 0-7-4.35-9.5-9C1 8.5 2.5 5 6 5c2 0 3.5 1.3 4 2.3C10.5 6.3 12 5 14 5c3.5 0 5 3.5 3.5 7C15 16.65 12 21 12 21z" />
  </svg>
);

// Tela 7 e Tela 8 da Fase 0 (ET-003): apresentação do CONCEITO do PDD e o
// convite ao compromisso — sem nenhuma criação de dado ainda. A criação real
// do PDD (formulário de áreas, plano de ação, parceiro e assinatura)
// continua acontecendo depois, na própria tela /pdd, exatamente como o
// documento pede: "apenas o conceito, sem criação pelo aplicativo".
const screens = [
  {
    icon: BookIcon,
    lines: [
      "Plano de Desenvolvimento Discipular",
      "Com base no seu diagnóstico, o aplicativo destacará áreas que merecem atenção especial durante a jornada. Seu Plano de Desenvolvimento Discipular servirá como referência para acompanhar seu progresso.",
    ],
    buttonLabel: "Assumir compromisso",
  },
  {
    icon: HandHeartIcon,
    lines: [
      "Compromisso",
      "A transformação acontece quando a verdade é colocada em prática. Você está disposto a percorrer esta jornada com fidelidade, aprendendo e vivendo a Palavra de Deus?",
    ],
    buttonLabel: "Eu aceito",
  },
];

export default function PddIntroPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const total = screens.length;
  const isLast = index === total - 1;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setReplayKey((k) => k + 1);
  }, [index]);

  const advance = () => {
    if (index < total - 1) setIndex(index + 1);
  };

  const finish = () => {
    router.push("/pdd");
  };

  const Screen = screens[index];
  const Icon = Screen.icon;

  return (
    <div
      ref={containerRef}
      onClick={advance}
      className="relative min-h-screen w-full flex justify-center cursor-pointer select-none"
      style={{ background: "linear-gradient(180deg, #0a0f0a 0%, #16210f 100%)" }}
    >
      <div className="w-full max-w-[420px] relative flex flex-col min-h-screen px-8">
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px opacity-25"
          style={{ background: "linear-gradient(180deg, transparent 0%, #c69b5c 50%, transparent 100%)" }}
        />

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div
            className="w-11 h-11 rounded-full border flex items-center justify-center mb-6"
            style={{ borderColor: "#c69b5c" }}
          >
            <Icon className="w-5 h-5 text-[#c69b5c]" />
          </div>

          {Screen.lines.map((line, i) => (
            <p
              key={`${replayKey}-${i}`}
              className="leading-snug"
              style={{
                fontFamily: i === 0 ? "Georgia, serif" : undefined,
                fontSize: i === 0 ? 24 : 15,
                fontWeight: i === 0 ? 700 : 400,
                color: i === 0 ? "#fdf0d5" : "#eaddc5cc",
                marginBottom: 12,
                opacity: 0,
                transform: "translateY(14px)",
                animation: `teleUp 0.7s cubic-bezier(0.25,1,0.5,1) ${i * 0.22}s forwards`,
              }}
            >
              {line}
            </p>
          ))}

          <button
            key={`btn-${replayKey}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isLast) finish();
              else advance();
            }}
            className="mt-4 self-start uppercase font-bold tracking-wide text-[13px] px-6 py-3 rounded-xl"
            style={{
              background: "linear-gradient(90deg, #b58b54, #eaddc5)",
              color: "#1a1406",
              opacity: 0,
              animation: `teleUp 0.7s cubic-bezier(0.25,1,0.5,1) ${Screen.lines.length * 0.22 + 0.1}s forwards`,
            }}
          >
            {Screen.buttonLabel}
          </button>
        </div>

        <div className="pb-10 relative z-10">
          {!isLast && (
            <p
              className="text-center text-[10px] uppercase tracking-widest mb-4"
              style={{ color: "#eaddc580" }}
            >
              Toque pra continuar
            </p>
          )}
          <div className="flex justify-center gap-2">
            {screens.map((_, i) => (
              <span
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: 6,
                  height: 6,
                  background: i === index ? "#eaddc5" : "#eaddc540",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes teleUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
