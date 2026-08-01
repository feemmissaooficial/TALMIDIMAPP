"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { Users, Target, Activity, ArrowLeft, BarChart3, ShieldCheck } from "lucide-react";
import { radarAreas } from "../radar/data";

export default function PastorDashboard() {
  const router = useRouter();
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Dashboard Data
  const [isPastor, setIsPastor] = useState(false);
  const [totalDisciples, setTotalDisciples] = useState(0);
  const [prayerTargetsCount, setPrayerTargetsCount] = useState(0);
  const [averageRadar, setAverageRadar] = useState<number[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    setMounted(true);
    const fetchDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }
      
      const userId = session.user.id;

      // 1. Check Role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (!roleData || roleData.role !== 'pastor') {
        // Not a pastor - gracefully deny access
        alert("Acesso Negado: Apenas líderes e pastores têm acesso a este painel.");
        router.push("/dashboard");
        return;
      }
      
      setIsPastor(true);

      // 2. Fetch PDDs (Prayer targets) via Secure RPC
      const { data: disciplesCount } = await supabase.rpc("get_church_total_disciples");
      const { data: targetsCount } = await supabase.rpc("get_church_prayer_targets");
      
      setTotalDisciples(disciplesCount || 0);
      setPrayerTargetsCount(targetsCount || 0);

      // 3. Fetch Radars (Spiritual Health) via Secure RPC
      const { data: radarAvgData } = await supabase.rpc("get_church_average_radar");
      
      if (radarAvgData && radarAvgData.total_radars > 0) {
        const avgScores = [
          Math.round(radarAvgData.score_intimacy * 10) / 10,
          Math.round(radarAvgData.score_family * 10) / 10,
          Math.round(radarAvgData.score_evangelism * 10) / 10,
          Math.round(radarAvgData.score_compassion * 10) / 10,
          Math.round(radarAvgData.score_stewardship * 10) / 10,
          Math.round(radarAvgData.score_service * 10) / 10,
          Math.round(radarAvgData.score_communion * 10) / 10,
        ];
        
        setAverageRadar(avgScores);
        
        const totalSum = avgScores.reduce((a, b) => a + b, 0);
        setOverallScore(Math.round(totalSum));
      }

      setLoading(false);
    };
    
    fetchDashboard();
  }, [router, supabase]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-bg-main flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxScore = 15;

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans pb-24">
      {/* Header */}
      <div className="bg-bg-card pt-6 pb-4 px-6 sticky top-0 z-20 shadow-sm border-b border-accent/20 flex items-center justify-between">
        <button onClick={() => router.push("/")} className="text-accent p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-serif font-bold text-text-main">Painel do Pastor</h1>
        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
          <ShieldCheck size={16} className="text-accent" />
        </div>
      </div>

      <div className="px-6 mt-8">
        
        <div className="mb-8">
          <h2 className="text-[24px] font-bold font-serif text-text-main mb-2">Visão Geral da Igreja</h2>
          <p className="text-text-muted text-[14px]">Acompanhamento agregado do desenvolvimento discipular da sua comunidade.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
              <Users className="text-accent" size={20} />
            </div>
            <span className="text-[28px] font-black text-text-main leading-none mb-1">{totalDisciples}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Discípulos<br/>Ativos</span>
          </div>

          <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
              <Target className="text-accent" size={20} />
            </div>
            <span className="text-[28px] font-black text-text-main leading-none mb-1">{prayerTargetsCount}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Alvos de<br/>Oração</span>
          </div>
        </div>

        {/* Saúde Espiritual (Radar Médio) */}
        <div className="bg-bg-card border border-accent/20 rounded-3xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-accent/10 pb-4">
            <Activity className="text-accent" size={24} />
            <div>
              <h3 className="text-[16px] font-bold text-text-main uppercase tracking-wider">Saúde Espiritual</h3>
              <p className="text-[12px] text-text-muted">Média do Radar Discipular</p>
            </div>
          </div>

          {averageRadar.length > 0 ? (
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="inline-flex flex-col items-center bg-bg-main border border-accent/20 rounded-2xl px-6 py-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">Pontuação Média</span>
                  <span className="text-[32px] font-black text-accent leading-none">{overallScore}</span>
                  <span className="text-[10px] text-text-muted mt-1">de 105 possíveis</span>
                </div>
              </div>

              {radarAreas.map((area, i) => {
                const score = averageRadar[i];
                const percentage = (score / maxScore) * 100;
                return (
                  <div key={area.id}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[13px] font-medium text-text-main">{area.name}</span>
                      <span className="text-[12px] font-bold text-accent">{score}/15</span>
                    </div>
                    <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden border border-accent/10">
                      <div 
                        className="bg-accent h-full rounded-full opacity-80"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="mx-auto text-accent/30 mb-3" size={32} />
              <p className="text-text-muted text-[13px]">Nenhum dado de radar suficiente para gerar estatísticas da igreja ainda.</p>
            </div>
          )}
        </div>

        {/* Ações do Pastor */}
        <div className="space-y-3">
          <button className="w-full bg-bg-main border border-accent/30 text-text-main py-4 rounded-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Ver Lista de Membros
          </button>
          <button className="w-full bg-bg-main border border-accent/30 text-text-main py-4 rounded-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Gerenciar Liderança
          </button>
        </div>

      </div>
    </div>
  );
}
