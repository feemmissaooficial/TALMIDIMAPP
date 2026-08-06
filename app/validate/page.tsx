"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { Lock, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function ValidatePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [mounted, setMounted] = useState(false);
  const [question, setQuestion] = useState<{ id: string, page: number, question: string, correct_answer: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }
      setUserId(session.user.id);

      // Verify if already validated
      const { data: userBooks } = await supabase
        .from("user_books")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("book_id", "talmidim")
        .single();
      
      if (userBooks) {
        // Already validated, go to home
        router.push("/");
        return;
      }

      // Fetch a random question
      const { data: questions, error } = await supabase
        .from("book_questions")
        .select("*")
        .eq("book_id", "talmidim");

      if (questions && questions.length > 0) {
        // Pick random
        const randomQ = questions[Math.floor(Math.random() * questions.length)];
        setQuestion(randomQ);
      }
      
      setLoading(false);
    };
    init();
  }, [router]);

  const handleValidate = async () => {
    if (!question || !answer.trim()) return;
    
    setValidating(true);
    setErrorMsg("");

    // Simple normalization for check
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    const isCorrect = normalize(answer) === normalize(question.correct_answer);

    if (isCorrect) {
      if (userId) {
        await supabase.from("user_books").insert({
          user_id: userId,
          book_id: "talmidim"
        });
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setErrorMsg("Resposta incorreta. Verifique o livro e tente novamente.");
      setValidating(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] flex flex-col items-center px-6 py-12 relative overflow-hidden font-sans">
      
      {/* Background Decorators Premium */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a201c] via-[#0a0f0a] to-[#050805]"></div>
      <div className="absolute top-0 right-0 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] border-[1px] border-[#c69b5c]/10 rounded-full translate-x-[40%] -translate-y-[40%] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] h-full flex-1 justify-center animate-in fade-in duration-700">
        
        {success ? (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
              <CheckCircle size={48} className="text-green-400" />
            </div>
            <h1 className="text-[32px] font-bold font-serif text-white mb-2">Acesso Liberado</h1>
            <p className="text-white/70 text-center">Bem-vindo à jornada Talmidim.</p>
          </div>
        ) : (
          <>
            <div className="mb-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c69b5c] to-[#b38a53] flex items-center justify-center mb-6 shadow-[0_15px_30px_rgba(198,155,92,0.2)]">
                <Lock size={28} className="text-[#111812]" />
              </div>
              <h1 className="text-[32px] font-bold text-center font-serif leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[#fdfaf6] to-[#eaddc5] mb-3">
                Verificação de<br/>Acesso
              </h1>
              <p className="text-[14px] text-[#eaddc5]/70 text-center leading-relaxed px-4">
                Para ter acesso à plataforma, precisamos confirmar que você possui o livro físico.
              </p>
            </div>

            {question ? (
              <div className="w-full bg-[#141b14]/80 border border-[#c69b5c]/20 rounded-[24px] p-6 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8 relative animate-in slide-in-from-bottom-8 duration-700">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0a0f0a] px-4 py-1 border border-[#c69b5c]/30 rounded-full flex items-center gap-2">
                  <BookOpen size={14} className="text-[#c69b5c]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#c69b5c]">Abra o Livro</span>
                </div>
                
                <div className="mt-4 mb-6">
                  <p className="text-[18px] text-white font-medium text-center leading-relaxed">
                    {question.question}
                  </p>
                  <p className="text-[13px] text-[#c69b5c] text-center font-bold mt-2 uppercase tracking-wide">
                    Página {question.page}
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Sua resposta"
                    className="w-full bg-[#0a0f0a] border border-[#c69b5c]/40 rounded-[16px] px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#d5b080] focus:ring-1 focus:ring-[#d5b080]/50 transition-all text-center text-[16px] font-medium"
                    autoComplete="off"
                  />
                  
                  {errorMsg && (
                    <div className="flex items-center gap-2 text-red-400 justify-center text-[13px] animate-in shake">
                      <AlertCircle size={16} />
                      <p>{errorMsg}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleValidate}
                    disabled={validating || !answer.trim()}
                    className="w-full bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812] py-4 rounded-[16px] font-bold shadow-lg disabled:opacity-50 disabled:grayscale active:scale-95 transition-all tracking-wide"
                  >
                    {validating ? "Verificando..." : "Validar Acesso"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full text-center text-red-400 p-4 border border-red-900/50 rounded-xl bg-red-900/10">
                Não foi possível carregar as perguntas do servidor.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
