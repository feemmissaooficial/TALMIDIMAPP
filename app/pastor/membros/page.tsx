"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { ArrowLeft, Users, Clock } from "lucide-react";

type Membro = {
  user_id: string;
  nome: string;
  email: string;
  estacao_atual: number;
  ultima_atividade: string | null;
};

const TOTAL_ESTACOES = 7;

function formatarAtividade(dataIso: string | null): string {
  if (!dataIso) return "Nunca acessou";

  const data = new Date(dataIso);
  const agoraMs = Date.now();
  const diffMs = agoraMs - data.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias <= 0) return "Hoje";
  if (diffDias === 1) return "Ontem";
  if (diffDias < 7) return `Há ${diffDias} dias`;
  if (diffDias < 30) return `Há ${Math.floor(diffDias / 7)} semana(s)`;
  return `Há ${Math.floor(diffDias / 30)} mês(es)`;
}

function nivelInatividade(dataIso: string | null): "ok" | "atencao" | "alerta" {
  if (!dataIso) return "alerta";
  const diffDias = Math.floor((Date.now() - new Date(dataIso).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDias >= 21) return "alerta";
  if (diffDias >= 7) return "atencao";
  return "ok";
}

export default function ListaMembros() {
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [membros, setMembros] = useState<Membro[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchMembros = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }

      const { data, error } = await supabase.rpc("get_church_members");

      if (error) {
        if (error.message?.includes("Acesso negado")) {
          alert("Acesso Negado: Apenas líderes e pastores têm acesso a este painel.");
          router.push("/dashboard");
          return;
        }
        setErro("Não foi possível carregar a lista de membros.");
        setLoading(false);
        return;
      }

      setMembros(data || []);
      setLoading(false);
    };

    fetchMembros();
  }, [router, supabase]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-bg-main flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans pb-24">
      <div className="bg-bg-card pt-6 pb-4 px-6 sticky top-0 z-20 shadow-sm border-b border-accent/20 flex items-center justify-between">
        <button onClick={() => router.push("/pastor")} className="text-accent p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-serif font-bold text-text-main">Lista de Membros</h1>
        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
          <Users size={16} className="text-accent" />
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="mb-6">
          <h2 className="text-[20px] font-bold font-serif text-text-main mb-1">
            {membros.length} {membros.length === 1 ? "membro" : "membros"}
          </h2>
          <p className="text-text-muted text-[13px]">
            Progresso na jornada e última atividade de cada discípulo.
          </p>
        </div>

        {erro && (
          <div className="text-center py-10">
            <p className="text-text-muted text-[13px]">{erro}</p>
          </div>
        )}

        {!erro && membros.length === 0 && (
          <div className="text-center py-10">
            <Users className="mx-auto text-accent/30 mb-3" size={32} />
            <p className="text-text-muted text-[13px]">Nenhum membro vinculado a essa igreja ainda.</p>
          </div>
        )}

        <div className="space-y-3">
          {membros.map((m) => {
            const nivel = nivelInatividade(m.ultima_atividade);
            const percentual = Math.min(100, Math.round((m.estacao_atual / TOTAL_ESTACOES) * 100));

            return (
              <div
                key={m.user_id}
                className="bg-bg-card border border-accent/20 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[14px] text-text-main truncate pr-2">{m.nome}</span>
                  <span
                    className={
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 shrink-0 " +
                      (nivel === "alerta"
                        ? "bg-red-500/10 text-red-500"
                        : nivel === "atencao"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-accent/10 text-accent")
                    }
                  >
                    <Clock size={10} />
                    {formatarAtividade(m.ultima_atividade)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-text-muted">
                    Estação {m.estacao_atual} de {TOTAL_ESTACOES}
                  </span>
                  <span className="text-[12px] font-bold text-accent">{percentual}%</span>
                </div>
                <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden border border-accent/10">
                  <div
                    className="bg-accent h-full rounded-full opacity-80"
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
