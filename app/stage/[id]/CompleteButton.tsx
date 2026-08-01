"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { stageOrder } from "../../data";
import { createClient } from "../../../utils/supabase/client";

export default function CompleteButton({
  id,
  dayIndex,
  canComplete = true,
}: {
  id: string;
  dayIndex: number;
  canComplete?: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = async () => {
    if (!canComplete) return;
    setIsCompleted(true);

    // Modelo do Nilton: a estação dura 21 dias sempre, mas em dois momentos.
    // Dia 7 = MARCO — libera o conteúdo da próxima estação, mas a pessoa
    // continua praticando a estação atual até o dia 21.
    // Dia 21 = CONQUISTA — a insígnia da estação é revelada (como já era).
    // Isso permite estações sobrepostas: dá pra estar praticando 2 ou mais
    // estações ao mesmo tempo, cada uma no seu próprio dia.
    const nextDay = Math.min(dayIndex + 1, 21);
    const isMarco = dayIndex + 1 === 8;
    const isConquista = dayIndex + 1 > 21;

    // Obter usuário logado
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    localStorage.setItem(`talmidim-day-${id}`, nextDay.toString());

    if (userId) {
      await supabase.from('user_daily_progress').upsert({
        user_id: userId,
        stage_id: id,
        day_index: nextDay,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, stage_id' });
    }

    if (isMarco) {
      // Libera a próxima estação (se houver) sem resetar a atual — a atual
      // segue disponível para prática até completar o dia 21.
      const currentIndex = stageOrder.indexOf(id);

      // O progresso "de verdade" é o do banco, não o do localStorage —
      // localStorage é só um cache pra quando não há sessão. Se comparar
      // com um valor antigo do aparelho (ex.: depois de um reset de conta
      // no banco), o cadeado da próxima estação nunca abre, porque o app
      // acha que a pessoa "já passou" daquele ponto quando na verdade o
      // banco está zerado. Bug reportado pelo Nilton no Dia 7.
      let currentProgress = 0;
      if (userId) {
        const { data: unlockData } = await supabase
          .from('user_stage_unlocks')
          .select('current_stage_index')
          .eq('user_id', userId)
          .single();
        currentProgress = unlockData?.current_stage_index ?? 0;
      } else {
        const saved = localStorage.getItem("talmidim-progress");
        currentProgress = saved !== null ? Number(saved) : 0;
      }

      if (currentIndex >= currentProgress && currentIndex + 1 < stageOrder.length) {
        const nextIndex = currentIndex + 1;
        localStorage.setItem("talmidim-progress", nextIndex.toString());
        if (userId) {
          await supabase.from('user_stage_unlocks').upsert({
            user_id: userId,
            current_stage_index: nextIndex,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }
      }
    }

    setTimeout(() => {
      if (isConquista) {
        router.push(`/congratulations?stage=${id}`);
      } else if (isMarco) {
        router.push(`/marco?stage=${id}`);
      } else {
        router.push("/");
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={handleComplete}
        disabled={isCompleted || !canComplete}
        className={`w-3/4 max-w-[250px] py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 ${
          !canComplete
            ? "bg-[#c69c6d]/30 text-white/60 cursor-not-allowed"
            : isCompleted
            ? "bg-[#c69c6d] text-white scale-100"
            : "bg-[#c69c6d] text-white active:scale-95"
        }`}
      >
        {isCompleted ? "Concluído" : "Concluir"}
      </button>
      <p className="text-[13px] font-medium text-[#1a202c]/70 text-center mt-3">
        Não avance sem praticar.
      </p>
    </div>
  );
}
