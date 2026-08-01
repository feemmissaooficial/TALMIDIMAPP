"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getStage, stageOrder, badgeNames } from "./data";
import { createClient } from "../utils/supabase/client";
import BottomNav from "./components/BottomNav";

// Numeração exibida em cada estação (estação 1 = base, estação 7 = topo)
const stageNumbers: Record<string, string> = {
  house: "01",
  street: "02",
  clinic: "03",
  office: "04",
  construction: "05",
  rooftop: "06",
  city: "07",
};

// As fotos (public/mapa-jornada/*-smoke.png) já vêm com as bordas dissolvendo em
// fumaça — nenhuma forma geométrica corta a imagem. Proporção do arquivo: 1000x720.
const IMG_RATIO = 1000 / 720;
const PANEL_W_PCT = 70; // largura do painel de foto, em % do container
const OVERLAP = 0.16; // sobreposição leve entre um painel e o próximo
const TOP_PAD = 30;
const BOTTOM_PAD = 110; // espaço para não ficar atrás da barra inferior

type Point = { x: number; y: number };

// Catmull-Rom -> Bézier: gera uma curva suave passando por todos os pontos,
// retornando um "d" por segmento (permite estilizar/animar cada trecho).
function buildSmoothSegments(points: Point[]): string[] {
  const segments: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    segments.push(
      `M ${p1.x},${p1.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
    );
  }
  return segments;
}

const CONTAINER_W = 420; // largura de referência do shell do app

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [userName, setUserName] = useState("Peregrino");
  const [justAdvanced, setJustAdvanced] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  // dia (1-21) de CADA estação, não só da atual — necessário porque, no
  // modelo de estações sobrepostas, mais de uma pode estar em prática ao
  // mesmo tempo (dia 8-20) enquanto outra já está no conteúdo (dia 1-7).
  const [dayByStage, setDayByStage] = useState<Record<string, number>>({});
  const currentStationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/start");
        return;
      }

      const profile = session.user?.user_metadata?.profile;
      if (!profile) {
        router.push("/start");
        return;
      }
      setGender(profile === "female" ? "female" : "male");

      const fullName = session.user?.user_metadata?.full_name || session.user?.user_metadata?.name;
      if (fullName) setUserName(String(fullName).split(" ")[0]);

      // Verificar se preencheu o Radar Discipular
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

      // Verificar se assinou o PDD
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

      // Buscar progresso no banco
      const { data } = await supabase
        .from("user_stage_unlocks")
        .select("current_stage_index")
        .eq("user_id", session.user.id)
        .single();

      let resolvedIndex = 0;
      if (data) {
        resolvedIndex = data.current_stage_index;
        setCurrentStageIndex(resolvedIndex);
        localStorage.setItem("talmidim-progress", resolvedIndex.toString());
      } else {
        // Se não existir, tenta ler o local
        const saved = localStorage.getItem("talmidim-progress");
        if (saved !== null) {
          resolvedIndex = Number(saved);
          setCurrentStageIndex(resolvedIndex);
        }
      }

      // Buscar em que dia (1-21) a pessoa está em CADA estação já
      // desbloqueada — necessário pra saber quais estão em prática
      // contínua (dia 8-20) e quais já concluíram (dia 21), já que agora
      // várias estações podem estar ativas ao mesmo tempo.
      const { data: allDaysData } = await supabase
        .from("user_daily_progress")
        .select("stage_id, day_index")
        .eq("user_id", session.user.id)
        .in("stage_id", stageOrder);

      const dayMap: Record<string, number> = {};
      (allDaysData || []).forEach((row) => {
        dayMap[row.stage_id] = row.day_index;
      });
      setDayByStage(dayMap);

      if (resolvedIndex < stageOrder.length) {
        const dayForCurrent = dayMap[stageOrder[resolvedIndex]];
        if (dayForCurrent) setCurrentDay(dayForCurrent);
      }

      // Se a estação atual avançou desde a última vez que o mapa foi visto
      // (ex: acabou de ganhar a insígnia e voltou pro mapa), o cartão de
      // embarque no topo recebe um destaque — tipo "carimbo" de passagem
      // liberada para a próxima estação.
      const lastSeenRaw = localStorage.getItem("talmidim-last-seen-stage");
      if (lastSeenRaw !== null && Number(lastSeenRaw) < resolvedIndex) {
        setJustAdvanced(true);
        setTimeout(() => setJustAdvanced(false), 2600);
      }
      localStorage.setItem("talmidim-last-seen-stage", resolvedIndex.toString());

      setLoading(false);
      // Pequeno atraso para disparar a animação de entrada do percurso
      setTimeout(() => setRevealed(true), 80);
    };
    checkAuth();
  }, [router]);

  // Ao entrar/voltar no mapa, rola automaticamente até a estação atual do
  // usuário — em vez de sempre cair no topo da página (que é a estação 7).
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      currentStationRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
    }, 50);
    return () => clearTimeout(t);
  }, [loading, currentStageIndex]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center"
        style={{ background: "linear-gradient(180deg, #243525 0%, #16210f 100%)" }}
      >
        <div className="w-full max-w-[420px] min-h-screen flex flex-col gap-4 justify-center items-center">
          <div className="w-9 h-9 border-4 border-[#eaddc5]/25 border-t-[#c69b5c] rounded-full animate-spin"></div>
          <p className="text-[#eaddc5]/70 text-sm tracking-wide">Preparando sua jornada...</p>
        </div>
      </div>
    );
  }

  const panelW = CONTAINER_W * (PANEL_W_PCT / 100);
  const panelH = panelW / IMG_RATIO;
  const step = panelH * (1 - OVERLAP);

  // Todas as 7 estações aparecem na página, do início — as ainda não
  // alcançadas ficam em cinza/bloqueadas (com cadeado), igual sempre foi.
  const n = stageOrder.length;
  const totalHeight = TOP_PAD + (n - 1) * step + panelH + BOTTOM_PAD;

  const anchor = (index: number) => {
    const bleedRight = index % 2 === 0; // 01,03,05,07 = foto à direita
    const panelTopPx = totalHeight - BOTTOM_PAD - panelH - index * step;
    const centerXPct = bleedRight ? 100 - PANEL_W_PCT * 0.3 : PANEL_W_PCT * 0.3;
    return { topPx: panelTopPx, bleedRight, x: centerXPct, y: panelTopPx + panelH / 2 };
  };

  const points: Point[] = stageOrder.map((_, i) => {
    const a = anchor(i);
    return { x: a.x, y: a.y };
  });
  const segments = buildSmoothSegments(points);

  const totalStages = stageOrder.length;
  const currentStageId = stageOrder[currentStageIndex];
  // Jornada só termina de verdade quando a ÚLTIMA estação chega no dia 21
  // (conquista) — não mais quando currentStageIndex "passa do fim", porque
  // agora ele avança no dia 7 (marco), não no dia 21.
  const lastStageId = stageOrder[totalStages - 1];
  const journeyComplete = (dayByStage[lastStageId] || 0) >= 21;
  const fromTitle =
    currentStageIndex === 0 ? "Início" : getStage(stageOrder[currentStageIndex - 1])?.title || "Início";
  const toTitle = journeyComplete ? "Jornada concluída" : getStage(currentStageId)?.title || "Próxima estação";
  const ticketNumber = `EST ${String(Math.min(currentStageIndex + 1, totalStages)).padStart(2, "0")}`;
  const stageLabel = `${String(Math.min(currentStageIndex + 1, totalStages)).padStart(2, "0")}/${String(totalStages).padStart(2, "0")}`;
  const dayLabel = journeyComplete ? "21/21" : `${currentDay}/21`;
  // Progresso geral soma os dias de TODAS as estações já iniciadas (não só
  // a atual), porque com prática contínua várias avançam ao mesmo tempo.
  const totalDaysDone = stageOrder.reduce((sum, id) => sum + Math.min(dayByStage[id] || 0, 21), 0);
  const totalProgressPct = Math.round((totalDaysDone / (totalStages * 21)) * 100);
  const badgeReady = journeyComplete;

  return (
    <div className="min-h-screen flex justify-center bg-black text-white">
      <div className="w-full max-w-[420px] bg-neutral-900">
        <div
          className="relative w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(120% 55% at 50% 0%, #f2e4c4 0%, #e8d4a2 45%, #dcc282 100%)",
          }}
        >
          {/* CARTÃO DE EMBARQUE — bilhete de trem de verdade: faixa colorida
              com o código, Nome/Perfil, De/Para, linha de corte com furos, e
              uma barra funcional embaixo (Estação, Dia, Progresso, Insígnia). */}
          <div
            className="relative"
            style={{
              animation: justAdvanced ? "ticketGlow 1.3s ease-in-out 2" : undefined,
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{ background: "#243525", padding: "12px 20px" }}
            >
              <span
                className="font-bold uppercase"
                style={{ color: "#fdfaf6", fontSize: 12, letterSpacing: "0.05em" }}
              >
                Passagem da jornada
              </span>
              <span
                className="rounded"
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "#fdfaf6",
                  background: "#ffffff22",
                  padding: "4px 9px",
                }}
              >
                {ticketNumber}
              </span>
            </div>

            <div className="px-5 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div style={{ flex: 1 }}>
                  <p
                    className="uppercase tracking-widest"
                    style={{ fontSize: 8, color: "#8b613199", margin: 0 }}
                  >
                    Nome do viajante
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#243525", margin: "3px 0 0" }}>
                    {userName}
                  </p>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <p
                    className="uppercase tracking-widest"
                    style={{ fontSize: 8, color: "#8b613199", margin: 0 }}
                  >
                    Perfil
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#243525", margin: "3px 0 0" }}>
                    Jornada Discipular
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-3.5">
                <div style={{ flex: 1 }}>
                  <p
                    className="uppercase tracking-widest"
                    style={{ fontSize: 8, color: "#8b613199", margin: 0 }}
                  >
                    De
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#243525", margin: "3px 0 0" }}>
                    {fromTitle}
                  </p>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <p
                    className="uppercase tracking-widest"
                    style={{ fontSize: 8, color: "#8b613199", margin: 0 }}
                  >
                    Para
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#243525", margin: "3px 0 0" }}>
                    {toTitle}
                  </p>
                </div>
              </div>

              {/* linha de corte — furos nas bordas (cor do fundo escuro por
                  trás) cortados pela metade pelo overflow-hidden do cartão */}
              <div className="relative mt-3.5" style={{ height: 20, marginLeft: -20, marginRight: -20 }}>
                <span
                  className="absolute rounded-full"
                  style={{
                    left: 0,
                    top: -2,
                    width: 24,
                    height: 24,
                    transform: "translateX(-50%)",
                    background: "#171717",
                  }}
                />
                <span
                  className="absolute rounded-full"
                  style={{
                    right: 0,
                    top: -2,
                    width: 24,
                    height: 24,
                    transform: "translateX(50%)",
                    background: "#171717",
                  }}
                />
                <div
                  className="absolute"
                  style={{ left: 18, right: 18, top: 9, borderTop: "2px dashed #4a3c2299" }}
                />
              </div>

              {/* barra funcional — estação, dia, progresso geral e status da insígnia */}
              <div className="flex" style={{ padding: "14px 0 16px" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <p className="uppercase tracking-widest" style={{ fontSize: 8, color: "#8b613199", margin: 0 }}>
                    Estação
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#243525", margin: "3px 0 0" }}>
                    {stageLabel}
                  </p>
                </div>
                <div style={{ flex: 1, textAlign: "center", borderLeft: "1px solid #8b613133" }}>
                  <p className="uppercase tracking-widest" style={{ fontSize: 8, color: "#8b613199", margin: 0 }}>
                    Dia
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#243525", margin: "3px 0 0" }}>
                    {dayLabel}
                  </p>
                </div>
                <div style={{ flex: 1, textAlign: "center", borderLeft: "1px solid #8b613133" }}>
                  <p className="uppercase tracking-widest" style={{ fontSize: 8, color: "#8b613199", margin: 0 }}>
                    Progresso
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#243525", margin: "3px 0 0" }}>
                    {totalProgressPct}%
                  </p>
                </div>
                <div style={{ flex: 1, textAlign: "center", borderLeft: "1px solid #8b613133" }}>
                  <p className="uppercase tracking-widest" style={{ fontSize: 8, color: "#8b613199", margin: 0 }}>
                    Insígnia
                  </p>
                  <span style={{ fontSize: 13, marginTop: 3, display: "inline-block", color: "#8b6131" }}>
                    {badgeReady ? "✓" : "🔒"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lembrete elegante de quanto falta pra próxima insígnia (pedido
              do Nilton) — some sozinho quando a jornada já foi concluída. */}
          {!journeyComplete && (
            <p
              className="text-center uppercase tracking-widest"
              style={{ fontFamily: "monospace", fontSize: 9, color: "#8b6131cc", margin: "10px 0 0" }}
            >
              {21 - currentDay <= 0
                ? `Insígnia "${badgeNames[currentStageId] || "desta estação"}" liberada!`
                : `Faltam ${21 - currentDay} dia${21 - currentDay === 1 ? "" : "s"} para a insígnia "${badgeNames[currentStageId] || "desta estação"}"`}
            </p>
          )}

          {justAdvanced && (
            <span
              className="absolute uppercase font-bold"
              style={{
                top: -10,
                right: 16,
                zIndex: 20,
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.06em",
                color: "#fdfaf6",
                background: "linear-gradient(90deg, #b58b54, #8b6131)",
                padding: "5px 10px",
                borderRadius: 999,
                animation: "stampInOut 2.4s ease forwards",
                pointerEvents: "none",
              }}
            >
              Embarque liberado
            </span>
          )}

          <div
            className="relative w-full overflow-hidden"
            style={{ height: totalHeight }}
          >
          {/* PERCURSO (linha serpenteante e brilhante — as fotos cobrem por cima,
              deixando a linha aparecer só onde a foto já dissolveu em fumaça) */}
          <svg
            className="absolute inset-0"
            width="100%"
            height={totalHeight}
            viewBox={`0 0 100 ${totalHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGold" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#b58b54" />
                <stop offset="100%" stopColor="#fdf0d5" />
              </linearGradient>
              <filter id="pathGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {segments.map((d, i) => {
              const traveled = i < currentStageIndex; // trecho já percorrido
              return (
                <path
                  key={i}
                  d={d}
                  pathLength={100}
                  fill="none"
                  stroke={traveled ? "url(#pathGold)" : "#a08654"}
                  strokeOpacity={traveled ? 1 : 0.45}
                  strokeWidth={traveled ? 2.6 : 1.3}
                  strokeLinecap="round"
                  strokeDasharray={traveled ? "100" : "1 1.4"}
                  filter="url(#pathGlow)"
                  style={{
                    strokeDashoffset: revealed ? 0 : 100,
                    transition: `stroke-dashoffset 1.2s cubic-bezier(0.25,1,0.5,1) ${0.15 + i * 0.18}s`,
                  }}
                />
              );
            })}
          </svg>

          {/* ESTAÇÕES — as 7 aparecem desde o início; as ainda não
              alcançadas ficam em cinza/bloqueadas com cadeado. */}
          {stageOrder.map((id, index) => {
            const { topPx, bleedRight } = anchor(index);
            const isLocked = index > currentStageIndex;
            const isCurrent = index === currentStageIndex;
            // Estação que já passou do dia 7 mas ainda não chegou no 21:
            // conteúdo liberado, prática contínua rolando em paralelo com a
            // estação mais nova. Estação com dia >= 21: insígnia já conquistada.
            const stageDay = dayByStage[id] || 0;
            const isCompleted = !isLocked && stageDay >= 21;
            const isInPractice = !isLocked && !isCompleted && index !== currentStageIndex && stageDay >= 8;
            const imgSrc = `/mapa-jornada/${gender}-${id}-smoke.png`;
            const title = getStage(id)?.title || "";

            return (
              <div
                key={id}
                ref={isCurrent ? currentStationRef : undefined}
                className="absolute w-full"
                style={{
                  top: topPx,
                  height: panelH,
                  opacity: revealed ? 1 : 0,
                  animation: revealed
                    ? `panelIn 0.8s cubic-bezier(0.25,1,0.5,1) ${0.2 + index * 0.16}s both`
                    : undefined,
                }}
              >
                {/* painel de foto — sem borda, sem forma, dissolve em fumaça nas bordas */}
                <button
                  onClick={() => !isLocked && router.push(`/stage/${id}`)}
                  disabled={isLocked}
                  className="absolute z-10"
                  style={{
                    top: 0,
                    height: panelH,
                    width: `${PANEL_W_PCT}%`,
                    left: bleedRight ? undefined : 0,
                    right: bleedRight ? 0 : undefined,
                    cursor: isLocked ? "default" : "pointer",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-full"
                    style={{
                      objectFit: "contain",
                      filter: isLocked ? "grayscale(70%) brightness(0.8)" : "none",
                      opacity: isLocked ? 0.65 : 1,
                      animation: isCurrent ? "glowPulse 2.4s ease-in-out infinite" : undefined,
                      transition: "filter 0.6s ease, opacity 0.6s ease",
                    }}
                  />
                  {isLocked && (
                    <span
                      className="absolute flex items-center justify-center rounded-full text-xs"
                      style={{
                        top: "42%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 30,
                        height: 30,
                        background: "rgba(36,53,37,0.6)",
                        color: "#eaddc5",
                      }}
                    >
                      🔒
                    </span>
                  )}
                  {isCompleted && (
                    <span
                      className="absolute flex items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        top: 8,
                        right: bleedRight ? undefined : 8,
                        left: bleedRight ? 8 : undefined,
                        width: 26,
                        height: 26,
                        background: "linear-gradient(135deg, #fdfaf6, #c69b5c)",
                        color: "#243525",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  {isInPractice && (
                    <span
                      className="absolute uppercase font-bold tracking-widest"
                      style={{
                        bottom: 8,
                        right: bleedRight ? undefined : 8,
                        left: bleedRight ? 8 : undefined,
                        fontSize: 8,
                        color: "#fdfaf6",
                        background: "rgba(36,53,37,0.75)",
                        padding: "3px 7px",
                        borderRadius: 999,
                      }}
                    >
                      Praticando · {stageDay}/21
                    </span>
                  )}
                </button>

                {/* número + título, colados na borda da foto correspondente
                    (antes ficavam alinhados para o lado de fora, longe da
                    foto — corrigido para ficarem coladinhos nela). */}
                <div
                  className="absolute flex flex-col justify-center"
                  style={{
                    top: 0,
                    height: panelH,
                    width: `${100 - PANEL_W_PCT}%`,
                    left: bleedRight ? 0 : undefined,
                    right: bleedRight ? undefined : 0,
                    textAlign: bleedRight ? "right" : "left",
                    paddingLeft: bleedRight ? 4 : 10,
                    paddingRight: bleedRight ? 10 : 4,
                    opacity: isLocked ? 0.55 : 1,
                  }}
                >
                  <span
                    className="leading-none tracking-tight"
                    style={{ fontSize: 20, color: "#243525", fontWeight: 800 }}
                  >
                    {stageNumbers[id]}
                  </span>
                  <span
                    className="uppercase font-bold tracking-wide mt-1.5"
                    style={{ fontSize: 10, color: "#4a3c22", lineHeight: 1.25 }}
                  >
                    {title}
                  </span>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <BottomNav />

      <style>{`
        @keyframes panelIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0px rgba(198,155,92,0)); }
          50% { filter: brightness(1.08) drop-shadow(0 0 16px rgba(198,155,92,0.55)); }
        }
        @keyframes ticketGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(198,155,92,0); }
          50% { box-shadow: 0 0 24px 4px rgba(198,155,92,0.55); }
        }
        @keyframes stampInOut {
          0% { opacity: 0; transform: scale(0.7) rotate(-6deg); }
          15% { opacity: 1; transform: scale(1.06) rotate(-3deg); }
          25% { transform: scale(1) rotate(-3deg); }
          78% { opacity: 1; }
          100% { opacity: 0; transform: scale(1) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}
