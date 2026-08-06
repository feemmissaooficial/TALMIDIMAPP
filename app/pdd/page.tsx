"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { radarAreas } from "../radar/data";
import { BookOpen, Check, PenTool } from "lucide-react";

export default function PDDPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [actionPlan, setActionPlan] = useState("");
  const [partner, setPartner] = useState("");
  const [signature, setSignature] = useState("");
  // Horário do TSD registrado aqui vira, automaticamente, o horário do
  // lembrete diário (mesma chave que a tela de Configurações já lê) —
  // pedido do Nilton: em vez da pessoa configurar de novo em outro lugar,
  // o horário que ela já disse que separa pra Deus vira a notificação.
  const [tsdTime, setTsdTime] = useState("06:30");
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }
      setUserId(session.user.id);
      
      // Verifica se já preencheu PDD
      const { data } = await supabase
        .from("user_pdds")
        .select("id")
        .eq("user_id", session.user.id)
        .single();
        
      if (data) {
        // Já tem PDD, vai pro Dashboard (ou Map)
        router.push("/");
      }
    };
    init();
  }, [router]);

  const toggleArea = (areaId: string) => {
    setSelectedAreas(prev => {
      if (prev.includes(areaId)) {
        return prev.filter(id => id !== areaId);
      } else {
        if (prev.length >= 2) return prev; // max 2
        return [...prev, areaId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedAreas.length === 0 || !actionPlan.trim() || !signature.trim()) return;
    
    setSaving(true);
    if (userId) {
      await supabase.from("user_pdds").insert({
        user_id: userId,
        priority_areas: selectedAreas.join(","),
        action_plan: actionPlan,
        accountability_partner: partner,
        digital_signature: signature
      });
    }

    // Salva o horário escolhido como o horário do lembrete diário (a tela
    // de Configurações já lê essa mesma chave do localStorage).
    localStorage.setItem("talmidim_tsd_time", tsdTime);

    // Celebra o início da jornada (tela 9 da Fase 0) antes de cair no mapa
    router.push("/onboarding/pronto");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  const isValid = selectedAreas.length > 0 && actionPlan.trim() !== "" && signature.trim() !== "";

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#243525] font-sans pb-24">
      {/* Header Premium */}
      <div className="bg-[#111812] text-white pt-12 pb-8 px-6 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[20px] font-serif font-bold text-[#eaddc5]">PDD Digital</h1>
        </div>
        <h2 className="text-[24px] font-bold text-[#fdfaf6] leading-tight mb-2">Plano de Desenvolvimento</h2>
        <p className="text-[#eaddc5]/70 text-[14px]">Assuma um compromisso de crescimento intencional para as próximas semanas.</p>
      </div>

      <div className="px-6 pt-8 max-w-[600px] mx-auto space-y-8">
        {/* Enquadramento do conceito (ET-003, tela 7): o PDD é seu, o app só
            apresenta a ideia e te ajuda a registrar — não escreve por você. */}
        <p className="text-[13px] text-[#888888] italic leading-relaxed -mt-2">
          O Plano de Desenvolvimento Discipular (PDD) é uma ferramenta pessoal de reflexão e planejamento — ele pertence exclusivamente a você. O Talmidim não cria nem orienta seu PDD; sua função é apenas te ajudar a registrar, diante de Deus, um compromisso intencional com seu crescimento espiritual.
        </p>

        {/* Passo 1 */}
        <div className="bg-white border border-[#eaddc5] rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#111812] text-[#c69b5c] flex items-center justify-center font-bold">1</div>
            <h3 className="text-[16px] font-bold text-[#1f3020]">Escolha seu foco</h3>
          </div>
          <p className="text-[14px] text-[#888888] mb-5">Com base no seu Radar, selecione 1 ou 2 áreas que você deseja priorizar.</p>
          
          <div className="grid grid-cols-1 gap-3">
            {radarAreas.map(area => {
              const isSelected = selectedAreas.includes(area.id);
              return (
                <button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  className={`flex items-center justify-between p-4 rounded-[12px] border transition-all text-left
                    ${isSelected 
                      ? "bg-[#fcf9f2] border-[#c69b5c] shadow-[0_4px_12px_rgba(198,155,92,0.15)]" 
                      : "bg-white border-[#eaddc5] hover:border-[#c69b5c]/50"}`}
                >
                  <span className={`text-[15px] font-medium ${isSelected ? "text-[#b58b54]" : "text-[#243525]"}`}>
                    {area.name}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border
                    ${isSelected ? "bg-[#c69b5c] border-[#c69b5c]" : "border-[#eaddc5]"}`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Passo 2 */}
        <div className="bg-white border border-[#eaddc5] rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#111812] text-[#c69b5c] flex items-center justify-center font-bold">2</div>
            <h3 className="text-[16px] font-bold text-[#1f3020]">Plano de Ação</h3>
          </div>
          <p className="text-[14px] text-[#888888] mb-4">O que você fará de prático nesta semana para crescer nessas áreas?</p>
          
          <textarea
            value={actionPlan}
            onChange={e => setActionPlan(e.target.value)}
            placeholder="Ex: Vou acordar 15 min mais cedo para ler a Palavra, e vou convidar meu vizinho para um café..."
            className="w-full min-h-[120px] bg-[#fdfaf6] border border-[#eaddc5] rounded-[12px] p-4 text-[#243525] placeholder:text-[#888888]/60 focus:outline-none focus:border-[#c69b5c] focus:ring-1 focus:ring-[#c69b5c]/50 resize-none"
          />

          <p className="text-[14px] text-[#888888] mb-2 mt-6">A que horas você vai separar pro seu Tempo a Sós com Deus?</p>
          <input
            type="time"
            value={tsdTime}
            onChange={e => setTsdTime(e.target.value)}
            className="w-full bg-[#fdfaf6] border border-[#eaddc5] rounded-[12px] p-4 text-[#243525] font-bold text-center text-[18px] focus:outline-none focus:border-[#c69b5c] focus:ring-1 focus:ring-[#c69b5c]/50 mb-1"
          />
          <p className="text-[11px] text-[#888888] mb-6">Esse horário vira seu lembrete diário automaticamente.</p>

          <p className="text-[14px] text-[#888888] mb-2 mt-2">Com quem você vai compartilhar esse alvo? (Accountability Partner)</p>
          <input
            type="text"
            value={partner}
            onChange={e => setPartner(e.target.value)}
            placeholder="Nome do seu parceiro de jornada"
            className="w-full bg-[#fdfaf6] border border-[#eaddc5] rounded-[12px] p-4 text-[#243525] placeholder:text-[#888888]/60 focus:outline-none focus:border-[#c69b5c] focus:ring-1 focus:ring-[#c69b5c]/50"
          />
        </div>

        {/* Passo 3 - Assinatura */}
        <div className="bg-[#111812] text-white border border-[#c69b5c]/30 rounded-[20px] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <PenTool size={100} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-[18px] font-serif font-bold text-[#eaddc5] mb-2">Termo de Compromisso</h3>
            <p className="text-[14px] text-[#eaddc5]/70 italic mb-6 leading-relaxed">
              "Entrega o teu caminho ao Senhor; confia nele, e ele o fará." — Salmos 37:5<br/><br/>
              Eu me comprometo a ser intencional na minha jornada de discipulado, buscando ser um imitador de Cristo em todas as áreas da minha vida.
            </p>
            
            <input
              type="text"
              value={signature}
              onChange={e => setSignature(e.target.value)}
              placeholder="Assine seu nome aqui"
              className="w-full bg-[#0a0f0a] border-b-2 border-dashed border-[#c69b5c]/50 p-3 text-center text-[#c69b5c] font-serif italic text-[20px] focus:outline-none focus:border-[#c69b5c] transition-all placeholder:text-[#c69b5c]/30"
            />
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full max-w-[420px] left-1/2 -translate-x-1/2 bg-gradient-to-t from-[#fdfaf6] via-[#fdfaf6] to-transparent pt-12 pb-6 px-6 z-20">
        <div className="w-full mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!isValid || saving}
            className="w-full bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812] py-4 rounded-[16px] font-bold shadow-[0_10px_25px_rgba(198,155,92,0.2)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
          >
            {saving ? "Confirmando..." : "Firmar Compromisso"}
          </button>
        </div>
      </div>
    </div>
  );
}
