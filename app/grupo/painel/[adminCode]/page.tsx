"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { radarAreas } from "../../../radar/data";
import { Users } from "lucide-react";

type ResponseRow = {
  participant_name: string;
  scores: Record<string, number>;
  total_score: number;
  created_at: string;
};

export default function PainelTurmaPage() {
  const params = useParams();
  const adminCode = String(params.adminCode || "");
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [participantLink, setParticipantLink] = useState("");
  const [responses, setResponses] = useState<ResponseRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: info, error: infoError } = await supabase.rpc("get_radar_group_info_by_admin", { p_admin_code: adminCode });
      if (infoError || !info || info.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setGroupName(info[0].name);
      setParticipantLink(`${window.location.origin}/grupo/${info[0].code}`);

      const { data: resp } = await supabase.rpc("get_radar_group_responses_by_admin", { p_admin_code: adminCode });
      setResponses(resp || []);
      setLoading(false);
    };
    load();
  }, [adminCode, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-[16px]">Painel não encontrado. Confira o link.</p>
      </div>
    );
  }

  const count = responses.length;
  const averages = radarAreas.map(area => {
    if (count === 0) return 0;
    const sum = responses.reduce((acc, r) => acc + (r.scores[area.id] || 0), 0);
    return Math.round((sum / count) * 10) / 10;
  });
  const averageTotal = count === 0 ? 0 : Math.round((responses.reduce((acc, r) => acc + r.total_score, 0) / count) * 10) / 10;

  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const maxScore = 15;
  const angles = Array.from({ length: 7 }).map((_, i) => (i * 2 * Math.PI) / 7 - Math.PI / 2);
  const getPoint = (angle: number, r: number) => ({ x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) });
  const gridLevels = [1, 2, 3, 4, 5];
  const dataPoints = averages.map((score, i) => getPoint(angles[i], (score / maxScore) * radius));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] flex flex-col items-center pb-16 font-sans">
      <div className="w-full bg-[#111812] pt-12 pb-8 px-6 text-center border-b border-[#c69b5c]/10">
        <div className="w-14 h-14 bg-[#c69b5c]/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Users size={26} className="text-[#c69b5c]" />
        </div>
        <h1 className="text-[24px] font-serif font-bold text-white mb-1">{groupName}</h1>
        <p className="text-[#eaddc5]/70 text-[14px]">{count} {count === 1 ? "resposta" : "respostas"}</p>
        <div className="mt-6 inline-flex flex-col items-center bg-[#c69b5c]/10 border border-[#c69b5c]/30 rounded-2xl px-6 py-3">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#c69b5c] mb-1">Média da Turma</span>
          <span className="text-[32px] font-bold text-white leading-none">{averageTotal}</span>
          <span className="text-[12px] text-[#eaddc5]/50 mt-1">de 105 possíveis</span>
        </div>
      </div>

      <div className="w-full max-w-[500px] px-6 mt-8 flex flex-col items-center">
        {count === 0 ? (
          <div className="w-full bg-[#111812] border border-[#2a302a] rounded-[24px] p-6 text-center">
            <p className="text-[14px] text-[#eaddc5]/70 mb-3">Ninguém respondeu ainda.</p>
            <p className="text-[12px] text-[#eaddc5]/50 break-all">{participantLink}</p>
          </div>
        ) : (
          <>
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
              <h3 className="text-[14px] font-bold text-[#c69b5c] uppercase tracking-widest mb-6 border-b border-[#2a302a] pb-4">Média por área</h3>
              <div className="space-y-4">
                {radarAreas.map((area, i) => {
                  const percentage = (averages[i] / maxScore) * 100;
                  return (
                    <div key={area.id}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[14px] font-medium text-white">{area.name}</span>
                        <span className="text-[13px] font-bold text-[#eaddc5]/80">{averages[i]}/15</span>
                      </div>
                      <div className="w-full bg-[#0a0f0a] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#d5b080] to-[#c69b5c] h-full rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full bg-[#111812] border border-[#2a302a] rounded-[24px] p-6 mb-8">
              <h3 className="text-[14px] font-bold text-[#c69b5c] uppercase tracking-widest mb-4 border-b border-[#2a302a] pb-4">Respostas por pessoa</h3>
              <div className="divide-y divide-[#2a302a]">
                {responses.map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-3">
                    <span className="text-[14px] text-white font-medium">{r.participant_name}</span>
                    <span className="text-[13px] font-bold text-[#c69b5c]">{r.total_score}/105</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
