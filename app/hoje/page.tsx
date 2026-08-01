"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { getStage, stageOrder, badgeNames } from "../data";
import { GLOBAL_STAGE_KEY, todayEpochDay } from "../stage/[id]/PracticesTab";
import BottomNav from "../components/BottomNav";
import { Sun, BookText, Trophy, ChevronRight, Flame } from "lucide-react";

export default function HojePage() {
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Peregrino");
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [journeyDone, setJourneyDone] = useState(false);
  const [tsdDone, setTsdDone] = useState(false);
  const [intercessionDone, setIntercessionDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }

      const fullName = session.user?.user_metadata?.full_name || session.user?.user_metadata?.name;
      if (fullName) setUserName(String(fullName).split(" ")[0]);

      // Mesmas guardas do Mapa: sem Radar ou sem PDD, não é "Hoje" ainda —
      // é Fase 0 que falta completar.
      const { data: userRadars } = await supabase
        .from("user_radars")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1)
        .single();
      if (!userRadars) {
        router.push("/radar");
        return;
      }

      const { data: userPdds } = await supabase
        .from("user_pdds")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1)
        .single();
      if (!userPdds) {
        router.push("/pdd");
        return;
      }

      const { data: unlockData } = await supabase
        .from("user_stage_unlocks")
        .select("current_stage_index")
        .eq("user_id", session.user.id)
        .single();

      const resolvedIndex = unlockData?.current_stage_index ?? 0;

      const { data: allDaysData } = await supabase
        .from("user_daily_progress")
        .select("stage_id, day_index")
        .eq("user_id", session.user.id)
        .in("stage_id", stageOrder);

      const dayMap: Record<string, number> = {};
      (allDaysData || []).forEach((row) => {
        dayMap[row.stage_id] = row.day_index;
      });

      const lastStageId = stageOrder[stageOrder.length - 1];
      const done = (dayMap[lastStageId] || 0) >= 21;
      setJourneyDone(done);

      if (!done && resolvedIndex < stageOrder.length) {
        const stageId = stageOrder[resolvedIndex];
        setActiveStageId(stageId);
        setActiveDay(dayMap[stageId] || 1);
      }

      const { data: globalPractice } = await supabase
        .from("user_practices")
        .select("tsd_done, intercession_done")
        .eq("user_id", session.user.id)
        .eq("stage_id", GLOBAL_STAGE_KEY)
        .eq("day_number", todayEpochDay())
        .single();

      setTsdDone(globalPractice?.tsd_done || false);
      setIntercessionDone(globalPractice?.intercession_done || false);
      setLoading(false);
    };
    load();
  }, [router]);

  const toggleGlobalPractice = async (field: "tsd_done" | "intercession_done") => {
    const current = field === "tsd_done" ? tsdDone : intercessionDone;
    const newValue = !current;
    if (field === "tsd_done") setTsdDone(newValue);
    else setIntercessionDone(newValue);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setSaving(true);
    const { error } = await supabase.from("user_practices").upsert({
      user_id: session.user.id,
      stage_id: GLOBAL_STAGE_KEY,
      day_number: todayEpochDay(),
      [field]: newValue,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id, stage_id, day_number" });

    if (error) {
      if (field === "tsd_done") setTsdDone(current);
      else setIntercessionDone(current);
    }
    setSaving(false);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5] border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  const stage = activeStageId ? getStage(activeStageId) : null;
  const dayData = stage?.days.find((d) => d.day === activeDay);
  const isInPractice = activeDay >= 8 && activeDay <= 21;

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#243525] font-sans pb-32">
      <div className="pt-12 pb-6 px-6 border-b border-[#eaddc5]/60 bg-[#fdfbf7]">
        <div className="flex items-center gap-2 mb-1 opacity-80">
          <Sun size={18} className="text-[#c69b5c]" />
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#b58b54]">Hoje</span>
        </div>
        <h1 className="text-[26px] font-serif font-bold text-[#1f3020]">Olá, {userName}</h1>
      </div>

      <div className="px-6 pt-6 space-y-4">
        {/* Card principal: o que fazer hoje na jornada */}
        {journeyDone ? (
          <div className="bg-white border border-[#f0e4cd] rounded-2xl p-6 text-center shadow-sm">
            <p className="text-[15px] text-[#3b5238] font-medium">
              Você concluiu as sete estações. Sua jornada continua além do aplicativo — a formação de um discípulo nunca termina de verdade.
            </p>
          </div>
        ) : stage && dayData ? (
          <button
            onClick={() => router.push(`/stage/${activeStageId}`)}
            className="w-full text-left bg-white border border-[#f0e4cd] rounded-2xl p-5 shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-widest text-[#b58b54] uppercase">
                {stage.title} · Dia {activeDay} de 21
              </span>
              <ChevronRight size={18} className="text-[#c69b5c]" />
            </div>
            <p className="text-[16px] font-bold text-[#1f3020] mb-1">{dayData.title}</p>
            {isInPractice && (
              <span className="inline-block text-[11px] font-bold text-[#8b6131] bg-[#8b6131]/10 rounded-full px-3 py-1 mt-1">
                Fase de prática contínua
              </span>
            )}

            {/* Lembrete elegante de quanto falta pra insígnia (pedido do
                Nilton) — barra fina + contagem, no lugar de só um texto. */}
            <div className="mt-4">
              <div className="w-full h-1.5 rounded-full bg-[#eaddc5]/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d5b080] to-[#c69b5c]"
                  style={{ width: `${(activeDay / 21) * 100}%` }}
                />
              </div>
              <p className="text-[12px] text-[#8b6131] font-bold mt-2">
                {21 - activeDay <= 0
                  ? `Insígnia "${badgeNames[activeStageId as string] || "desta estação"}" liberada!`
                  : `Faltam ${21 - activeDay} dia${21 - activeDay === 1 ? "" : "s"} para a insígnia "${badgeNames[activeStageId as string] || "desta estação"}"`}
              </p>
            </div>
          </button>
        ) : (
          <div className="bg-white border border-[#f0e4cd] rounded-2xl p-6 text-center shadow-sm">
            <p className="text-[14px] text-[#3b5238]">Nenhuma estação ativa no momento.</p>
          </div>
        )}

        {/* Hábitos diários fixos — valem para o dia, não para a estação */}
        <div className="bg-white border border-[#f0e4cd] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} className="text-[#c69b5c]" />
            <h3 className="text-[14px] font-bold text-[#8b6131]">Práticas Diárias</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tsdDone}
                onChange={() => toggleGlobalPractice("tsd_done")}
                disabled={saving}
                className="mt-1 w-5 h-5 accent-[#c69b5c] rounded-sm"
              />
              <div>
                <span className="block font-bold text-[#243525] text-[14px]">Tempo a Sós com Deus (TSD)</span>
                <span className="text-[12px] text-[#3b5238]/70">15 min de oração + 15 min de leitura bíblica.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={intercessionDone}
                onChange={() => toggleGlobalPractice("intercession_done")}
                disabled={saving}
                className="mt-1 w-5 h-5 accent-[#c69b5c] rounded-sm"
              />
              <div>
                <span className="block font-bold text-[#243525] text-[14px]">5 Pessoas em Oração</span>
                <span className="text-[12px] text-[#3b5238]/70">Oração intercessória diária pelas 5 pessoas do seu PDD.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/diary")}
            className="bg-white border border-[#f0e4cd] rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <BookText size={20} className="text-[#8b6131]" />
            <span className="text-[12px] font-bold text-[#243525]">Diário</span>
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white border border-[#f0e4cd] rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <Trophy size={20} className="text-[#8b6131]" />
            <span className="text-[12px] font-bold text-[#243525]">Conquistas</span>
          </button>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
