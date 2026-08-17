"use client";

import { useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { Users, Copy, Check } from "lucide-react";

export default function NovaTurmaPage() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<{ code: string; adminCode: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    const { data, error } = await supabase.rpc("create_radar_group", { p_name: name.trim() });
    setCreating(false);
    if (error || !data || data.length === 0) {
      alert("Erro ao criar a turma: " + (error?.message || "tente novamente."));
      return;
    }
    setResult({ code: data[0].code, adminCode: data[0].admin_code });
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const participantLink = result ? `${baseUrl}/grupo/${result.code}` : "";
  const panelLink = result ? `${baseUrl}/grupo/painel/${result.adminCode}` : "";

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#eaddc5] font-sans flex flex-col items-center pb-24">
      <div className="w-full bg-[#111812] pt-12 pb-8 px-6 text-center border-b border-[#c69b5c]/10">
        <div className="w-14 h-14 bg-[#c69b5c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={26} className="text-[#c69b5c]" />
        </div>
        <h1 className="text-[24px] font-serif font-bold text-white mb-2">Radar em Grupo</h1>
        <p className="text-[#eaddc5]/70 text-[14px] max-w-[340px] mx-auto leading-relaxed">
          Crie uma turma, envie o link para o grupo preencher pelo celular e acompanhe o resultado geral.
        </p>
      </div>

      <div className="w-full max-w-[480px] px-6 mt-8">
        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] text-white font-medium mb-2">Nome da turma</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ordem — Tocantins"
                className="w-full bg-[#111812] border border-[#2a302a] rounded-xl p-3.5 text-[15px] text-[#eaddc5] placeholder:text-[#eaddc5]/30 focus:outline-none focus:border-[#c69b5c]/50"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !name.trim()}
              className="w-full bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812] py-4 rounded-[16px] font-bold shadow-[0_10px_25px_rgba(198,155,92,0.2)] active:scale-95 transition-all disabled:opacity-50"
            >
              {creating ? "Criando..." : "Criar turma"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#111812] border border-[#2a302a] rounded-[20px] p-5">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#c69b5c] mb-2">
                1. Envie este link para o grupo
              </span>
              <p className="text-[12px] text-[#eaddc5]/60 mb-3">Cada pessoa preenche pelo próprio celular e já vê o gráfico dela.</p>
              <div className="flex items-center gap-2 bg-[#0a0f0a] border border-[#2a302a] rounded-xl p-3">
                <span className="text-[13px] text-[#eaddc5] break-all flex-1">{participantLink}</span>
                <button onClick={() => copy(participantLink, "part")} className="shrink-0 text-[#c69b5c]">
                  {copied === "part" ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="bg-[#111812] border border-[#c69b5c]/30 rounded-[20px] p-5">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#c69b5c] mb-2">
                2. Guarde este link só para você
              </span>
              <p className="text-[12px] text-[#eaddc5]/60 mb-3">É o seu painel: mostra o total da turma e o de cada pessoa. Não compartilhe.</p>
              <div className="flex items-center gap-2 bg-[#0a0f0a] border border-[#2a302a] rounded-xl p-3">
                <span className="text-[13px] text-[#eaddc5] break-all flex-1">{panelLink}</span>
                <button onClick={() => copy(panelLink, "admin")} className="shrink-0 text-[#c69b5c]">
                  {copied === "admin" ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setName("");
              }}
              className="w-full text-[13px] text-[#eaddc5]/50 underline text-center"
            >
              Criar outra turma
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
