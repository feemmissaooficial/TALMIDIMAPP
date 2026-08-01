"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, User, Users, BookOpen } from "lucide-react";

// --- ÍCONES ELEGANTES ---
const MaleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#eaddc5]">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FemaleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bd9152" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const LeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a3b2b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

import { createClient } from "../../utils/supabase/client";

export default function StartPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Ordem pedida pelo Nilton (documento ET-003 + fluxo da Fase 0): depois do
  // Splash, a próxima tela precisa ser Login/Cadastro — não o texto "Antes
  // de iniciar a jornada". Esse texto continua existindo, só passou pra
  // depois da escolha de perfil (etapa 5), como uma ponte antes do
  // onboarding real, em vez de travar a entrada logo na abertura.
  const [step, setStep] = useState(3);
  const [selectedMode, setSelectedMode] = useState("pessoal");
  const [pendingProfile, setPendingProfile] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Auth states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const profile = session.user?.user_metadata?.profile;
        if (profile) {
          localStorage.setItem("talmidim-profile", profile);
          setIsTransitioning(true);
          setTimeout(() => router.push("/"), 1200);
        } else {
          setStep(5);
        }
      }
    };
    checkSession();

    // Escuta a volta do OAuth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const profile = session.user?.user_metadata?.profile;
        if (profile) {
          localStorage.setItem("talmidim-profile", profile);
          setIsTransitioning(true);
          setTimeout(() => router.push("/"), 1200);
        } else {
          setStep(5);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? window.location.origin + "/auth/callback" : undefined }
    });
    if (error) {
      setLoading(false);
      console.error(error);
      setErrorMsg(error.message || "Erro ao entrar com Google. Tente novamente.");
    }
  };

  const selectProfile = async (profile: string) => {
    localStorage.setItem("talmidim-profile", profile);
    await supabase.auth.updateUser({ data: { profile } });
    setIsTransitioning(true);

    // Efeito de mergulho elegante antes de ir pro onboarding do Talmid Peregrino
    setTimeout(() => {
      router.push("/onboarding");
    }, 1200);
  };

  if (!mounted) return null;

  return (
    <div 
      className="relative h-[100dvh] w-full flex justify-center items-center bg-[#fdfaf6] text-[#243525] font-sans overflow-hidden"
      style={{
        transform: isTransitioning ? 'scale(2.5)' : 'scale(1)',
        opacity: isTransitioning ? 0 : 1,
        transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease-in-out 0.2s',
      }}
    >
      
      {/* Background Decorators (Ondas Elegantes) */}
      <div className="absolute top-0 left-0 w-[120vw] h-[120vw] max-w-[700px] max-h-[700px] border-[1px] border-[#eaddc5]/30 rounded-full -translate-x-[40%] -translate-y-[40%] pointer-events-none transition-transform duration-1000"></div>
      <div className="absolute bottom-0 right-0 w-[100vw] h-[100vw] max-w-[600px] max-h-[600px] border-[1px] border-[#eaddc5]/40 rounded-full translate-x-[40%] translate-y-[40%] pointer-events-none transition-transform duration-1000"></div>

      {/* --- PASSO 1: O AVISO / PROPÓSITO --- */}
      {step === 1 && (
        <div className="w-full max-w-[420px] relative z-10 flex flex-col h-full max-h-[100dvh] px-8 py-12 justify-center animate-in fade-in duration-700">
           <div className="flex justify-center mb-8 opacity-60">
              <LeafIcon />
           </div>
           <h1 className="text-[34px] font-bold text-[#1f3020] leading-[1.1] tracking-tight font-serif text-center mb-10 drop-shadow-sm">
             Antes de iniciar<br/>a jornada
           </h1>
           <div className="space-y-6 text-[15px] text-[#3b5238] leading-relaxed text-center px-2">
              <p>
                Este material não nasceu de um projeto editorial, mas da caminhada pastoral.
              </p>
              <p>
                Ele não apresenta novidades teológicas, mas chama você a viver de forma intencional aquilo que sempre esteve no centro da fé cristã.
              </p>
              <p className="font-bold text-[#b58b54] text-[16px] italic pt-4">
                "Este livro não foi escrito para ser apenas lido, mas para ser vivido."
              </p>
           </div>
           
           <div className="mt-16">
              <button
                onClick={() => pendingProfile && selectProfile(pendingProfile)}
                className="w-full bg-gradient-to-r from-[#d5b080] to-[#c69b5c] text-white py-4 rounded-[16px] font-bold shadow-[0_10px_25px_rgba(213,176,128,0.3)] active:scale-95 transition-all tracking-wide"
              >
                Compreendi. Estou pronto.
              </button>
           </div>
        </div>
      )}

      {/* --- PASSO 2: MODALIDADES --- */}
      {step === 2 && (
        <div className="w-full max-w-[420px] relative z-10 flex flex-col h-full max-h-[100dvh] px-6 py-10 animate-in fade-in slide-in-from-right-8 duration-500">
           <div className="mt-6 mb-8 px-2">
             <h2 className="text-[32px] font-bold text-[#1f3020] leading-[1.05] tracking-tight font-serif drop-shadow-sm mb-3">Como você<br/>vai usar?</h2>
             <p className="text-[14px] text-[#40543c] opacity-80">Selecione seu foco principal para personalizar a jornada e as ferramentas.</p>
           </div>

           <div className="flex flex-col gap-4 flex-1 px-2">
              {/* Uso Pessoal */}
              <div 
                onClick={() => setSelectedMode('pessoal')} 
                className={`p-5 rounded-[20px] border-2 cursor-pointer transition-all duration-300 ${
                  selectedMode === 'pessoal' 
                  ? 'border-[#40543c] bg-gradient-to-br from-[#40543c] to-[#263724] text-white shadow-[0_15px_30px_rgba(38,55,36,0.25)]' 
                  : 'border-[#eaddc5]/50 bg-white/80 text-[#40543c] hover:border-[#c69b5c]/50'
                }`}
              >
                 <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMode === 'pessoal' ? 'bg-white/10' : 'bg-[#f5ebd9]'}`}>
                      <User size={22} className={selectedMode === 'pessoal' ? 'text-[#eaddc5]' : 'text-[#c69b5c]'} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="font-bold text-[17px] tracking-wide">Uso Pessoal</span>
                      <span className={`text-[12px] mt-0.5 ${selectedMode === 'pessoal' ? 'text-white/80' : 'opacity-60'}`}>Jornada individual</span>
                    </div>
                 </div>
              </div>

              {/* Discipulado 1:1 */}
              <div className="p-5 rounded-[20px] border-2 border-[#eaddc5]/30 bg-white/40 text-[#40543c]/40 relative overflow-hidden cursor-not-allowed">
                 <div className="flex items-center gap-5 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users size={22} className="text-gray-400" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="font-bold text-[17px] tracking-wide">Discipulado 1:1</span>
                      <span className="text-[12px] mt-0.5">Acompanhamento e Mentoria</span>
                    </div>
                 </div>
                 <div className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-[#c69d66]/10 text-[#c69d66] px-2.5 py-1 rounded-md">Em breve</div>
              </div>

              {/* Pequeno Grupo */}
              <div className="p-5 rounded-[20px] border-2 border-[#eaddc5]/30 bg-white/40 text-[#40543c]/40 relative overflow-hidden cursor-not-allowed">
                 <div className="flex items-center gap-5 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users size={22} className="text-gray-400" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="font-bold text-[17px] tracking-wide">Pequeno Grupo</span>
                      <span className="text-[12px] mt-0.5">Caminhada comunitária</span>
                    </div>
                 </div>
                 <div className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-[#c69d66]/10 text-[#c69d66] px-2.5 py-1 rounded-md">Em breve</div>
              </div>

              {/* Escola Bíblica */}
              <div className="p-5 rounded-[20px] border-2 border-[#eaddc5]/30 bg-white/40 text-[#40543c]/40 relative overflow-hidden cursor-not-allowed">
                 <div className="flex items-center gap-5 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <BookOpen size={22} className="text-gray-400" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="font-bold text-[17px] tracking-wide">Escola Bíblica</span>
                      <span className="text-[12px] mt-0.5">Curso e Ensino Coletivo</span>
                    </div>
                 </div>
                 <div className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-[#c69d66]/10 text-[#c69d66] px-2.5 py-1 rounded-md">Em breve</div>
              </div>
           </div>

           <div className="mt-8 px-2">
             <button 
               onClick={() => setStep(3)} 
               className="w-full bg-[#243525] text-white py-4 rounded-[16px] font-bold shadow-[0_10px_20px_rgba(36,53,37,0.2)] active:scale-95 transition-all tracking-wide"
             >
                Avançar
             </button>
           </div>
        </div>
      )}

      {/* --- PASSO 3: EMAIL --- */}
      {step === 3 && (
        <div className="w-full max-w-[420px] relative z-10 flex flex-col h-full max-h-[100dvh] px-8 py-12 justify-center animate-in fade-in slide-in-from-right-8 duration-500">
           <div className="flex justify-center mb-8 opacity-60">
              <User size={32} className="text-[#3b5238]" />
           </div>
           <h2 className="text-[30px] font-bold text-[#1f3020] leading-[1.1] tracking-tight font-serif text-center mb-6 drop-shadow-sm">
             Acesse sua<br/>Jornada
           </h2>
           <p className="text-[15px] text-[#3b5238] leading-relaxed text-center px-2 mb-8">
             Entre com sua conta Google para salvar seu progresso, com segurança e sem senhas.
           </p>

           <div className="space-y-4">
              {errorMsg && <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>}

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white text-[#40543c] border-2 border-[#eaddc5]/50 hover:bg-[#fcf9f2] py-4 rounded-[16px] font-bold shadow-sm active:scale-95 transition-all flex justify-center items-center gap-3 disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {loading ? "Entrando..." : "Entrar com Google"}
              </button>
           </div>
        </div>
      )}

      {/* --- PASSO 5: GÊNERO --- */}
      {step === 5 && (
        <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center justify-center gap-7 h-full px-6 py-5 animate-in fade-in slide-in-from-right-8 duration-500 overflow-hidden">

          {/* LOGO */}
          <div className="relative w-[240px] h-[140px] flex-shrink-0">
            <Image src="/logo.png" alt="Talmidim Logo" fill className="object-contain scale-[1.8] origin-center drop-shadow-sm" priority />
          </div>

          {/* TIPOGRAFIA: Bem-vindo ao caminho */}
          <div className="text-center w-full flex-shrink-0">
            <h1 className="text-[28px] font-bold text-[#1f3020] leading-[1.05] tracking-tight font-serif drop-shadow-sm">
              Bem-vindo ao caminho
            </h1>

            <div className="flex items-center justify-center gap-2 mt-2 opacity-80">
               <div className="h-[1px] w-6 bg-[#c69b5c]"></div>
               <p className="text-[10px] font-bold text-[#b58b54] uppercase tracking-[0.25em]">
                 Escolha seu perfil
               </p>
               <div className="h-[1px] w-6 bg-[#c69b5c]"></div>
            </div>
          </div>

          {/* CARD CENTRAL DE TEXTO */}
          <div className="w-full bg-[#fdfbf7]/90 backdrop-blur-sm border border-[#f0e4cd] rounded-[20px] py-3 px-5 shadow-[0_15px_40px_rgba(213,176,128,0.15)] flex flex-col items-center text-center relative flex-shrink-0">
             <p className="text-[12px] text-[#4a5c4b] font-medium leading-relaxed">
               "Este não é um conteúdo para ler. É um <span className="font-bold text-[#b58b54]">caminho</span> para viver."
             </p>
          </div>

          {/* BOTÕES DE ESCOLHA */}
          <div className="w-full flex flex-col space-y-3 flex-shrink-0">

            {/* BOTÃO HOMEM */}
            <button
              onClick={() => { setPendingProfile("male"); setStep(1); }}
              className="w-full bg-gradient-to-b from-[#40543c] to-[#263724] hover:from-[#496245] hover:to-[#2e422c] text-left py-3.5 px-5 rounded-[18px] shadow-[0_15px_30px_rgba(38,55,36,0.3),inset_0_2px_2px_rgba(255,255,255,0.15)] transition-all active:scale-95 flex items-center gap-4 group"
            >
              <div className="w-[44px] h-[44px] rounded-full border border-[#d5b080]/30 bg-gradient-to-br from-[#2a3c28] to-[#1e2a1d] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                 <MaleIcon />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[16px] font-bold text-white tracking-wide drop-shadow-md">HOMEM</span>
                <span className="text-[11px] text-white/80 leading-tight mt-1 font-medium drop-shadow-sm">Cresça na fé, lidere com propósito.</span>
              </div>
              <div className="text-[#d5b080] group-hover:translate-x-1 transition-transform">
                <ChevronRight />
              </div>
            </button>

            {/* BOTÃO MULHER */}
            <button
              onClick={() => { setPendingProfile("female"); setStep(1); }}
              className="w-full bg-gradient-to-b from-[#d5b080] to-[#b38a53] hover:from-[#dfba88] hover:to-[#c69b5c] text-left py-3.5 px-5 rounded-[18px] shadow-[0_15px_30px_rgba(179,138,83,0.3),inset_0_2px_2px_rgba(255,255,255,0.3)] transition-all active:scale-95 flex items-center gap-4 group"
            >
              <div className="w-[44px] h-[44px] rounded-full border border-white/40 bg-gradient-to-br from-[#c69d66] to-[#a67c4b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                 <FemaleIcon />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[16px] font-bold text-white tracking-wide drop-shadow-md">MULHER</span>
                <span className="text-[11px] text-white/90 leading-tight mt-1 font-medium drop-shadow-sm">Fortaleça sua caminhada, inspire o mundo.</span>
              </div>
              <div className="text-white group-hover:translate-x-1 transition-transform">
                <ChevronRight />
              </div>
            </button>

          </div>

          {/* FOOTER */}
          <div className="flex flex-col items-center opacity-70 flex-shrink-0">
             <LeafIcon />
             <p className="text-[9px] font-medium text-[#2a3b2b] text-center mt-1 leading-snug">
               Juntos, formando discípulos para a glória de Deus.
             </p>
          </div>

        </div>
      )}

    </div>
  );
}
