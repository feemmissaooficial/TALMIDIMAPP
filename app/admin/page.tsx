"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { ArrowLeft, ShieldCheck, Building2, Plus, UserPlus, Search } from "lucide-react";

type Igreja = {
  igreja_id: string;
  nome: string;
  total_membros: number;
  total_pastores: number;
  criado_em: string;
};

type UsuarioEncontrado = {
  user_id: string;
  nome: string;
  email: string;
  role: string | null;
  igreja_atual: string | null;
};

export default function PainelAdmin() {
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);

  // Nova igreja
  const [novoNomeIgreja, setNovoNomeIgreja] = useState("");
  const [criandoIgreja, setCriandoIgreja] = useState(false);

  // Promover pastor
  const [emailBusca, setEmailBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<UsuarioEncontrado | null | "nao_encontrado">(null);
  const [igrejaSelecionada, setIgrejaSelecionada] = useState("");
  const [promovendo, setPromovendo] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const carregarOverview = useCallback(async () => {
    const { data, error } = await supabase.rpc("admin_get_overview");
    if (error) {
      if (error.message?.includes("Acesso negado")) {
        alert("Acesso Negado: Apenas administradores do sistema têm acesso a este painel.");
        router.push("/dashboard");
        return;
      }
      setErro("Não foi possível carregar as igrejas.");
      return;
    }
    setIgrejas(data || []);
  }, [supabase, router]);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }
      await carregarOverview();
      setLoading(false);
    };
    init();
  }, [router, supabase, carregarOverview]);

  const handleCriarIgreja = async () => {
    if (!novoNomeIgreja.trim()) return;
    setCriandoIgreja(true);
    setMensagem(null);
    const { error } = await supabase.rpc("admin_create_igreja", { p_nome: novoNomeIgreja.trim() });
    setCriandoIgreja(false);
    if (error) {
      setMensagem("Erro ao criar igreja: " + error.message);
      return;
    }
    setNovoNomeIgreja("");
    setMensagem("Igreja criada com sucesso.");
    await carregarOverview();
  };

  const handleBuscarUsuario = async () => {
    if (!emailBusca.trim()) return;
    setBuscando(true);
    setUsuarioEncontrado(null);
    setMensagem(null);
    const { data, error } = await supabase.rpc("admin_find_user_by_email", { p_email: emailBusca.trim() });
    setBuscando(false);
    if (error) {
      setMensagem("Erro na busca: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      setUsuarioEncontrado("nao_encontrado");
      return;
    }
    setUsuarioEncontrado(data[0]);
  };

  const handlePromover = async () => {
    if (!usuarioEncontrado || usuarioEncontrado === "nao_encontrado" || !igrejaSelecionada) return;
    setPromovendo(true);
    setMensagem(null);
    const { error } = await supabase.rpc("admin_set_pastor", {
      p_user_id: usuarioEncontrado.user_id,
      p_igreja_id: igrejaSelecionada,
    });
    setPromovendo(false);
    if (error) {
      setMensagem("Erro ao promover: " + error.message);
      return;
    }
    setMensagem(`${usuarioEncontrado.nome} agora é pastor(a) dessa igreja.`);
    setUsuarioEncontrado(null);
    setEmailBusca("");
    setIgrejaSelecionada("");
    await carregarOverview();
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-bg-main flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalMembros = igrejas.reduce((acc, i) => acc + Number(i.total_membros), 0);
  const totalPastores = igrejas.reduce((acc, i) => acc + Number(i.total_pastores), 0);

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans pb-24">
      <div className="bg-bg-card pt-6 pb-4 px-6 sticky top-0 z-20 shadow-sm border-b border-accent/20 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard")} className="text-accent p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-serif font-bold text-text-main">Painel Master</h1>
        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
          <ShieldCheck size={16} className="text-accent" />
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        {erro && <p className="text-red-500 text-[13px] text-center">{erro}</p>}

        {/* Resumo geral */}
        <div>
          <h2 className="text-[20px] font-bold font-serif text-text-main mb-1">Visão Geral do Sistema</h2>
          <p className="text-text-muted text-[13px] mb-4">
            {igrejas.length} {igrejas.length === 1 ? "igreja licenciada" : "igrejas licenciadas"} · {totalMembros} membros · {totalPastores} pastores
          </p>
        </div>

        {/* Lista de igrejas */}
        <div className="space-y-3">
          {igrejas.map((i) => (
            <div key={i.igreja_id} className="bg-bg-card border border-accent/20 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Building2 className="text-accent" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] truncate">{i.nome}</p>
                <p className="text-[12px] text-text-muted">
                  {i.total_membros} membros · {i.total_pastores} pastor(es)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Criar nova igreja */}
        <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="text-accent" size={18} />
            <h3 className="text-[14px] font-bold uppercase tracking-wider">Cadastrar Nova Igreja</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={novoNomeIgreja}
              onChange={(e) => setNovoNomeIgreja(e.target.value)}
              placeholder="Nome da igreja"
              className="flex-1 bg-bg-main border border-accent/20 rounded-xl px-4 py-3 text-[14px] text-text-main placeholder:text-text-muted"
            />
            <button
              onClick={handleCriarIgreja}
              disabled={criandoIgreja || !novoNomeIgreja.trim()}
              className="bg-accent text-bg-main px-5 rounded-xl font-bold disabled:opacity-40"
            >
              {criandoIgreja ? "..." : "Criar"}
            </button>
          </div>
        </div>

        {/* Promover pastor */}
        <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="text-accent" size={18} />
            <h3 className="text-[14px] font-bold uppercase tracking-wider">Vincular Pastor a uma Igreja</h3>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="email"
              value={emailBusca}
              onChange={(e) => setEmailBusca(e.target.value)}
              placeholder="E-mail já cadastrado no app"
              className="flex-1 bg-bg-main border border-accent/20 rounded-xl px-4 py-3 text-[14px] text-text-main placeholder:text-text-muted"
            />
            <button
              onClick={handleBuscarUsuario}
              disabled={buscando || !emailBusca.trim()}
              className="bg-bg-main border border-accent/30 text-text-main px-4 rounded-xl disabled:opacity-40"
            >
              <Search size={18} />
            </button>
          </div>

          {usuarioEncontrado === "nao_encontrado" && (
            <p className="text-[13px] text-text-muted mb-3">Nenhum usuário cadastrado com esse e-mail.</p>
          )}

          {usuarioEncontrado && usuarioEncontrado !== "nao_encontrado" && (
            <div className="bg-bg-main border border-accent/10 rounded-xl p-4 mb-3">
              <p className="font-bold text-[14px]">{usuarioEncontrado.nome}</p>
              <p className="text-[12px] text-text-muted mb-3">
                {usuarioEncontrado.email} · atualmente: {usuarioEncontrado.role || "sem papel definido"}
              </p>

              <select
                value={igrejaSelecionada}
                onChange={(e) => setIgrejaSelecionada(e.target.value)}
                className="w-full bg-bg-card border border-accent/20 rounded-xl px-4 py-3 text-[14px] text-text-main mb-3"
              >
                <option value="">Selecione a igreja</option>
                {igrejas.map((i) => (
                  <option key={i.igreja_id} value={i.igreja_id}>
                    {i.nome}
                  </option>
                ))}
              </select>

              <button
                onClick={handlePromover}
                disabled={promovendo || !igrejaSelecionada}
                className="w-full bg-accent text-bg-main py-3 rounded-xl font-bold disabled:opacity-40"
              >
                {promovendo ? "Promovendo..." : "Tornar Pastor(a) dessa Igreja"}
              </button>
            </div>
          )}

          {mensagem && <p className="text-[13px] text-accent">{mensagem}</p>}
        </div>
      </div>
    </div>
  );
}
