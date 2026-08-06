"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { radarAreas } from "../data";
import { generateDiagnostico } from "../diagnostico";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function RadarResultPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [previousScores, setPreviousScores] = useState<number[] | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [previousTotal, setPreviousTotal] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchRadar = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }
      
      const { data } = await supabase
        .from("user_radars")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (data && data.length > 0) {
        setHistory(data);
        
        // Latest score
        const latestData = data[0];
        const areaScores = radarAreas.map(area => latestData[`score_${area.id}`] || 0);
        setScores(areaScores);
        setTotalScore(areaScores.reduce((a, b) => a + b, 0));
        
        // If there's history, get the oldest one to compare (or the immediate previous)
        // Usually you compare current with the oldest (baseline) or previous. Let's compare with baseline (oldest)
        if (data.length > 1) {
          const baselineData = data[data.length - 1]; // oldest
          const oldScores = radarAreas.map(area => baselineData[`score_${area.id}`] || 0);
          setPreviousScores(oldScores);
          setPreviousTotal(oldScores.reduce((a, b) => a + b, 0));
        }
      } else {
        alert("Nenhum radar encontrado no banco de dados. Redirecionando para o início.");
        router.push("/radar");
      }
    };
    fetchRadar();
  }, [router, supabase]);

  if (!mounted || scores.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  const scoresById: Record<string, number> = {};
  radarAreas.forEach((area, i) => { scoresById[area.id] = scores[i] || 0; });
  const diagnostico = generateDiagnostico(scoresById);

  // SVG Math for 7-axis radar chart
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const angles = Array.from({ length: 7 }).map((_, i) => (i * 2 * Math.PI) / 7 - Math.PI / 2);

  const getPoint = (angle: number, r: number) => {
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Grid lines
  const gridLevels = [1, 2, 3, 4, 5];
  
  // Data polygon (Latest)
  const maxScore = 15;
  const dataPoints = scores.map((score, i) => getPoint(angles[i], (score / maxScore) * radius));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  // Old Data polygon (Baseline)
  const oldDataPoints = previousScores ? previousScores.map((score, i) => getPoint(angles[i], (score / maxScore) * radius)) : null;
  const oldDataPolygon = oldDataPoints ? oldDataPoints.map(p => `${p.x},${p.y}`).join(" ") : null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] flex flex-col items-center pb-24 font-sans">
      <div className="w-full bg-[#111812] pt-12 pb-8 px-6 text-center border-b border-[#c69b5c]/10">
        <h1 className="text-[28px] font-serif font-bold text-white mb-2">Seu Radar</h1>
        <p className="text-[#eaddc5]/70 text-[14px]">
          {previousScores ? "Veja a sua evolução comparada ao seu primeiro radar." : "Diagnóstico da sua vida espiritual hoje."}
        </p>
        {!previousScores && (
          <p className="text-[#eaddc5]/50 text-[12px] italic mt-2 max-w-[320px] mx-auto leading-relaxed">
            Este resultado representa apenas seu ponto de partida. Todo discípulo está em processo de crescimento — receba este diagnóstico como um convite para caminhar com perseverança.
          </p>
        )}

        <div className="mt-6 inline-flex flex-col items-center bg-[#c69b5c]/10 border border-[#c69b5c]/30 rounded-2xl px-6 py-3">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#c69b5c] mb-1">Pontuação Total</span>
          <div className="flex items-end gap-2">
            <span className="text-[32px] font-bold text-white leading-none">{totalScore}</span>
            {previousTotal !== null && (
              <span className={`text-[16px] font-bold pb-1 ${totalScore >= previousTotal ? "text-green-500" : "text-red-400"}`}>
                {totalScore >= previousTotal ? "+" : ""}{totalScore - previousTotal}
              </span>
            )}
          </div>
          <span className="text-[12px] text-[#eaddc5]/50 mt-1">de 105 possíveis</span>
        </div>
      </div>

      <div className="w-full max-w-[500px] px-6 mt-8 flex flex-col items-center animate-in zoom-in-95 duration-1000">
        
        {/* Radar Chart */}
        <div className="relative w-full aspect-square max-w-[350px] mb-8">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
            {/* Grid */}
            {gridLevels.map(level => {
              const r = (level / 5) * radius;
              const points = angles.map(angle => getPoint(angle, r));
              const polygon = points.map(p => `${p.x},${p.y}`).join(" ");
              return (
                <polygon key={level} points={polygon} fill="none" stroke="#2a302a" strokeWidth="1" />
              );
            })}
            
            {/* Axes */}
            {angles.map((angle, i) => {
              const p = getPoint(angle, radius);
              return (
                <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#2a302a" strokeWidth="1" />
              );
            })}

            {/* Old Data Polygon (Baseline) */}
            {oldDataPolygon && (
              <polygon 
                points={oldDataPolygon} 
                fill="none" 
                stroke="#666666" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                strokeLinejoin="round" 
              />
            )}

            {/* Data Polygon */}
            <polygon 
              points={dataPolygon} 
              fill="#c69b5c" 
              fillOpacity="0.3" 
              stroke="#c69b5c" 
              strokeWidth="2" 
              strokeLinejoin="round" 
            />
            
            {/* Data points */}
            {dataPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill="#c69b5c" />
            ))}

            {/* Labels */}
            {angles.map((angle, i) => {
              // Push text slightly further out
              const p = getPoint(angle, radius + 25);
              const name = radarAreas[i].name.split(" ");
              return (
                <text 
                  key={i} 
                  x={p.x} 
                  y={p.y} 
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                  fill="#eaddc5"
                  fontSize="10"
                  fontWeight="bold"
                  className="opacity-90"
                >
                  <tspan x={p.x} dy="-0.5em">{name[0]}</tspan>
                  {name.length > 1 && <tspan x={p.x} dy="1.2em">{name.slice(1).join(" ")}</tspan>}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Detailed Scores */}
        <div className="w-full bg-[#111812] border border-[#2a302a] rounded-[24px] p-6 mb-8">
          <h3 className="text-[14px] font-bold text-[#c69b5c] uppercase tracking-widest mb-6 border-b border-[#2a302a] pb-4">Detalhamento</h3>
          <div className="space-y-4">
            {radarAreas.map((area, i) => {
              const score = scores[i];
              const previousScore = previousScores ? previousScores[i] : null;
              const delta = previousScore !== null ? score - previousScore : 0;
              
              const percentage = (score / maxScore) * 100;
              return (
                <div key={area.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[14px] font-medium text-white">{area.name}</span>
                    <div className="flex items-center gap-2">
                      {previousScore !== null && delta !== 0 && (
                        <span className={`text-[12px] font-bold ${delta > 0 ? "text-green-500" : "text-red-400"}`}>
                          {delta > 0 ? "+" : ""}{delta}
                        </span>
                      )}
                      <span className="text-[13px] font-bold text-[#eaddc5]/80">{score}/15</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#0a0f0a] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#d5b080] to-[#c69b5c] h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DIAGNÓSTICO REAL — não é o gráfico, é a leitura das combinações
            entre áreas, adaptada diretamente do capítulo "Radar Discipular"
            do livro (não é texto genérico). */}
        <div className="w-full bg-[#111812] border border-[#2a302a] rounded-[24px] p-6 mb-8">
          <h3 className="text-[14px] font-bold text-[#c69b5c] uppercase tracking-widest mb-2 border-b border-[#2a302a] pb-4">Seu diagnóstico</h3>

          <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#eaddc5]/50 mb-2">Pontos mais fortes</span>
              <ul className="space-y-1">
                {diagnostico.pontosFortes.map((n) => (
                  <li key={n} className="text-[13px] text-white font-medium">{n}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#eaddc5]/50 mb-2">Pontos mais fracos</span>
              <ul className="space-y-1">
                {diagnostico.pontosFracos.map((n) => (
                  <li key={n} className="text-[13px] text-white font-medium">{n}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {diagnostico.combinacoes.map((insight) => (
              <div key={insight.titulo} className="border-t border-[#2a302a] pt-4">
                <h4 className="text-[14px] font-bold text-white mb-1.5">{insight.titulo}</h4>
                <p className="text-[13px] text-[#eaddc5]/80 leading-relaxed">{insight.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* REFLEXÃO — etapa Radar -> Diagnóstico -> Reflexão -> PDD.
            Perguntas adaptadas das perguntas de reflexão do livro. Salva
            local (sem precisar de tabela nova no banco). */}
        <div className="w-full bg-[#111812] border border-[#2a302a] rounded-[24px] p-6 mb-8">
          <h3 className="text-[14px] font-bold text-[#c69b5c] uppercase tracking-widest mb-4 border-b border-[#2a302a] pb-4">Reflexão</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-[13px] text-white font-medium mb-2">Dentre seus pontos fortes e fracos, qual mais te surpreendeu ou incomodou — positiva ou negativamente? Por quê?</label>
              <textarea
                defaultValue={typeof window !== "undefined" ? localStorage.getItem("talmidim-radar-reflexao-1") || "" : ""}
                onChange={(e) => localStorage.setItem("talmidim-radar-reflexao-1", e.target.value)}
                className="w-full min-h-[80px] bg-[#0a0f0a] border border-[#2a302a] rounded-xl p-3 text-[13px] text-[#eaddc5] placeholder:text-[#eaddc5]/30 focus:outline-none focus:border-[#c69b5c]/50 resize-none"
                placeholder="Escreva aqui..."
              />
            </div>
            <div>
              <label className="block text-[13px] text-white font-medium mb-2">Olhando o diagnóstico como um todo, o que você reconhece de si mesmo nele?</label>
              <textarea
                defaultValue={typeof window !== "undefined" ? localStorage.getItem("talmidim-radar-reflexao-2") || "" : ""}
                onChange={(e) => localStorage.setItem("talmidim-radar-reflexao-2", e.target.value)}
                className="w-full min-h-[80px] bg-[#0a0f0a] border border-[#2a302a] rounded-xl p-3 text-[13px] text-[#eaddc5] placeholder:text-[#eaddc5]/30 focus:outline-none focus:border-[#c69b5c]/50 resize-none"
                placeholder="Escreva aqui..."
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/pdd/intro")}
          className="w-full bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812] py-4 rounded-[16px] font-bold shadow-[0_10px_25px_rgba(198,155,92,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Criar meu PDD Digital <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
