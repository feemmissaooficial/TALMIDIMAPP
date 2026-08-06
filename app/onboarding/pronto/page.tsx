"use client";

import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";

// Tela 9 da Fase 0 (ET-003): celebra o início da jornada logo depois do
// participante assinar o PDD, antes de cair no Mapa pela primeira vez.
export default function ProntoParaComecarPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center px-8"
      style={{ background: "linear-gradient(180deg, #0a0f0a 0%, #16210f 100%)" }}
    >
      <div className="w-full max-w-[420px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
        <div
          className="w-14 h-14 rounded-full border flex items-center justify-center mb-6"
          style={{ borderColor: "#c69b5c" }}
        >
          <Flame className="w-6 h-6 text-[#c69b5c]" />
        </div>

        <h1 className="text-[28px] font-serif font-bold text-[#fdf0d5] mb-4 leading-tight">
          Parabéns! Sua jornada começou.
        </h1>
        <p className="text-[15px] text-[#eaddc5]/80 leading-relaxed mb-10">
          A Estação 1 o conduzirá ao fortalecimento da intimidade com Deus. Caminhe um dia de cada vez e permita que o Senhor transforme sua vida.
        </p>

        <button
          onClick={() => router.push("/")}
          className="uppercase font-bold tracking-wide text-[13px] px-8 py-3 rounded-xl"
          style={{
            background: "linear-gradient(90deg, #b58b54, #eaddc5)",
            color: "#1a1406",
          }}
        >
          Iniciar Estação 1
        </button>
      </div>
    </div>
  );
}
