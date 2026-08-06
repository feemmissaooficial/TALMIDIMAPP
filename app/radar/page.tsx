"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { radarAreas } from "./data";
import { ChevronRight, Target, Info, ShieldAlert } from "lucide-react";

export default function RadarPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number[]>>({});
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }
      setUserId(session.user.id);
      
      // Initialize scores state ONLY if empty
      setScores(prev => {
        if (Object.keys(prev).length > 0) return prev;
        const initialScores: Record<string, number[]> = {};
        radarAreas.forEach(area => {
          initialScores[area.id] = new Array(5).fill(-1);
        });
        return initialScores;
      });
    };
    checkSession();
  }, [router, supabase.auth]);

  const currentArea = radarAreas[currentAreaIndex];
  const currentScores = scores[currentArea?.id] || [];
  const isAreaComplete = currentScores.length > 0 && currentScores.every(score => score !== -1);

  const handleScore = (questionIndex: number, score: number) => {
    setScores(prev => ({
      ...prev,
      [currentArea.id]: prev[currentArea.id].map((s, i) => i === questionIndex ? score : s)
    }));
  };

  const handleBack = () => {
    if (currentAreaIndex > 0) {
      setCurrentAreaIndex(prev => prev - 1);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  };

  const handleNext = async () => {
    if (currentAreaIndex < radarAreas.length - 1) {
      setCurrentAreaIndex(prev => prev + 1);
      // Rolar pro topo já no próximo frame — chamar antes do reflow (ex.:
      // logo após o setState, no mesmo tick) às vezes não tinha efeito em
      // alguns navegadores/WebViews. requestAnimationFrame garante que o
      // scroll acontece depois que a nova área já foi desenhada na tela.
      requestAnimationFrame(() => window.scrollTo(0, 0));
    } else {
      // Save to Supabase
      setSaving(true);
      const totalScores: Record<string, number> = {};
      
      radarAreas.forEach(area => {
        const sum = scores[area.id].reduce((a, b) => a + (b === -1 ? 0 : b), 0);
        totalScores[`score_${area.id}`] = sum;
      });

      if (userId) {
        const { error } = await supabase.from("user_radars").insert({
          user_id: userId,
          ...totalScores
        });
        
        if (error) {
          alert("Erro ao salvar no banco de dados: " + error.message + "\nVocê rodou o radar_setup.sql no Supabase?");
          setSaving(false);
          return;
        }
      }

      router.push("/radar/result");
    }
  };

  if (!mounted || !currentArea) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#111812] text-[#fdfaf6] font-sans flex flex-col items-center justify-center p-6">
        <div className="max-w-[500px] w-full text-center space-y-6">
          <div className="w-16 h-16 bg-[#c69b5c]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target size={32} className="text-[#c69b5c]" />
          </div>
          <h1 className="text-[28px] font-serif font-bold text-[#eaddc5] leading-tight">
            Antes de iniciar a jornada
          </h1>
          <div className="bg-[#1f2620] p-6 rounded-2xl border border-[#c69b5c]/20 text-left space-y-4">
            <p className="text-[#eaddc5]/80 text-[16px] leading-relaxed">
              O Radar Discipular não é uma prova espiritual, nem um instrumento de comparação com outras pessoas. Ele é, antes de tudo, um <strong>retrato</strong> — uma fotografia do momento atual da sua caminhada com Deus.
            </p>
            <p className="text-[#eaddc5]/80 text-[16px] leading-relaxed">
              Ele não aponta culpa, mas direção. Não encerra o processo, mas abre caminho para decisões conscientes.
            </p>
            <p className="text-[#eaddc5]/80 text-[16px] leading-relaxed">
              A autoavaliação será fiel na medida em que pontuar levando em consideração seu <strong>comportamento real e não o ideal</strong>, ou seja, aquilo que faz e não aquilo que gostaria de ser ou fazer.
            </p>
          </div>
          <button
            onClick={() => {
              setShowIntro(false);
              requestAnimationFrame(() => window.scrollTo(0, 0));
            }}
            className="w-full bg-[#c69b5c] hover:bg-[#b38a53] text-[#111812] py-4 rounded-[16px] font-bold text-[18px] transition-all flex items-center justify-center gap-2 mt-8"
          >
            Estou pronto
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const scoreOptions = [
    { val: 0, label: "0 - nunca fiz" },
    { val: 1, label: "1 - já fiz, mas hoje não" },
    { val: 2, label: "2 - faço de vez em quando" },
    { val: 3, label: "3 - sempre" }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#243525] font-sans pb-24">
      {/* Header Premium */}
      <div className="bg-[#111812] text-white pt-6 pb-4 px-6 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[18px] font-serif font-bold text-[#eaddc5]">Radar Discipular</h1>
          <div className="text-[11px] font-bold tracking-widest text-[#c69b5c] uppercase">
            Área {currentAreaIndex + 1} de {radarAreas.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#d5b080] to-[#c69b5c] h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentAreaIndex) / radarAreas.length) * 100}%` }}
          />
        </div>
        <h2 className="text-[20px] font-bold mt-4 text-[#fdfaf6]">{currentArea.name}</h2>
      </div>

      <div className="px-6 pt-8 max-w-[600px] mx-auto space-y-6">
        <div className="bg-[#eaddc5]/20 border border-[#c69b5c]/20 rounded-xl p-4 flex gap-3 items-start mb-6">
          <ShieldAlert className="text-[#c69b5c] shrink-0 mt-0.5" size={20} />
          <p className="text-[14px] text-[#3b5238] leading-relaxed font-medium">
            Seja extremamente honesto. Avalie cada afirmação considerando seu <strong>comportamento atual</strong> e não o seu desejo.
          </p>
        </div>

        {currentArea.questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white border border-[#eaddc5] rounded-[16px] p-6 shadow-sm">
            <p className="text-[16px] font-medium text-[#1f3020] mb-5 leading-relaxed">
              {qIndex + 1}. {question}
            </p>
            <div className="flex flex-col gap-2">
              {scoreOptions.map(option => {
                const isSelected = currentScores[qIndex] === option.val;
                return (
                  <button
                    key={option.val}
                    type="button"
                    onClick={() => handleScore(qIndex, option.val)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-[15px] transition-all border-2 
                      ${isSelected 
                        ? "bg-[#111812] text-[#c69b5c] border-[#111812] shadow-md" 
                        : "bg-[#fdfaf6] text-[#666666] border-[#eaddc5] hover:border-[#c69b5c]/50 hover:bg-white"
                      }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full max-w-[420px] left-1/2 -translate-x-1/2 bg-gradient-to-t from-[#fdfaf6] via-[#fdfaf6] to-transparent pt-12 pb-6 px-6 z-20">
        <div className="w-full mx-auto flex gap-3">
          {currentAreaIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="px-5 py-4 rounded-[16px] font-bold border-2 border-[#111812]/20 text-[#111812] disabled:opacity-50"
            >
              Voltar
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isAreaComplete || saving}
            className="flex-1 bg-[#111812] hover:bg-[#243525] text-white py-4 rounded-[16px] font-bold shadow-[0_10px_25px_rgba(17,24,18,0.2)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
          >
            {saving ? "Salvando..." : (currentAreaIndex < radarAreas.length - 1 ? "Próxima Área" : "Ver Meu Radar")}
            {!saving && <ChevronRight size={20} className="text-[#c69b5c]" />}
          </button>
        </div>
      </div>
    </div>
  );
}
