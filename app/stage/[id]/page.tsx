"use client";

import { useEffect, useState, Suspense } from "react";
import { getStage, badgeNames } from "../../data";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import CompleteButton from "./CompleteButton";
import { createClient } from "../../../utils/supabase/client";
import PracticesTab, { GLOBAL_STAGE_KEY, todayEpochDay } from "./PracticesTab";
import ScoreTab from "./ScoreTab";

// Ícones SVG Simples
const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CompassIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.805-4.646m1.706 2.421c1.48-.556 2.55-1.91 2.705-3.528.156-1.618-.62-3.14-2.015-3.957M13.684 16.6l1.358-5.072m0 0L19.4 9.176l-4.358 1.943m0 0l-5.072 1.358M15.042 11.528c-.556-1.48-1.91-2.55-3.528-2.705-1.618-.156-3.14.62-3.957 2.015M11.528 8.823L9.176 4.464l1.943 4.358m0 0L12.472 13.9m0 0l2.225-2.51-4.646.805m2.421 1.706c-1.48.556-2.55 1.91-2.705 3.528-.156 1.618.62 3.14 2.015 3.957M12.472 13.9l-1.358 5.072m0 0L6.6 20.824l4.358-1.943m0 0l5.072-1.358M8.958 12.472c.556 1.48 1.91 2.55 3.528 2.705 1.618.156 3.14-.62 3.957-2.015M12.472 15.177l2.352 4.359-1.943-4.359m0 0L11.528 10.1m0 0L9.303 12.61l4.646-.805m-2.421-1.706c1.48-.556 2.55-1.91 2.705-3.528.156-1.618-.62-3.14-2.015-3.957M11.528 10.1l1.358-5.072m0 0L17.4 3.176l-4.358 1.943" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);

const PrayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.493 8.353l2.843-2.843a2.25 2.25 0 013.182 3.182l-2.121 2.121m-6.364 6.364l-2.121 2.121a2.25 2.25 0 01-3.182-3.182l2.843-2.843m6.364-6.364l5.303 5.303m-11.666 0l5.303-5.303" />
  </svg>
);

function StagePageContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Modo "rever": Nilton pediu que o usuário consiga voltar e reler um dia
  // já concluído (inclusive o Dia Zero, a introdução da Fase 0) sem mexer
  // no progresso real. Ativa via ?rever=N na URL.
  const reverParam = searchParams?.get("rever");
  const reviewDay = reverParam ? Number(reverParam) : null;
  const isReviewing = reviewDay !== null && !Number.isNaN(reviewDay) && reviewDay >= 1;
  
  const stage = getStage(id);
  const [dayIndex, setDayIndex] = useState<number>(1);
  const [profile, setProfile] = useState<string>("male");
  const [isLoading, setIsLoading] = useState(true);

  // Trava de avanço: só libera "Concluir" quando Conteúdo, Práticas e
  // Pontuação estiverem marcados para o dia/estação atual. Antes eram 3
  // abas separadas que a pessoa tinha que lembrar de visitar uma por uma —
  // pedido do Nilton (alinhado ao ET-011): tudo agora é um fluxo único,
  // Práticas e Pontuação entram como mais passos do mesmo carrossel.
  const [contentRead, setContentRead] = useState(false);
  const [practicesDone, setPracticesDone] = useState(false);
  const [scoreDone, setScoreDone] = useState(false);

  // Diário Espiritual do dia (documentos ET-004 em diante) — reaproveita a
  // mesma tabela do Diário geral (user_diary), só muda o rótulo dos campos
  // pelas perguntas específicas do dia. Nada novo no banco.
  const [diarioVivido, setDiarioVivido] = useState("");
  const [diarioDeusFalou, setDiarioDeusFalou] = useState("");
  const [diarioSaving, setDiarioSaving] = useState(false);
  const [diarioSaved, setDiarioSaved] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  // Passo-a-passo do conteúdo rico (ET-011: uma coisa por tela — Vídeo,
  // depois Artigo, depois Reflexão, etc. — não tudo empilhado junto).
  const [contentStep, setContentStep] = useState(0);
  // O Artigo em si também é um mini-carrossel (pedido do Nilton: "nem que
  // seja carrossel", em vez de um parágrafo só) — um cartão por frase,
  // terminando no link "Aprofunde-se" quando o dia tiver um.
  const [artigoSlide, setArtigoSlide] = useState(0);
  useEffect(() => {
    setContentStep(0);
    setArtigoSlide(0);
  }, [id, dayIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `talmidim-content-${id}-${dayIndex}`;
    setContentRead(localStorage.getItem(key) === "1");
  }, [id, dayIndex]);

  const checkCompletionStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // TSD e Intercessão agora são hábito diário único (linha "_global"
    // por dia do calendário) — só a prática específica da estação
    // continua guardada por estação/dia. Precisa ler as duas linhas.
    const [globalRes, stageRes] = await Promise.all([
      supabase
        .from("user_practices")
        .select("tsd_done, intercession_done")
        .eq("user_id", session.user.id)
        .eq("stage_id", GLOBAL_STAGE_KEY)
        .eq("day_number", todayEpochDay())
        .single(),
      supabase
        .from("user_practices")
        .select("specific_practice_done")
        .eq("user_id", session.user.id)
        .eq("stage_id", id)
        .eq("day_number", dayIndex)
        .single(),
    ]);

    setPracticesDone(
      !!globalRes.data?.tsd_done &&
        !!globalRes.data?.intercession_done &&
        !!stageRes.data?.specific_practice_done
    );

    const { data: scoreData } = await supabase
      .from("user_station_scores")
      .select("score")
      .eq("user_id", session.user.id)
      .eq("stage_id", id)
      .single();

    setScoreDone(!!scoreData && scoreData.score !== null && scoreData.score !== undefined);
  };

  useEffect(() => {
    checkCompletionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dayIndex, supabase]);

  const toggleContentRead = () => {
    if (typeof window === "undefined") return;
    const key = `talmidim-content-${id}-${dayIndex}`;
    const newValue = !contentRead;
    localStorage.setItem(key, newValue ? "1" : "0");
    setContentRead(newValue);
  };

  const canComplete = contentRead && practicesDone && scoreDone;

  const handleSaveDiario = async () => {
    if (!diarioVivido.trim() && !diarioDeusFalou.trim()) return;
    setDiarioSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("user_diary").insert({
        user_id: session.user.id,
        vivido_hoje: diarioVivido || "—",
        deus_falou: diarioDeusFalou || "—",
      });
    }
    setDiarioSaving(false);
    setDiarioSaved(true);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (!stage) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      let dbDay = null;

      if (session) {
        const profileStr = session.user?.user_metadata?.profile;
        if (profileStr) setProfile(profileStr);

        const { data } = await supabase
          .from('user_daily_progress')
          .select('day_index')
          .eq('user_id', session.user.id)
          .eq('stage_id', id)
          .single();
        
        if (data) {
          dbDay = data.day_index;
          localStorage.setItem(`talmidim-day-${id}`, dbDay.toString());
        }
      } else {
        const savedProfile = localStorage.getItem("talmidim-profile");
        if (savedProfile) setProfile(savedProfile);
      }

      if (dbDay) {
        setDayIndex(dbDay);
      } else {
        const savedDay = localStorage.getItem(`talmidim-day-${id}`);
        if (savedDay) {
          setDayIndex(Number(savedDay));
        } else {
          localStorage.setItem(`talmidim-day-${id}`, "1");
          setDayIndex(1);
        }
      }
      setIsLoading(false);
    };
    fetchProgress();
  }, [id, stage]);

  if (!stage) {
    notFound();
    return null;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#1a1a1a]" />;
  }

  const currentDayData = stage.days[dayIndex - 1];

  if (!currentDayData) {
    router.push("/");
    return null;
  }

  // Modo "rever" (pedido do Nilton): tela simples, só leitura, do dia já
  // concluído que o usuário escolheu reler — sem tabs, sem prática, sem
  // botão de concluir, pra não confundir com o dia de hoje.
  if (isReviewing) {
    const revisedDay = Math.min(reviewDay as number, dayIndex);
    const reviewedData = stage.days[revisedDay - 1];
    const reviewedAcaoLines = reviewedData ? reviewedData.acao.split("\n").filter((l) => l.trim().length > 0) : [];

    return (
      <div className="min-h-screen w-full flex justify-center bg-bg-main text-text-main font-sans">
        <div className="w-full max-w-[420px] px-6 pt-12 pb-16">
          <button
            onClick={() => router.push(`/stage/${id}`)}
            className="text-[13px] font-bold text-accent mb-6"
          >
            ← Voltar para hoje
          </button>

          <p className="text-[11px] font-bold tracking-widest text-accent uppercase mb-1">
            Revendo · {stage.title}
          </p>
          <h1 className="text-[22px] font-bold text-text-main mb-6">Dia {revisedDay}</h1>

          {reviewedData?.tema ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-[18px] font-bold text-[#8b6131] mb-1">{reviewedData.tema}</h3>
                {reviewedData.versiculo && (
                  <p className="text-[14px] italic text-text-main/70 border-l-2 border-accent pl-3 leading-relaxed">
                    {reviewedData.versiculo}
                  </p>
                )}
              </div>
              {reviewedData.artigoRico && (
                <div className="p-4 rounded-xl border border-accent/20 bg-bg-card/50">
                  <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-2">
                    Artigo · {reviewedData.artigoRico.titulo}
                  </span>
                  <p className="text-[14px] text-text-main/90 leading-relaxed">{reviewedData.artigoRico.texto}</p>
                </div>
              )}
              {reviewedData.reflexao && reviewedData.reflexao.length > 0 && (
                <div className="p-4 rounded-xl border border-accent/20 bg-bg-card/50">
                  <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-2">Reflexão Guiada</span>
                  <ul className="space-y-2">
                    {reviewedData.reflexao.map((q, i) => (
                      <li key={i} className="text-[14px] text-text-main/90 leading-relaxed flex gap-2">
                        <span className="text-accent">●</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {reviewedData.oracaoSugerida && (
                <div className="p-4 rounded-xl bg-[#8b6131]/10">
                  <span className="block text-[11px] uppercase tracking-wide text-[#8b6131] font-bold mb-2">Oração</span>
                  <p className="text-[14px] italic text-text-main/90 leading-relaxed">{reviewedData.oracaoSugerida}</p>
                </div>
              )}
            </div>
          ) : reviewedData ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-[17px] font-bold text-[#8b6131] mb-1">Ser</h3>
                <p className="text-[15px] text-text-main leading-relaxed">{reviewedData.confronto}</p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#8b6131] mb-1">Saber</h3>
                <p className="text-[14px] italic text-text-main/90 leading-relaxed">{reviewedData.direcao}</p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#8b6131] mb-1">Fazer</h3>
                <ul className="space-y-2">
                  {reviewedAcaoLines.map((line, i) => (
                    <li key={i} className="text-[14px] text-text-main/90 leading-relaxed flex gap-2">
                      <span className="text-accent">●</span> {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-text-muted text-[14px]">Esse dia ainda não foi encontrado.</p>
          )}
        </div>
      </div>
    );
  }

  const folderRealMap: Record<string, string> = {
    house: "intimidade",
    street: "familia",
    clinic: "evangelizacao",
    office: "compaixao",
    construction: "mordomia",
    rooftop: "servico",
    city: "comunhao"
  };

  const folder = folderRealMap[id];
  const currentDay = currentDayData.day;
  const imagePath = `/jornada-urbana/${profile}/${folder}/1-21/${currentDay}.png`;

  const acaoLines = currentDayData.acao.split('\n').filter((l: string) => l.trim().length > 0);

  const cleanTitle = stage.title.replace(/^\d+\.\s*/, '');
  const titleWords = cleanTitle.split(' ');
  const titleFirst = titleWords[0];
  const titleRest = titleWords.slice(1).join(' ');

  return (
    <>
      <style>{`
        @keyframes unroll {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-unroll {
          transform-origin: top;
          animation: unroll 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-fade-in-left {
          opacity: 0;
          animation: fade-in-left 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          animation-delay: 0.2s;
        }
      `}</style>
      <div className="relative min-h-screen w-full flex justify-center bg-bg-main text-text-main font-sans">
      
      {/* FIXED BACKGROUND IMAGE (Parallax Effect) */}
      <div className="fixed inset-0 w-full max-w-[420px] left-1/2 -translate-x-1/2 h-[100dvh] z-0 bg-black">
        <Image
          src={imagePath}
          alt="Ilustração do dia"
          fill
          className="object-cover object-top opacity-90"
          priority
        />
        {/* Dark subtle gradient at the very top to ensure text readability without washing out the image */}
        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-black/70 to-transparent" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 flex flex-col min-h-screen">
        
        {/* TOPO DIREITO: MARCADOR (BOOKMARK) */}
        <div className="absolute top-0 right-4 drop-shadow-[0_12px_15px_rgba(0,0,0,0.5)] z-30">
          <div 
            className="w-[115px] pt-10 pb-12 px-2 bg-gradient-to-b from-bg-main to-bg-main/95 backdrop-blur-xl flex flex-col items-center text-center animate-unroll"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 15px), 0 100%)' }}
          >
             <div className="relative w-[95px] h-[35px] mb-8 mt-0">
               {/* Reduzindo o scale para 1.7 e retornando o pt para 10 para alinhar com o coração sem esmagar o número */}
               <Image src="/logo.png" alt="Talmidim Logo" fill className="object-contain dark:invert opacity-90 scale-[1.7] origin-center" />
             </div>
             
             <h1 className="text-[54px] font-black text-text-main leading-[0.8] tracking-tighter">
               {currentDayData.day}
             </h1>
             <h2 className="text-[20px] font-black text-accent leading-none tracking-tighter mt-1 mb-1">
               de 21
             </h2>
             <div className="w-8 h-[3px] bg-accent/30 mt-4 mb-4 rounded-full"></div>
             <h3 className="text-[12px] font-black text-accent uppercase tracking-[0.2em]">
               Ser · Saber · Fazer
             </h3>
          </div>
        </div>

        {/* HEADER BADGE OVER IMAGE */}
        <div className="pt-8 px-6 w-full flex-shrink-0 flex items-start animate-fade-in-left">
          <div className="flex flex-col items-start w-[65%]">
            <div className="w-10 h-10 rounded-full border border-accent flex items-center justify-center mb-3 bg-black/30 backdrop-blur-sm shadow-sm">
              <HeartIcon className="text-accent w-5 h-5" />
            </div>
            <h2 className="text-[26px] font-black leading-none tracking-tight uppercase">
              <span className="text-white block mb-1 drop-shadow-md">{titleFirst}</span>
              <span className="text-accent block drop-shadow-md">{titleRest}</span>
            </h2>
            <div className="w-full h-px bg-accent/50 my-3"></div>
            <p className="text-[12px] font-medium text-white/95 leading-tight drop-shadow-md pr-2">
              21 dias para aprofundar sua caminhada com Ele.
            </p>
          </div>
        </div>

        {/* INVISIBLE SPACER WITH SCROLL INDICATOR */}
        <div className="h-[55vh] flex-shrink-0 flex items-end justify-center pb-8">
          <div className="animate-bounce flex flex-col items-center opacity-80 mt-auto">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest mb-2 drop-shadow-lg">Deslize para ler</span>
            <svg className="w-5 h-5 text-accent drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* MAIN TEXT CONTENT COM FUNDO SÓLIDO */}
        <div className="relative w-full flex-1 flex flex-col mt-auto">
          
          {/* O FADE DE TRANSIÇÃO (Acontece antes do texto começar) */}
          <div className="w-full h-28 bg-gradient-to-b from-transparent to-bg-main" />
          
          <div className="w-full px-7 pt-2 pb-12 bg-bg-main">

            {/* REVER DIAS ANTERIORES (pedido do Nilton) */}
            <div className="mb-5">
              <button
                onClick={() => setShowDayPicker((v) => !v)}
                className="text-[12px] font-bold text-accent"
              >
                {showDayPicker ? "Fechar" : "Rever dias anteriores"}
              </button>
              {showDayPicker && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  <button
                    onClick={() => router.push("/onboarding?rever=1")}
                    className="flex-shrink-0 px-3 py-2 rounded-lg text-[12px] font-bold border border-accent/30 text-text-main bg-bg-card/50"
                  >
                    Dia Zero
                  </button>
                  {Array.from({ length: Math.max(dayIndex - 1, 0) }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      onClick={() => router.push(`/stage/${id}?rever=${d}`)}
                      className="flex-shrink-0 px-3 py-2 rounded-lg text-[12px] font-bold border border-accent/30 text-text-main bg-bg-card/50"
                    >
                      Dia {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FLUXO ÚNICO (ET-011): antes eram 3 abas separadas (Conteúdo,
                Práticas, Pontuação) que a pessoa tinha que lembrar de
                visitar uma por uma — pedido do Nilton pra restaurar o
                fluxo original do documento, tudo em sequência. */}
            <div className="animate-fade-in-left">
                {currentDayData.tema ? (
                  <>
                    {/* CARD DO DIA — tema e versículo, sempre visíveis (ET-011) */}
                    <div className="mb-6">
                      <h3 className="text-[20px] font-bold text-[#8b6131] mb-1">{currentDayData.tema}</h3>
                      {currentDayData.versiculo && (
                        <p className="text-[14px] italic text-text-main/70 border-l-2 border-accent pl-3 leading-relaxed">
                          {currentDayData.versiculo}
                        </p>
                      )}
                      {currentDayData.consolidacao && (
                        <p className="text-[12px] font-bold text-accent bg-accent/10 rounded-xl px-4 py-3 mt-3">
                          Hoje não há novo conteúdo. É dia de consolidar o que Deus já começou a fazer em você esta semana.
                        </p>
                      )}
                    </div>

                    {(() => {
                      // Uma coisa por tela (ET-011) — o wizard monta a lista de
                      // passos existentes pra este dia e mostra só o atual.
                      // Ordem do ET-011: Vídeo, Artigo, Reflexão, Prática,
                      // Diário, Oração/Conclusão. Práticas sempre entra (é
                      // hábito diário); Pontuação só entra se ainda não foi
                      // feita nesta estação (é avaliação semanal, não diária).
                      type StepKey = "video" | "artigo" | "reflexao" | "praticas" | "pontuacao" | "diario" | "conclusao";
                      const steps: StepKey[] = [];
                      if (currentDayData.videoRoteiro) steps.push("video");
                      if (currentDayData.artigoRico) steps.push("artigo");
                      if (currentDayData.reflexao?.length) steps.push("reflexao");
                      steps.push("praticas");
                      if (!scoreDone) steps.push("pontuacao");
                      if (currentDayData.diarioPerguntas) steps.push("diario");
                      steps.push("conclusao");

                      const step = steps[Math.min(contentStep, steps.length - 1)];
                      const isLastStep = Math.min(contentStep, steps.length - 1) === steps.length - 1;

                      // O Artigo é, ele mesmo, um carrossel de cartões (pedido
                      // do Nilton) — uma frase por cartão, terminando no link
                      // "Aprofunde-se" quando o dia tiver um.
                      const articleSlides = currentDayData.resumoTelas && currentDayData.resumoTelas.length > 0
                        ? currentDayData.resumoTelas
                        : currentDayData.artigoRico
                        ? currentDayData.artigoRico.texto.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0)
                        : [];
                      const isArticleStep = step === "artigo";
                      const isArticleMidway = isArticleStep && artigoSlide < articleSlides.length - 1;

                      const goNext = () => {
                        if (isArticleMidway) setArtigoSlide((s) => s + 1);
                        else setContentStep((s) => Math.min(s + 1, steps.length - 1));
                      };
                      const goBack = () => {
                        if (isArticleStep && artigoSlide > 0) setArtigoSlide((s) => s - 1);
                        else setContentStep((s) => Math.max(s - 1, 0));
                      };

                      return (
                        <div>
                          {/* pontinhos de progresso */}
                          <div className="flex gap-1.5 mb-6">
                            {steps.map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${i <= contentStep ? "bg-accent" : "bg-accent/15"}`}
                              />
                            ))}
                          </div>

                          {step === "video" && (
                            <div className="mb-6">
                              <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-3">
                                Vídeo do Dia · em produção
                              </span>
                              <p className="text-[15px] text-text-main/90 leading-relaxed">{currentDayData.videoRoteiro}</p>
                            </div>
                          )}

                          {step === "artigo" && currentDayData.artigoRico && (
                            <div className="mb-6">
                              <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-2">
                                Artigo · {currentDayData.artigoRico.titulo}
                              </span>
                              {articleSlides.length > 1 && (
                                <div className="flex gap-1 mb-4">
                                  {articleSlides.map((_, i) => (
                                    <span
                                      key={i}
                                      className={`h-1 flex-1 rounded-full ${i <= artigoSlide ? "bg-accent" : "bg-accent/15"}`}
                                    />
                                  ))}
                                </div>
                              )}
                              <p className="text-[18px] font-medium text-text-main leading-relaxed min-h-[60px]">
                                {articleSlides[artigoSlide] || currentDayData.artigoRico.texto}
                              </p>

                              {!isArticleMidway && currentDayData.artigo && (
                                <a
                                  href={currentDayData.artigo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-3 mt-6 p-4 rounded-xl border border-accent/25 bg-accent/5 active:scale-[0.99] transition-transform"
                                >
                                  <div>
                                    <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-1">Aprofunde-se</span>
                                    <span className="block text-[14px] font-semibold text-text-main leading-snug">{currentDayData.artigo.titulo}</span>
                                  </div>
                                  <span className="text-accent text-lg flex-shrink-0">→</span>
                                </a>
                              )}
                            </div>
                          )}

                          {step === "reflexao" && currentDayData.reflexao && (
                            <div className="mb-6">
                              <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-3">
                                Reflexão Guiada
                              </span>
                              <ul className="space-y-4">
                                {currentDayData.reflexao.map((q, i) => (
                                  <li key={i} className="text-[16px] font-medium text-text-main leading-relaxed flex gap-3">
                                    <span className="text-accent">●</span> {q}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {step === "praticas" && (
                            <div className="mb-6">
                              <PracticesTab id={id} dayIndex={dayIndex} onChange={checkCompletionStatus} />
                            </div>
                          )}

                          {step === "pontuacao" && (
                            <div className="mb-6">
                              <ScoreTab id={id} onChange={checkCompletionStatus} />
                            </div>
                          )}

                          {step === "diario" && currentDayData.diarioPerguntas && (
                            <div className="mb-6">
                              <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-3">
                                {currentDayData.consolidacao ? "Memorial da Semana" : "Memorial da Estação"}
                              </span>
                              {diarioSaved ? (
                                <p className="text-[14px] text-text-main/70">Registrado no seu Memorial da Estação. Você pode rever tudo na aba Memorial.</p>
                              ) : (
                                <>
                                  <textarea
                                    value={diarioVivido}
                                    onChange={(e) => setDiarioVivido(e.target.value)}
                                    placeholder={currentDayData.diarioPerguntas[0] || "O que você viveu hoje?"}
                                    className="w-full min-h-[80px] bg-bg-card/50 border border-accent/20 rounded-lg p-3 text-[14px] text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent resize-none mb-3"
                                  />
                                  <textarea
                                    value={diarioDeusFalou}
                                    onChange={(e) => setDiarioDeusFalou(e.target.value)}
                                    placeholder={currentDayData.diarioPerguntas.slice(1).join(" ") || "O que Deus falou com você?"}
                                    className="w-full min-h-[80px] bg-bg-card/50 border border-accent/20 rounded-lg p-3 text-[14px] text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent resize-none mb-3"
                                  />
                                  <button
                                    onClick={handleSaveDiario}
                                    disabled={diarioSaving}
                                    className="w-full bg-accent text-white py-2.5 rounded-lg font-bold text-[13px] disabled:opacity-50"
                                  >
                                    {diarioSaving ? "Guardando..." : "Guardar no Memorial da Estação"}
                                  </button>
                                </>
                              )}
                            </div>
                          )}

                          {step === "conclusao" && (
                            <div className="mb-6">
                              {currentDayData.oracaoSugerida && (
                                <div className="p-4 rounded-xl bg-[#8b6131]/10 mb-6">
                                  <span className="block text-[11px] uppercase tracking-wide text-[#8b6131] font-bold mb-2">Oração</span>
                                  <p className="text-[15px] italic text-text-main/90 leading-relaxed">{currentDayData.oracaoSugerida}</p>
                                </div>
                              )}
                              {currentDayData.encerramento && (
                                <p className="text-[13px] text-text-muted text-center italic leading-relaxed mb-6">
                                  {currentDayData.encerramento}
                                </p>
                              )}
                              <label className="flex items-start gap-4 p-4 rounded-xl border border-accent/20 bg-bg-card/50 cursor-pointer active:scale-[0.99] transition-transform">
                                <input
                                  type="checkbox"
                                  checked={contentRead}
                                  onChange={toggleContentRead}
                                  className="mt-1 w-5 h-5 accent-accent rounded-sm focus:ring-accent"
                                />
                                <div>
                                  <span className="block font-bold text-text-main">Vivi o conteúdo de hoje</span>
                                  <span className="text-[13px] text-text-muted">{currentDayData.tema}</span>
                                </div>
                              </label>
                            </div>
                          )}

                          {/* NAVEGAÇÃO DO PASSO A PASSO */}
                          {!isLastStep && (
                            <div className="flex gap-3 mt-2">
                              {(contentStep > 0 || (isArticleStep && artigoSlide > 0)) && (
                                <button
                                  onClick={goBack}
                                  className="px-5 py-3 rounded-xl font-bold text-[13px] text-text-muted border border-accent/20"
                                >
                                  Voltar
                                </button>
                              )}
                              <button
                                onClick={goNext}
                                className="flex-1 bg-accent text-white py-3 rounded-xl font-bold text-[14px]"
                              >
                                Continuar
                              </button>
                            </div>
                          )}
                          {isLastStep && contentStep > 0 && (
                            <button
                              onClick={goBack}
                              className="px-5 py-3 rounded-xl font-bold text-[13px] text-text-muted border border-accent/20 mb-4"
                            >
                              Voltar
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {/* SER — Deus transforma meu coração (era "Confronto") */}
                    <div className="mb-9 flex items-start gap-4 relative">
                      <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-accent/30"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-accent flex-shrink-0 flex items-center justify-center bg-bg-main shadow-sm z-10">
                        <HeartIcon className="text-accent w-4 h-4" />
                      </div>
                      <div className="pb-2">
                        <h3 className="text-[19px] font-bold text-[#8b6131] mb-1">Ser</h3>
                        <p className="text-[11px] uppercase tracking-widest text-text-muted mb-2">Deus transforma meu coração</p>
                        <p className="text-[17px] font-medium text-text-main leading-relaxed">
                          {currentDayData.confronto}
                        </p>
                      </div>
                    </div>

                    {/* SABER — Deus ensina sua Palavra (era "Direção") */}
                    <div className="mb-9 flex items-start gap-4 relative">
                      <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-accent/30"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-accent flex-shrink-0 flex items-center justify-center bg-bg-main shadow-sm z-10">
                        <CompassIcon className="text-accent w-4 h-4" />
                      </div>
                      <div className="pb-2">
                        <h3 className="text-[19px] font-bold text-[#8b6131] mb-1">Saber</h3>
                        <p className="text-[11px] uppercase tracking-widest text-text-muted mb-2">Deus ensina sua Palavra</p>
                        <p className="text-[15px] font-medium italic text-text-main/90 leading-relaxed">
                          {currentDayData.direcao}
                        </p>
                      </div>
                    </div>

                    {/* FAZER — Eu vivo a Palavra no cotidiano (era "Ação Prática") */}
                    <div className="mb-10 flex items-start gap-4 relative">
                      <div className="w-8 h-8 rounded-full border-2 border-accent flex-shrink-0 flex items-center justify-center bg-bg-main shadow-sm z-10">
                        <PrayIcon className="text-accent w-4 h-4" />
                      </div>
                      <div className="flex-1 pb-4">
                        <h3 className="text-[19px] font-bold text-[#8b6131] mb-1">Fazer</h3>
                        <p className="text-[11px] uppercase tracking-widest text-text-muted mb-3">Eu vivo a Palavra no cotidiano</p>
                        <ul className="space-y-4">
                          {acaoLines.length > 0 ? (
                            acaoLines.map((line: string, i: number) => (
                              <li key={i} className="flex gap-3 items-start border-b border-accent/15 pb-3 last:border-0">
                                <span className="text-accent mt-[2px] text-sm">●</span>
                                <span className="text-[14px] font-medium text-text-main/90 leading-relaxed">{line}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex gap-3 items-start">
                              <span className="text-accent mt-[2px] text-sm">●</span>
                              <span className="text-[14px] font-medium text-text-main/90 leading-relaxed">{currentDayData.acao}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* LEITURA COMPLEMENTAR (opcional) */}
                    {currentDayData.artigo && (
                      <a
                        href={currentDayData.artigo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 mb-6 p-4 rounded-xl border border-accent/25 bg-accent/5 active:scale-[0.99] transition-transform"
                      >
                        <div>
                          <span className="block text-[11px] uppercase tracking-wide text-accent font-bold mb-1">Aprofunde-se</span>
                          <span className="block text-[14px] font-semibold text-text-main leading-snug">{currentDayData.artigo.titulo}</span>
                        </div>
                        <span className="text-accent text-lg flex-shrink-0">→</span>
                      </a>
                    )}

                    {/* CHECKBOX: CONFIRMAÇÃO DE LEITURA DO CONTEÚDO */}
                    <label className="flex items-start gap-4 p-4 rounded-xl border border-accent/20 bg-bg-card/50 cursor-pointer active:scale-[0.99] transition-transform mb-6">
                      <input
                        type="checkbox"
                        checked={contentRead}
                        onChange={toggleContentRead}
                        className="mt-1 w-5 h-5 accent-accent rounded-sm focus:ring-accent"
                      />
                      <div>
                        <span className="block font-bold text-text-main">Já li o conteúdo de hoje</span>
                        <span className="text-[13px] text-text-muted">Ser, Saber e Fazer deste dia.</span>
                      </div>
                    </label>

                    {/* PRÁTICAS — dias de prática contínua (8-21) não têm
                        carrossel, então Práticas (e Pontuação, só na
                        primeira vez da estação) entram direto na sequência. */}
                    <div className="mb-6">
                      <PracticesTab id={id} dayIndex={dayIndex} onChange={checkCompletionStatus} />
                    </div>
                    {!scoreDone && (
                      <div className="mb-6">
                        <ScoreTab id={id} onChange={checkCompletionStatus} />
                      </div>
                    )}
                  </>
                )}
              </div>

            {/* BOTÃO DE CONCLUIR — sempre visível ao final do fluxo único
                (antes ficava escondido dependendo da aba; agora não tem
                mais abas, só esse fluxo, então sempre aparece no fim). */}
            <div className="flex justify-center mt-8">
              <CompleteButton id={id} dayIndex={dayIndex} canComplete={canComplete} />
            </div>
            {!canComplete && (
              <p className="text-[12px] text-text-muted text-center mt-4 px-4 leading-relaxed">
                Marque {!contentRead && "Conteúdo"}
                {!contentRead && (!practicesDone || !scoreDone) && ", "}
                {!practicesDone && "Práticas"}
                {!practicesDone && !scoreDone && " e "}
                {!scoreDone && "Pontuação"} para avançar de dia.
              </p>
            )}

          </div>

          {/* BARRA DE EVOLUÇÃO — substitui o antigo rodapé estático.
              Mostra o dia atual dentro da estação e quanto falta para a
              insígnia (revelada em /congratulations ao concluir o dia 21). */}
          <div className="bg-bg-main border-t border-accent/20 py-5 px-6 mt-auto flex-shrink-0">
            {currentDayData.day >= 8 && currentDayData.day <= 21 && (
              <span
                className="inline-block text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/10 rounded-full px-2.5 py-1 mb-2"
              >
                Fase de prática contínua
              </span>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-text-main">
                Dia {currentDayData.day} de 21
              </span>
              <span className="text-[11px] font-bold text-accent">
                {21 - currentDayData.day === 0
                  ? "Insígnia liberada!"
                  : `Faltam ${21 - currentDayData.day} dia${21 - currentDayData.day === 1 ? "" : "s"} para a insígnia "${badgeNames[id] || "desta estação"}"`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-text-main/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#b58b54] to-[#eaddc5] transition-all duration-700"
                style={{ width: `${(currentDayData.day / 21) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}

export default function StagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-main" />}>
      <StagePageContent />
    </Suspense>
  );
}
