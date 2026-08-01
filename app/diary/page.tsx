"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import { BookText, PenLine, ChevronLeft, Calendar } from "lucide-react";

type DiaryEntry = {
  id: string;
  vivido_hoje: string;
  deus_falou: string;
  created_at: string;
};

export default function DiaryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // State para o modal de nova entrada
  const [isWriting, setIsWriting] = useState(false);
  const [vividoHoje, setVividoHoje] = useState("");
  const [deusFalou, setDeusFalou] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchEntries();
  }, [router]);

  const fetchEntries = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/start");
      return;
    }
    
    setUserId(session.user.id);

    const { data } = await supabase
      .from("user_diary")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setEntries(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!vividoHoje.trim() || !deusFalou.trim()) {
      alert("Preencha ambos os campos para registrar sua entrada.");
      return;
    }

    if (!userId) return;

    setSaving(true);
    const { error } = await supabase.from("user_diary").insert({
      user_id: userId,
      vivido_hoje: vividoHoje,
      deus_falou: deusFalou
    });

    if (error) {
      alert("Erro ao salvar diário: " + error.message + "\nVocê rodou o script diary_setup.sql no Supabase?");
    } else {
      setVividoHoje("");
      setDeusFalou("");
      setIsWriting(false);
      fetchEntries(); // Recarrega a lista
    }
    setSaving(false);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#eaddc5]/30 border-t-[#c69b5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] font-sans pb-32">
      
      {/* Header */}
      <div className="pt-12 pb-8 px-6 border-b border-[#c69b5c]/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a201c] to-[#0a0f0a]">
        <div className="flex items-center gap-3 mb-2">
          <BookText className="text-[#c69b5c]" size={28} />
          <h1 className="text-[28px] font-serif font-bold text-white">Diário</h1>
        </div>
        <p className="text-[#eaddc5]/70 text-[14px]">Suas memórias e a voz de Deus registradas na Jornada.</p>
        
        <button
          onClick={() => setIsWriting(true)}
          className="mt-6 w-full bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812] py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <PenLine size={20} />
          Escrever no Diário
        </button>
      </div>

      {/* Lista de Entradas */}
      <div className="px-6 pt-8 max-w-[600px] mx-auto">
        {entries.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <BookText size={48} className="mx-auto mb-4 opacity-30" />
            <p>Seu diário está em branco.</p>
            <p className="text-[12px] mt-1">Comece registrando o que Deus tem feito.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
              const date = new Date(entry.created_at);
              const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }).format(date);
              
              return (
                <div key={entry.id} className="bg-[#111812] border border-white/5 rounded-[20px] p-6 shadow-lg">
                  <div className="flex items-center gap-2 text-[#c69b5c] mb-4 pb-4 border-b border-white/5">
                    <Calendar size={16} />
                    <span className="text-[12px] font-bold uppercase tracking-widest">{formattedDate}</span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-[14px] text-white/50 mb-2 font-bold uppercase tracking-wide">O que foi vivido hoje?</h3>
                    <p className="text-[16px] text-white/90 leading-relaxed font-serif whitespace-pre-wrap">
                      {entry.vivido_hoje}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-[14px] text-white/50 mb-2 font-bold uppercase tracking-wide">O que Deus falou comigo?</h3>
                    <p className="text-[16px] text-[#eaddc5] leading-relaxed font-serif whitespace-pre-wrap italic border-l-2 border-[#c69b5c] pl-4">
                      "{entry.deus_falou}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Nova Entrada (Full Screen) */}
      {isWriting && (
        <div className="fixed inset-0 z-50 bg-[#0a0f0a] overflow-y-auto pb-safe">
          <div className="sticky top-0 bg-[#0a0f0a] border-b border-white/10 px-4 py-4 flex items-center justify-between z-10">
            <button 
              onClick={() => setIsWriting(false)}
              className="p-2 text-white/70 hover:text-white"
            >
              <ChevronLeft size={28} />
            </button>
            <span className="text-white font-bold font-serif text-[18px]">Nova Página</span>
            <div className="w-10"></div> {/* Espaçador para centralizar o título */}
          </div>
          
          <div className="p-6 max-w-[600px] mx-auto">
            <div className="mb-8">
              <label className="block text-[#c69b5c] text-[13px] font-bold uppercase tracking-widest mb-3">
                O que foi vivido hoje?
              </label>
              <textarea
                value={vividoHoje}
                onChange={(e) => setVividoHoje(e.target.value)}
                placeholder="Escreva sobre o seu dia, seus desafios, suas vitórias..."
                className="w-full bg-[#111812] text-white border border-white/10 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-[#c69b5c] transition-colors resize-none placeholder:text-white/20 font-serif"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[#c69b5c] text-[13px] font-bold uppercase tracking-widest mb-3">
                O que Deus falou comigo?
              </label>
              <textarea
                value={deusFalou}
                onChange={(e) => setDeusFalou(e.target.value)}
                placeholder="Quais as impressões, versículos ou respostas que Ele te deu hoje?"
                className="w-full bg-[#111812] text-[#eaddc5] border border-white/10 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-[#c69b5c] transition-colors resize-none placeholder:text-white/20 font-serif italic"
              />
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#c69b5c] text-[#111812] py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar no Diário"}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
