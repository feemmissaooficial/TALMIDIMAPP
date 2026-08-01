"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { getStage } from "../../data";

// TSD e Intercessão são hábitos diários únicos — valem para o dia inteiro,
// não para uma estação específica. Como pode haver mais de uma estação
// ativa ao mesmo tempo (conteúdo de uma + prática contínua de outra), essas
// duas práticas usam uma chave "global" (mesmo dia do calendário, qualquer
// estação) em vez da chave por estação, senão marcavam separado em cada
// aba e o usuário tinha que marcar a mesma coisa duas vezes por dia.
// Já "Prática da Estação" continua por estação, pois é mesmo específica dela.
export const GLOBAL_STAGE_KEY = "_global";
export const todayEpochDay = () => Math.floor(Date.now() / 86400000);

export default function PracticesTab({ id, dayIndex }: { id: string; dayIndex: number }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [practices, setPractices] = useState({
    tsd_done: false,
    intercession_done: false,
    specific_practice_done: false
  });

  const stage = getStage(id);

  useEffect(() => {
    const loadPractices = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const todayKey = todayEpochDay();

        const [globalRes, stageRes] = await Promise.all([
          supabase
            .from("user_practices")
            .select("tsd_done, intercession_done")
            .eq("user_id", session.user.id)
            .eq("stage_id", GLOBAL_STAGE_KEY)
            .eq("day_number", todayKey)
            .single(),
          supabase
            .from("user_practices")
            .select("specific_practice_done")
            .eq("user_id", session.user.id)
            .eq("stage_id", id)
            .eq("day_number", dayIndex)
            .single(),
        ]);

        setPractices({
          tsd_done: globalRes.data?.tsd_done || false,
          intercession_done: globalRes.data?.intercession_done || false,
          specific_practice_done: stageRes.data?.specific_practice_done || false,
        });
      }
      setLoading(false);
    };

    loadPractices();
  }, [id, dayIndex, supabase]);

  const togglePractice = async (field: keyof typeof practices) => {
    const newValue = !practices[field];

    // Optimistic UI update
    setPractices(prev => ({ ...prev, [field]: newValue }));

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setSaving(true);

    const isDailyGlobal = field === "tsd_done" || field === "intercession_done";

    // Upsert logic
    const { error } = await supabase
      .from("user_practices")
      .upsert({
        user_id: session.user.id,
        stage_id: isDailyGlobal ? GLOBAL_STAGE_KEY : id,
        day_number: isDailyGlobal ? todayEpochDay() : dayIndex,
        [field]: newValue,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id, stage_id, day_number" });

    if (error) {
      // Revert if error
      setPractices(prev => ({ ...prev, [field]: !newValue }));
      alert("Erro ao salvar prática.");
    }
    setSaving(false);
  };

  const getSpecificPracticeLabel = () => {
    // According to documentation
    switch (id) {
      case "house": return "Leitura de Salmos + Jejum bíblico (1x na semana)";
      case "street": return "Momento de oração familiar + convivência intencional";
      case "clinic": return "Convite a 1 pessoa sem igreja + contato";
      case "office": return "Ação prática de cuidado (tempo, escuta, serviço)";
      case "construction": return "Registro do uso do tempo + ajuste de rotina";
      case "rooftop": return "Dar 1 passo prático de serviço";
      case "city": return "Tempo 1:1 com irmão de fé + 2 novas conversas";
      default: return "Prática específica da estação";
    }
  };

  if (loading) return <div className="p-8 text-center text-text-main/50">Carregando...</div>;

  return (
    <div className="animate-fade-in-left">
      <div className="mb-6">
        <h3 className="text-[19px] font-bold text-[#8b6131] mb-2">Práticas Diárias (Fixas)</h3>
        <p className="text-[13px] text-text-muted mb-4 leading-relaxed">
          Hábitos espirituais para manter todos os dias durante toda a jornada.
        </p>

        <div className="space-y-3">
          <label className="flex items-start gap-4 p-4 rounded-xl border border-accent/20 bg-bg-card/50 cursor-pointer active:scale-[0.99] transition-transform">
            <input 
              type="checkbox" 
              checked={practices.tsd_done}
              onChange={() => togglePractice("tsd_done")}
              disabled={saving}
              className="mt-1 w-5 h-5 accent-accent rounded-sm focus:ring-accent"
            />
            <div>
              <span className="block font-bold text-text-main">Tempo a Sós com Deus (TSD)</span>
              <span className="text-[13px] text-text-muted">15 min de oração + 15 min de leitura bíblica.</span>
            </div>
          </label>

          <label className="flex items-start gap-4 p-4 rounded-xl border border-accent/20 bg-bg-card/50 cursor-pointer active:scale-[0.99] transition-transform">
            <input 
              type="checkbox" 
              checked={practices.intercession_done}
              onChange={() => togglePractice("intercession_done")}
              disabled={saving}
              className="mt-1 w-5 h-5 accent-accent rounded-sm focus:ring-accent"
            />
            <div>
              <span className="block font-bold text-text-main">5 Pessoas em Oração</span>
              <span className="text-[13px] text-text-muted">Oração intercessória diária pelas 5 pessoas do seu PDD.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-[19px] font-bold text-[#8b6131] mb-2">Prática da Estação</h3>
        <p className="text-[13px] text-text-muted mb-4 leading-relaxed">
          Desafio específico desta etapa para você realizar durante a semana.
        </p>

        <label className="flex items-start gap-4 p-4 rounded-xl border border-[#8b6131]/30 bg-accent/10 cursor-pointer active:scale-[0.99] transition-transform">
          <input 
            type="checkbox" 
            checked={practices.specific_practice_done}
            onChange={() => togglePractice("specific_practice_done")}
            disabled={saving}
            className="mt-1 w-5 h-5 accent-[#8b6131] rounded-sm focus:ring-[#8b6131]"
          />
          <div>
            <span className="block font-bold text-[#8b6131]">{stage?.title}</span>
            <span className="text-[14px] text-text-main/90 font-medium leading-tight">{getSpecificPracticeLabel()}</span>
          </div>
        </label>
      </div>
    </div>
  );
}
