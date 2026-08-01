"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import { Trophy, Lock, Leaf, Compass, Flame, Heart, Hammer, Eye, Crown, Bell, X, Star } from "lucide-react";
import { getStage, stageOrder } from "../data";

type Badge = {
  badge_id: string;
  unlocked_at: string;
};

const badgeNames: Record<string, string> = {
  house: "A Semente",
  street: "O Caminho",
  clinic: "A Cura",
  office: "A Vocação",
  construction: "A Edificação",
  rooftop: "A Visão",
  city: "O Cidadão",
  // Insígnia final — não é o prêmio de uma estação, é o selo de quem
  // percorreu as 7 e perseverou nas práticas até o fim. Ideia do Nilton:
  // o objetivo não é colecionar insígnias, é vestir o caráter de Cristo.
  talmid: "Insígnia Talmid"
};

const badgeContents: Record<string, string> = {
  house: "Concluir esta primeira estação é um passo importante na sua jornada. Não porque você tenha alcançado perfeição, mas porque decidiu priorizar sua vida com Deus. O TSD (Tempo a Sós com Deus) não é mais uma tarefa, é o seu fundamento.",
  street: "Com o evangelho no centro, a casa deixa de ser apenas convivência e se torna espaço de formação, cuidado e testemunho. A fé que não transforma as relações em casa, ainda não começou de verdade.",
  clinic: "A fé que se torna missão transforma não apenas outros — transforma você. Cada oração feita, cada conversa iniciada já é parte do mover do Reino. Você é um embaixador da reconciliação.",
  office: "Quando caminhamos com misericórdia, o evangelho deixa de ser apenas anunciado e passa a ser percebido. Pessoas veem Cristo através de suas atitudes compassivas e graciosas.",
  construction: "Administrar à luz do senhorio de Cristo torna a vida mais leve, mais coerente e mais frutífera. Tudo o que temos foi confiado por Ele para glória dEle.",
  rooftop: "Você não foi chamado para competir, impressionar ou se destacar, mas para ser fiel onde Deus o colocou. A fidelidade no oculto precede a frutificação no visível.",
  city: "A fé cristã foi pensada para ser vivida em companhia. Em comunidade aprendemos a amar, perdoar, servir, crescer e permanecer. Você não foi chamado para andar sozinho.",
  talmid: "Você não colecionou sete emblemas. Você percorreu sete estações, perseverou nas práticas diárias e concluiu seu Plano de Desenvolvimento Discipular. Talmid significa discípulo — e essa insígnia não celebra ter terminado um curso, celebra ter perseverado num processo de transformação."
};

