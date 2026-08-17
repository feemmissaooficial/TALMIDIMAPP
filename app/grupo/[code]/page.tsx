"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { radarAreas } from "../../radar/data";
import { ChevronRight, ShieldAlert, Target } from "lucide-react";

type Stage = "loading" | "invalid" | "name" | "quiz" | "result";

export default function GrupoParticipantePage() {
  const params = useParams();
  const code = String(params.code || "");
  const supabase = createClient();

  const [stage, setStage] = useState<Stage>("loading");
  const [groupName, setGroupName] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number[]>>({});
  const [saving, setSaving] = useState(false);
  const [finalScores, setFinalScores] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const check = async () => {
      const { data, error } = await supabase.rpc("get_radar_group_by_code", { p_code: code });
      if (error || !data || data.length === 0) {
        setStage("invalid");
        return;
      }
      setGroupName(data[0].name);
      const initialScores: Record<string, number[]> = {};
      radarAreas.forEach(area => {
        initialScores[area.id] = new Array(area.questions.length).fill(-1);
      });
      setScores(initialScores);
      setStage("name");
    };
    check();
  }, [code, supabase]);

  const currentArea = radarAreas[currentAreaIndex];
  const currentScores = scores[currentArea?.id] || [];
  const isAreaComplete = currentScores.length > 0 && currentScores.every(s => s !== -1);

  const handleScore = (qIndex: number, score: number) => {
    setScores(prev => ({
      ...prev,
      [currentArea.id]: prev[currentArea.id].map((s, i) => i === qIndex ? score : s)
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
      requestAnimationFrame(() => window.scrollTo(0, 0));
      return;
    }

    setSaving(true);
    const scoresPayload: Record<string, number> = {};
    const orderedScores: number[] = [];
    radarAreas.forEach(area => {
      const sum = scores[area.id].reduce((a, b) => a + (b === -1 ? 0 : b), 0);
      scoresPayload[area.id] = sum;
      orderedScores.push(sum);
    });
    const total = orderedScores.reduce((a, b) => a + b, 0);

    const { error } = await supabase.rpc("submit_radar_group_response", {
      p_code: code,
      p_name: participantName.trim(),
      p_scores: scoresPayload,
      p_total: total
    });

    setSaving(false);
    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    setFinalScores(orderedScores);
    setTotalScore(total);
    setStage("result");
  };

  if (stage === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (stage === "invalid") {
    return (
      <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-[16px]">Este link de turma não foi encontrado. Confira com quem te enviou.</p>
      </div>
    );
  }

  if (stage === "name") {
    return (
      <div className="min-h-screen bg-[#111812] text-[#fdfaf6] font-sans flex flex-col items-center justify-center p-6">
        <div className="max-w-[440px] w-full text-center space-y-6">
          <div className="w-16 h-16 bg-[#c69b5c]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target size={32} className="text-[#c69b5c]" />
          </div>
          <h1 className="text-[24px] font-serif font-bold text-[#eaddc5]">{groupName}</h1>
          <p className="text-[#eaddc5]/70 text-[15px] leading-relaxed">
            Você vai responder ao Radar Discipular. Seja honesto com o seu comportamento real, considerando os <strong>últimos dois anos</strong>. No fim, você vê o seu gráfico na hora.
          </p>
          <div className="text-left">
            <label className="block text-[13px] text-white font-medium mb-2">Seu nome</label>
            <input
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full bg-[#1f2620] border border-[#c69b5c]/20 rounded-xl p-3.5 text-[15px] text-[#eaddc5] placeholder:text-[#eaddc5]/30 focus:outline-none focus:border-[#c69b5c]/50"
            />
          </div>
          <button
            onClick={() => participantName.trim() && setStage("quiz")}
            disabled={!participantName.trim()}
            className="w-full bg-[#c69b5c] hover:bg-[#b38a53] text-[#111812] py-4 rounded-[16px] font-bold text-[17px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Começar <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const scoreOptions = [
      { val: 0, label: "0 - nunca fiz" },
      { val: 1, label: "1 - já fiz, mas hoje não" },
      { val: 2, label: "2 - faço de vez em quando" },
      { val: 3, label: "3 - sempre" }
    ];

    return (
      <div className="min-h-screen bg-[#fdfaf6] text-[#243525] font-sans pb-24">
        <div className="bg-[#111812] text-white pt-6 pb-4 px-6 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[18px] font-serif font-bold text-[#eaddc5]">{groupName}</h1>
            <div className="text-[11px] font-bold tracking-widest text-[#c69b5c] uppercase">
              Área {currentAreaIndex + 1} de {radarAreas.length}
            </div>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#d5b080] to-[#c69b5c] h-full transition-all duration-500 ease-out"
              style={{ width: `${(currentAreaIndex / radarAreas.length) * 100}%` }}
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

  // stage === "result"
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const maxScore = 15;
  const angles = Array.from({ length: 7 }).map((_, i) => (i * 2 * Math.PI) / 7 - Math.PI / 2);
  const getPoint = (angle: number, r: number) => ({ x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) });
  const gridLevels = [1, 2, 3, 4, 5];
  const dataPoints = finalScores.map((score, i) => getPoint(angles[i], (score / maxScore) * radius));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] flex flex-col items-center pb-16 font-sans">
      <div className="w-full bg-[#111812] pt-12 pb-8 px-6 text-center border-b border-[#c69b5c]/10">
        <h1 className="text-[24px] font-serif font-bold text-white mb-1">Seu Radar</h1>
        <p className="text-[#eaddc5]/70 text-[14px]">{participantName} · {groupName}</p>
        <div className="mt-6 inline-flex flex-col items-center bg-[#c69b5c]/10 border border-[#c69b5c]/30 rounded-2xl px-6 py-3">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#c69b5c] mb-1">Pontuação Total</span>
          <span className="text-[32px] font-bold text-white leading-none">{totalScore}</span>
          <span className="text-[12px] text-[#eaddc5]/50 mt-1">de 105 possíveis</span>
        </div>
      </div>

      <div className="w-full max-w-[500px] px-6 mt-8 flex flex-col items-center">
        <div className="relative w-full aspect-square max-w-[350px] mb-8">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
            {gridLevels.map(level => {
              const r = (level / 5) * radius;
              const points = angles.map(angle => getPoint(angle, r));
              const polygon = points.map(p => `${p.x},${p.y}`).join(" ");
              return <polygon key={level} points={polygon} fill="none" stroke="#2a302a" strokeWidth="1" />;
            })}
            {angles.map((angle, i) => {
              const p = getPoint(angle, radius);
              return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#2a302a" strokeWidth="1" />;
            })}
            <polygon points={dataPolygon} fill="#c69b5c" fillOpacity="0.3" stroke="#c69b5c" strokeWidth="2" strokeLinejoin="round" />
            {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#c69b5c" />)}
            {angles.map((angle, i) => {
              const p = getPoint(angle, radius + 25);
              const name = radarAreas[i].name.split(" ");
              return (
                <text key={i} x={p.x} y={p.y} textAnchor="middle" alignmentBaseline="middle" fill="#eaddc5" fontSize="10" fontWeight="bold" className="opacity-90">
                  <tspan x={p.x} dy="-0.5em">{name[0]}</tspan>
                  {name.length > 1 && <tspan x={p.x} dy="1.2em">{name.slice(1).join(" ")}</tspan>}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="w-full bg-[#111812] border border-[#2a302a] rounded-[24px] p-6 mb-8">
          <h3 className="text-[14px] font-bold text-[#c69b5c] uppercase tracking-widest mb-6 border-b border-[#2a302a] pb-4">Detalhamento</h3>
          <div className="space-y-4">
            {radarAreas.map((area, i) => {
              const score = finalScores[i];
              const percentage = (score / maxScore) * 100;
              return (
                <div key={area.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[14px] font-medium text-white">{area.name}</span>
                    <span className="text-[13px] font-bold text-[#eaddc5]/80">{score}/15</span>
                  </div>
                  <div className="w-full bg-[#0a0f0a] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#d5b080] to-[#c69b5c] h-full rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[13px] text-[#eaddc5]/50 text-center">Seu resultado já foi enviado. Pode fechar esta página.</p>
      </div>
    </div>
  );
}
