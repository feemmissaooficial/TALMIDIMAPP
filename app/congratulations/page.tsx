"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getStage, stageOrder, badgeNames } from "../data";
import { Award, Map, PenTool, Leaf, Compass, Flame, Heart, Hammer, Eye, Crown } from "lucide-react";
import BadgeRevealChest from "./BadgeRevealChest";

// Ícone da insígnia de cada estação — mesmo mapeamento usado em /dashboard,
// para a insígnia revelada aqui bater com a que aparece na prateleira de
// conquistas.
const badgeIcons: Record<string, React.ElementType> = {
  house: Leaf,
  street: Compass,
  clinic: Flame,
  office: Heart,
  construction: Hammer,
  rooftop: Eye,
  city: Crown,
};

// Adaptador: a CrownIcon original não aceita size/className (é usada solta
// em outros lugares deste arquivo), então embrulhamos para o BadgeRevealChest.
const CrownBadgeIcon = () => <CrownIcon />;

// --- ÍCONES ELEGANTES ---
const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b58b54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const CrownIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d5b080" />
        <stop offset="50%" stopColor="#eaddc5" />
        <stop offset="100%" stopColor="#b38a53" />
      </linearGradient>
    </defs>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

function CongratulationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageId = searchParams?.get("stage") || "";
  
  const stage = getStage(stageId);
  const isGrandFinale = stageId === "city";
  
  const [mounted, setMounted] = useState(false);
  const [showLetterBox, setShowLetterBox] = useState(false);
  const [letterText, setLetterText] = useState("");
  const [letterSaved, setLetterSaved] = useState(false);

  // Memorial — registro ao final de cada estação (não a final geral)
  const [showMemorialBox, setShowMemorialBox] = useState(false);
  const [memAprendizado, setMemAprendizado] = useState("");
  const [memOracao, setMemOracao] = useState("");
  const [memDesafio, setMemDesafio] = useState("");
  const [memEvidencia, setMemEvidencia] = useState("");
  const [memorialSaved, setMemorialSaved] = useState(false);

  const BadgeIcon = badgeIcons[stageId] || Award;

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("talmidim-letter");
    if (saved) setLetterText(saved);

    // Desbloquear a insígnia desta estação
    const unlockBadge = async () => {
      const supabase = (await import("../../utils/supabase/client")).createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && stageId) {
        // Tenta inserir, se já existir falha silenciosamente (por causa do UNIQUE do BD)
        await supabase.from("user_badges").insert({
          user_id: session.user.id,
          badge_id: stageId
        });
      }
    };
    unlockBadge();
  }, [stageId]);

  if (!mounted || !stage) return null;

  const day21 = stage.days.find(d => d.day === 21);
  const closeText = day21 ? day21.direcao : "Estação concluída com sucesso!";

  const handleSaveLetter = async () => {
    const supabase = (await import("../../utils/supabase/client")).createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      await supabase.from("user_letters").insert({
        user_id: session.user.id,
        content: letterText
      });
    }

    localStorage.setItem("talmidim-letter", letterText);
    setLetterSaved(true);
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  const handleSaveMemorial = async () => {
    const stageName = stage?.title || stageId;
    const content =
      `Memorial — ${stageName}\n\n` +
      `Aprendizados: ${memAprendizado}\n\n` +
      `Respostas de oração: ${memOracao}\n\n` +
      `Desafios: ${memDesafio}\n\n` +
      `Evidências da ação de Deus: ${memEvidencia}`;

    const supabase = (await import("../../utils/supabase/client")).createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      await supabase.from("user_letters").insert({
        user_id: session.user.id,
        content,
      });
    }

    localStorage.setItem(`talmidim-memorial-${stageId}`, content);
    setMemorialSaved(true);
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  if (isGrandFinale) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] flex flex-col items-center px-6 py-12 animate-in fade-in zoom-in-95 duration-1000 overflow-hidden relative">
        {/* Fundo Estrelado Escuro e Premium */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c69b5c]/10 via-[#0a0f0a] to-[#050805]"></div>
        <div className="absolute top-0 right-0 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] border-[1px] border-[#c69b5c]/10 rounded-full translate-x-[40%] -translate-y-[40%] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[100vw] h-[100vw] max-w-[600px] max-h-[600px] border-[1px] border-[#d5b080]/10 rounded-full -translate-x-[40%] translate-y-[40%] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] h-full flex-1">
          <div className="mt-8 mb-2 flex justify-center animate-in slide-in-from-top-8 duration-700">
            <BadgeRevealChest
              BadgeIcon={CrownBadgeIcon}
              badgeName={badgeNames[stageId] || "Insígnia conquistada"}
              theme="dark"
            />
          </div>

          <h1 className="text-[42px] font-bold text-center font-serif leading-[1.05] tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#fdfaf6] via-[#eaddc5] to-[#c69b5c] drop-shadow-sm">
            A Jornada<br/>Continua
          </h1>
          
          <div className="w-full bg-[#141b14]/80 border border-[#c69b5c]/20 rounded-[24px] py-8 px-6 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0f0a] px-3">
              <LeafIcon />
            </div>
            <p className="text-[16px] text-[#eaddc5]/90 font-medium leading-relaxed italic text-center mt-2">
              "{closeText}"
            </p>
          </div>

          {!showLetterBox ? (
            <div className="w-full mt-auto space-y-4 animate-in fade-in duration-1000 delay-300">
              <button 
                onClick={() => setShowLetterBox(true)}
                className="w-full bg-gradient-to-r from-[#d5b080] to-[#b38a53] hover:from-[#eaddc5] hover:to-[#c69b5c] text-[#111812] py-4 px-6 rounded-[20px] font-bold shadow-[0_15px_30px_rgba(198,155,92,0.2),inset_0_2px_2px_rgba(255,255,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 tracking-wide"
              >
                <PenTool size={20} strokeWidth={2.5} />
                Escrever carta para o futuro
              </button>
              
              <button 
                onClick={() => router.push("/")}
                className="w-full text-[#c69b5c] hover:text-[#eaddc5] py-4 font-bold text-[15px] hover:bg-[#c69b5c]/10 rounded-[20px] transition-all flex items-center justify-center gap-2"
              >
                Voltar ao Mapa <Map size={18} />
              </button>
            </div>
          ) : (
            <div className="w-full flex-1 flex flex-col animate-in slide-in-from-bottom-8 duration-500 pb-6">
              <p className="text-[14px] text-[#eaddc5]/70 mb-4 text-center font-medium tracking-wide">
                Escreva o que você quer ter se tornado daqui a 1 ano.
              </p>
              <textarea
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                className="w-full flex-1 min-h-[220px] bg-[#141b14]/80 border border-[#c69b5c]/40 rounded-[20px] p-5 text-[#fdfaf6] placeholder:text-[#eaddc5]/30 focus:outline-none focus:border-[#d5b080] focus:ring-1 focus:ring-[#d5b080]/50 shadow-inner transition-all resize-none text-[16px] leading-relaxed"
                placeholder="Daqui a 1 ano, eu espero ter me tornado..."
              />
              <button 
                onClick={handleSaveLetter}
                disabled={!letterText.trim() || letterSaved}
                className="w-full mt-6 bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812] py-4 rounded-[20px] font-bold shadow-lg disabled:opacity-50 disabled:grayscale active:scale-95 transition-all tracking-wide"
              >
                {letterSaved ? "Carta Guardada em Segurança" : "Guardar Carta e Concluir"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular Stage Completion
  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#243525] flex flex-col items-center px-6 py-12 animate-in fade-in duration-700 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[100vw] h-[100vw] max-w-[600px] max-h-[600px] border-[1px] border-[#eaddc5]/60 rounded-full translate-x-[40%] -translate-y-[40%] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] border-[1px] border-[#eaddc5]/40 rounded-full -translate-x-[30%] translate-y-[30%] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] h-full flex-1">
        <div className="mt-10 mb-2 flex justify-center animate-in slide-in-from-top-8 duration-700">
          <BadgeRevealChest
            BadgeIcon={BadgeIcon}
            badgeName={badgeNames[stageId] || "Insígnia conquistada"}
            theme="light"
          />
        </div>

        <div className="text-center w-full mb-10 animate-in fade-in duration-1000">
          <div className="flex items-center justify-center gap-2 mb-3 opacity-90">
             <div className="h-[1px] w-6 bg-[#c69b5c]/50"></div>
             <p className="text-[12px] font-bold text-[#b58b54] uppercase tracking-[0.3em]">
               Estação {stageOrder.indexOf(stageId) + 1}
             </p>
             <div className="h-[1px] w-6 bg-[#c69b5c]/50"></div>
          </div>
          
          <h1 className="text-[38px] font-bold text-[#1f3020] leading-[1.05] tracking-tight font-serif drop-shadow-sm">
            Concluída
          </h1>
        </div>
        
        <div className="w-full bg-[#fdfbf7]/90 backdrop-blur-sm border border-[#f0e4cd] rounded-[24px] py-8 px-6 shadow-[0_20px_50px_rgba(213,176,128,0.15)] relative mb-12 animate-in slide-in-from-bottom-8 duration-700">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#fdfaf6] rounded-full flex items-center justify-center border border-[#f0e4cd]">
              <LeafIcon />
           </div>
           <p className="text-[16px] text-[#3b5238] font-medium leading-relaxed italic text-center mt-3">
             "{closeText}"
           </p>
        </div>

        {!showMemorialBox ? (
          <div className="w-full mt-auto mb-6 space-y-3 animate-in fade-in duration-1000 delay-300">
            <button
              onClick={() => setShowMemorialBox(true)}
              className="w-full bg-[#243525] text-white py-4 px-6 rounded-[20px] font-bold shadow-[0_15px_30px_rgba(36,53,37,0.25)] active:scale-95 transition-all flex items-center justify-center gap-3 tracking-wide"
            >
              <PenTool size={18} strokeWidth={2.5} />
              Registrar Memorial da Estação
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full text-[#243525] py-3 font-bold text-[15px] hover:bg-[#243525]/5 rounded-[20px] transition-all flex items-center justify-center gap-2"
            >
              Retornar ao Mapa <Map size={18} className="opacity-80" />
            </button>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col mb-6 animate-in slide-in-from-bottom-8 duration-500 gap-4">
            <p className="text-[14px] text-[#3b5238]/80 text-center font-medium tracking-wide -mt-2">
              Guarde a história desta estação antes de seguir.
            </p>
            <div>
              <label className="text-[13px] font-bold text-[#1f3020] mb-1 block">O que você aprendeu?</label>
              <textarea
                value={memAprendizado}
                onChange={(e) => setMemAprendizado(e.target.value)}
                className="w-full min-h-[70px] bg-white border border-[#f0e4cd] rounded-[16px] p-4 text-[#243525] placeholder:text-[#243525]/30 focus:outline-none focus:border-[#c69b5c] resize-none text-[15px] leading-relaxed"
                placeholder="Um aprendizado que ficou..."
              />
            </div>
            <div>
              <label className="text-[13px] font-bold text-[#1f3020] mb-1 block">Alguma oração respondida?</label>
              <textarea
                value={memOracao}
                onChange={(e) => setMemOracao(e.target.value)}
                className="w-full min-h-[70px] bg-white border border-[#f0e4cd] rounded-[16px] p-4 text-[#243525] placeholder:text-[#243525]/30 focus:outline-none focus:border-[#c69b5c] resize-none text-[15px] leading-relaxed"
                placeholder="Deus respondeu quando..."
              />
            </div>
            <div>
              <label className="text-[13px] font-bold text-[#1f3020] mb-1 block">Qual foi o maior desafio?</label>
              <textarea
                value={memDesafio}
                onChange={(e) => setMemDesafio(e.target.value)}
                className="w-full min-h-[70px] bg-white border border-[#f0e4cd] rounded-[16px] p-4 text-[#243525] placeholder:text-[#243525]/30 focus:outline-none focus:border-[#c69b5c] resize-none text-[15px] leading-relaxed"
                placeholder="Foi difícil quando..."
              />
            </div>
            <div>
              <label className="text-[13px] font-bold text-[#1f3020] mb-1 block">Onde você viu Deus agir?</label>
              <textarea
                value={memEvidencia}
                onChange={(e) => setMemEvidencia(e.target.value)}
                className="w-full min-h-[70px] bg-white border border-[#f0e4cd] rounded-[16px] p-4 text-[#243525] placeholder:text-[#243525]/30 focus:outline-none focus:border-[#c69b5c] resize-none text-[15px] leading-relaxed"
                placeholder="Percebi Deus agindo em..."
              />
            </div>
            <button
              onClick={handleSaveMemorial}
              disabled={memorialSaved}
              className="w-full mt-2 bg-[#243525] text-white py-4 rounded-[20px] font-bold shadow-lg disabled:opacity-50 active:scale-95 transition-all tracking-wide"
            >
              {memorialSaved ? "Memorial Guardado" : "Guardar Memorial e Continuar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Congratulations() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfaf6]" />}>
      <CongratulationsContent />
    </Suspense>
  );
}