const badgeIcons: Record<string, React.ElementType> = {
  house: Leaf,
  street: Compass,
  clinic: Flame,
  office: Heart,
  construction: Hammer,
  rooftop: Eye,
  city: Crown,
  talmid: Star
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchBadges = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }

      const { data } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", session.user.id);

      if (data) {
        setUnlockedBadges(data.map(b => b.badge_id));
      }
      setLoading(false);
    };
    fetchBadges();
  }, [router, supabase.auth]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalUnlocked = unlockedBadges.length;
  const totalAvailable = stageOrder.length;

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] font-sans pb-32 relative">
      
      {/* Header */}
      <div className="pt-12 pb-8 px-6 border-b border-[#c69b5c]/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a201c] to-[#0a0f0a]">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="text-[#c69b5c]" size={28} />
            <h1 className="text-[28px] font-serif font-bold text-white">Conquistas</h1>
          </div>
          <button 
            onClick={() => router.push("/settings")}
            className="w-10 h-10 bg-[#111812] rounded-full flex items-center justify-center border border-[#c69b5c]/20 active:scale-95 transition-all"
          >
            <Bell size={18} className="text-[#c69b5c]" />
          </button>
        </div>
        
        <p className="text-[#eaddc5]/70 text-[14px]">Sua prateleira de insígnias e vitórias na Jornada.</p>
        
        <div className="mt-8 bg-[#111812] border border-[#c69b5c]/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#c69b5c] uppercase mb-1">Progresso Global</div>
            <div className="text-white font-medium">{totalUnlocked} de {totalAvailable} Estações</div>
          </div>
          <div className="text-[24px] font-bold text-[#c69b5c]">
            {Math.round((totalUnlocked / totalAvailable) * 100)}%
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="px-6 pt-8 max-w-[600px] mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {stageOrder.map((stageId) => {
            const isUnlocked = unlockedBadges.includes(stageId);
            const stageInfo = getStage(stageId);
            const badgeName = badgeNames[stageId] || stageInfo?.title;
            const BadgeIcon = badgeIcons[stageId] || Trophy;
            
            return (
              <div 
                key={stageId} 
                onClick={() => { if(isUnlocked) setSelectedBadge(stageId); }}
                className={`relative aspect-[4/5] rounded-[24px] border flex flex-col items-center justify-center p-4 transition-all duration-500 overflow-hidden cursor-pointer
                  ${isUnlocked 
                    ? "bg-[#111812] border-[#c69b5c]/40 shadow-[0_10px_30px_rgba(198,155,92,0.1)] active:scale-95" 
                    : "bg-[#111812]/50 border-white/5 opacity-70 grayscale"
                  }`}
              >
                {/* Visual SVG Badge Coin */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center relative mb-4 shadow-xl transition-all duration-700
                  ${isUnlocked ? "bg-gradient-to-br from-[#fdfaf6] via-[#d5b080] to-[#b38a53] scale-110" : "bg-[#1f2620] scale-90"}
                `}>
                  {/* Inner ring */}
                  <div className={`absolute inset-1 rounded-full border-2 
                    ${isUnlocked ? "border-[#111812]/20" : "border-black/40"}`}>
                  </div>
                  
                  <BadgeIcon 
                    size={32} 
                    className={isUnlocked ? "text-[#111812]" : "text-white/20"} 
                  />
                  
                  {!isUnlocked && (
                    <div className="absolute bottom-1 right-1 bg-[#0a0f0a] rounded-full p-1 border border-white/10">
                      <Lock size={10} className="text-white/40" />
                    </div>
                  )}
                </div>
                
                <h3 className={`text-[15px] font-bold text-center leading-tight mb-1
                  ${isUnlocked ? "text-white" : "text-white/40"}`}>
                  {badgeName}
                </h3>
                <p className="text-[11px] uppercase tracking-wider text-[#c69b5c] text-center font-bold">
                  {stageInfo?.title}
                </p>
                
                {/* Glow se desbloqueado */}
                {isUnlocked && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#c69b5c]/20 blur-2xl rounded-full pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* INSÍGNIA TALMID — não é o prêmio de uma estação, é o selo final
            de quem completou as 7 e perseverou nas práticas até o fim. */}
        {(() => {
          const isTalmidUnlocked = totalUnlocked === totalAvailable;
          return (
            <div
              onClick={() => { if (isTalmidUnlocked) setSelectedBadge("talmid"); }}
              className={`relative rounded-[24px] border flex items-center gap-4 p-5 mt-4 transition-all duration-500 overflow-hidden
                ${isTalmidUnlocked
                  ? "bg-gradient-to-r from-[#1a201c] to-[#111812] border-[#c69b5c]/50 shadow-[0_10px_30px_rgba(198,155,92,0.15)] cursor-pointer active:scale-[0.98]"
                  : "bg-[#111812]/50 border-white/5 opacity-70 grayscale cursor-default"
                }`}
            >
              <div className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center relative shadow-xl
                ${isTalmidUnlocked ? "bg-gradient-to-br from-[#fdfaf6] via-[#d5b080] to-[#b38a53]" : "bg-[#1f2620]"}`}
              >
                <Star size={28} className={isTalmidUnlocked ? "text-[#111812]" : "text-white/20"} />
                {!isTalmidUnlocked && (
                  <div className="absolute bottom-0 right-0 bg-[#0a0f0a] rounded-full p-1 border border-white/10">
                    <Lock size={10} className="text-white/40" />
                  </div>
                )}
              </div>
              <div>
                <h3 className={`text-[16px] font-bold leading-tight ${isTalmidUnlocked ? "text-white" : "text-white/40"}`}>
                  Insígnia Talmid
                </h3>
                <p className="text-[12px] text-[#eaddc5]/60 mt-0.5">
                  {isTalmidUnlocked ? "Concedida a quem concluiu toda a jornada" : "Conclua as 7 estações para desbloquear"}
                </p>
              </div>
              {isTalmidUnlocked && (
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c69b5c]/20 blur-2xl rounded-full pointer-events-none"></div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Modal para Insígnia */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#111812] border border-[#c69b5c]/30 rounded-3xl p-8 max-w-[400px] w-full text-center relative shadow-2xl">
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            {(() => {
              const BadgeIcon = badgeIcons[selectedBadge] || Trophy;
              return (
                <>
                  <div className="w-24 h-24 bg-gradient-to-br from-[#fdfaf6] via-[#d5b080] to-[#b38a53] rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 border-4 border-[#111812]">
                    <div className="absolute inset-1 rounded-full border border-[#111812]/20 m-2 pointer-events-none"></div>
                    <BadgeIcon size={40} className="text-[#111812]" />
                  </div>
                  
                  <h2 className="text-2xl font-serif font-bold text-white mb-2">
                    {badgeNames[selectedBadge]}
                  </h2>
                  <p className="text-[#c69b5c] text-sm uppercase tracking-widest font-bold mb-6">
                    {selectedBadge === "talmid" ? "Jornada completa" : getStage(selectedBadge)?.title}
                  </p>
                  
                  <div className="text-[#eaddc5]/80 text-[15px] leading-relaxed text-left border-t border-[#c69b5c]/20 pt-6">
                    {badgeContents[selectedBadge]}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className="w-full mt-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    Fechar
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
