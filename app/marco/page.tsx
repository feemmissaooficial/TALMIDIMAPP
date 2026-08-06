"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getStage, stageOrder } from "../data";
import { Map, ArrowRight } from "lucide-react";

// Tela de MARCO — diferente da CONQUISTA (que revela a insígnia no dia 21).
// Aparece no dia 7 de cada estação: a próxima estação foi liberada, mas a
// pessoa continua praticando a atual até completar os 21 dias. É um sinal
// de progresso, não uma medalha — por isso é mais simples e rápida.
function MarcoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageId = searchParams?.get("stage") || "";
  const stage = getStage(stageId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !stage) return null;

  const currentIndex = stageOrder.indexOf(stageId);
  const nextStageId = stageOrder[currentIndex + 1];
  const nextStage = nextStageId ? getStage(nextStageId) : null;

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#243525] flex flex-col items-center justify-center px-8 py-12 animate-in fade-in duration-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[100vw] h-[100vw] max-w-[600px] max-h-[600px] border-[1px] border-[#eaddc5]/60 rounded-full translate-x-[40%] -translate-y-[40%] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] border-[1px] border-[#eaddc5]/40 rounded-full -translate-x-[30%] translate-y-[30%] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px]">
        <div
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-8 animate-in zoom-in-95 duration-700"
          style={{ borderColor: "#c69b5c" }}
        >
          <ArrowRight className="text-[#c69b5c]" size={28} />
        </div>

        <p className="text-[12px] font-bold text-[#b58b54] uppercase tracking-[0.3em] mb-3 text-center">
          7 dias de fundamento concluídos
        </p>
        <h1 className="text-[34px] font-bold text-center font-serif leading-[1.1] tracking-tight mb-6">
          Um marco na<br/>caminhada
        </h1>

        <p className="text-[15px] text-[#3b5238] leading-relaxed text-center mb-10">
          Você não termina {stage.title} agora — continue praticando o que aprendeu
          nos próximos dias. Mas o conteúdo{nextStage ? ` de ${nextStage.title}` : " da próxima estação"} já
          está liberado, e você pode começar quando quiser. A insígnia desta
          estação chega no dia 21, quando a prática estiver enraizada.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#243525] text-white py-4 px-6 rounded-[20px] font-bold shadow-[0_15px_30px_rgba(36,53,37,0.25)] active:scale-95 transition-all flex items-center justify-center gap-3 tracking-wide"
        >
          Ver no Mapa <Map size={20} className="opacity-80" />
        </button>
      </div>
    </div>
  );
}

export default function Marco() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfaf6]" />}>
      <MarcoContent />
    </Suspense>
  );
}
