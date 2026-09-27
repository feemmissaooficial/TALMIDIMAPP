"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  Plus,
  UserPlus,
  Search,
  Users,
  Activity,
  Clock,
  Filter,
  X,
} from "lucide-react";

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

type Membro = {
  user_id: string;
  nome: string;
  email: string;
  igreja_id: string | null;
  igreja_nome: string | null;
  role: string;
  genero: "male" | "female" | null;
  estado: string | null;
  cidade: string | null;
  idade: number | null;
  estacao_atual: number;
  dia_estacao_atual: number | null;
  ultima_atividade: string | null;
  radar_preenchido: boolean;
  radar_pontuacao: number | null;
  pdd_preenchido: boolean;
  criado_em: string;
};

const TOTAL_ESTACOES = 7;

function formatarAtividade(dataIso: string | null): string {
  if (!dataIso) return "Nunca acessou";
  const diffDias = Math.floor((Date.now() - new Date(dataIso).getTime()) / (1000 * 60 * 60 * 24));
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

function faixaEtaria(idade: number | null): string {
  if (idade === null || idade === undefined) return "Não informado";
  if (idade < 18) return "Menor de 18";
  if (idade <= 25) return "18–25";
  if (idade <= 35) return "26–35";
  if (idade <= 45) return "36–45";
  if (idade <= 60) return "46–60";
  return "60+";
}

const FAIXAS_ETARIAS = ["18–25", "26–35", "36–45", "46–60", "60+", "Menor de 18", "Não informado"];

export default function PainelAdmin() {
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<"geral" | "analytics">("geral");

  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);

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

  // Filtros do Analytics
  const [filtroIgreja, setFiltroIgreja] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCidade, setFiltroCidade] = useState("todas");
  const [filtroGenero, setFiltroGenero] = useState("todos");
  const [filtroFaixa, setFiltroFaixa] = useState("todas");
  const [busca, setBusca] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const carregarTudo = useCallback(async () => {
    const [overview, allMembers] = await Promise.all([
      supabase.rpc("admin_get_overview"),
      supabase.rpc("admin_get_all_members"),
    ]);

    if (overview.error) {
      if (overview.error.message?.includes("Acesso negado")) {
        alert("Acesso Negado: Apenas administradores do sistema têm acesso a este painel.");
        router.push("/dashboard");
        return;
      }
      setErro("Não foi possível carregar as igrejas.");
      return;
    }
    setIgrejas(overview.data || []);

    if (!allMembers.error) {
      setMembros(allMembers.data || []);
    }
  }, [supabase, router]);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/start");
        return;
      }
      await carregarTudo();
      setLoading(false);
    };
    init();
  }, [router, supabase, carregarTudo]);

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
    await carregarTudo();
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
    await carregarTudo();
  };

  // --- Listas para os filtros, derivadas dos próprios dados ---
  const estadosDisponiveis = useMemo(() => {
    const s = new Set(membros.map((m) => m.estado).filter((v): v is string => !!v));
    return Array.from(s).sort();
  }, [membros]);

  const cidadesDisponiveis = useMemo(() => {
    const base = filtroEstado === "todos" ? membros : membros.filter((m) => m.estado === filtroEstado);
    const s = new Set(base.map((m) => m.cidade).filter((v): v is string => !!v));
    return Array.from(s).sort();
  }, [membros, filtroEstado]);

  // --- Cruzamento de dados: aplica todos os filtros de uma vez ---
  const membrosFiltrados = useMemo(() => {
    return membros.filter((m) => {
      if (filtroIgreja !== "todas" && m.igreja_id !== filtroIgreja) return false;
      if (filtroEstado !== "todos" && m.estado !== filtroEstado) return false;
      if (filtroCidade !== "todas" && m.cidade !== filtroCidade) return false;
      if (filtroGenero !== "todos" && m.genero !== filtroGenero) return false;
      if (filtroFaixa !== "todas" && faixaEtaria(m.idade) !== filtroFaixa) return false;
      if (busca.trim()) {
        const alvo = (m.nome + " " + m.email).toLowerCase();
        if (!alvo.includes(busca.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [membros, filtroIgreja, filtroEstado, filtroCidade, filtroGenero, filtroFaixa, busca]);

  const resumo = useMemo(() => {
    const total = membrosFiltrados.length;
    const homens = membrosFiltrados.filter((m) => m.genero === "male").length;
    const mulheres = membrosFiltrados.filter((m) => m.genero === "female").length;
    const comRadar = membrosFiltrados.filter((m) => m.radar_preenchido).length;
    const comPdd = membrosFiltrados.filter((m) => m.pdd_preenchido).length;
    const inativos21 = membrosFiltrados.filter((m) => nivelInatividade(m.ultima_atividade) === "alerta").length;
    const somaDias = membrosFiltrados.reduce((acc, m) => acc + (m.dia_estacao_atual || 0), 0);
    const mediaDia = total > 0 ? Math.round((somaDias / total) * 10) / 10 : 0;
    const somaEstacao = membrosFiltrados.reduce((acc, m) => acc + m.estacao_atual, 0);
    const mediaEstacao = total > 0 ? Math.round((somaEstacao / total) * 10) / 10 : 0;

    const porEstacao: Record<number, number> = {};
    membrosFiltrados.forEach((m) => {
      porEstacao[m.estacao_atual] = (porEstacao[m.estacao_atual] || 0) + 1;
    });

    return { total, homens, mulheres, comRadar, comPdd, inativos21, mediaDia, mediaEstacao, porEstacao };
  }, [membrosFiltrados]);

  const limparFiltros = () => {
    setFiltroIgreja("todas");
    setFiltroEstado("todos");
    setFiltroCidade("todas");
    setFiltroGenero("todos");
    setFiltroFaixa("todas");
    setBusca("");
  };

  const filtrosAtivos =
    filtroIgreja !== "todas" ||
    filtroEstado !== "todos" ||
    filtroCidade !== "todas" ||
    filtroGenero !== "todos" ||
    filtroFaixa !== "todas" ||
    busca.trim() !== "";

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

      {/* Abas */}
      <div className="px-6 mt-6 flex gap-2">
        <button
          onClick={() => setAba("geral")}
          className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all ${
            aba === "geral" ? "bg-accent text-bg-main" : "bg-bg-card border border-accent/20 text-text-muted"
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setAba("analytics")}
          className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all ${
            aba === "analytics" ? "bg-accent text-bg-main" : "bg-bg-card border border-accent/20 text-text-muted"
          }`}
        >
          Analytics
        </button>
      </div>

      {erro && <p className="text-red-500 text-[13px] text-center mt-4 px-6">{erro}</p>}

      {aba === "geral" && (
        <div className="px-6 mt-8 space-y-8">
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
      )}

      {aba === "analytics" && (
        <div className="px-6 mt-8 space-y-6">
          <div>
            <h2 className="text-[20px] font-bold font-serif text-text-main mb-1">Analytics Cruzado</h2>
            <p className="text-text-muted text-[13px]">
              Filtre e cruze os dados de todas as igrejas ao mesmo tempo.
            </p>
          </div>

          {/* Busca + botão de filtros */}
          <div className="flex gap-2">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou e-mail"
              className="flex-1 bg-bg-card border border-accent/20 rounded-xl px-4 py-3 text-[14px] text-text-main placeholder:text-text-muted"
            />
            <button
              onClick={() => setMostrarFiltros((v) => !v)}
              className={`px-4 rounded-xl border flex items-center gap-1.5 text-[13px] font-bold ${
                filtrosAtivos ? "bg-accent text-bg-main border-accent" : "bg-bg-card border-accent/20 text-text-main"
              }`}
            >
              <Filter size={16} />
              Filtros
            </button>
          </div>

          {mostrarFiltros && (
            <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-text-muted">Filtrar por</h3>
                {filtrosAtivos && (
                  <button onClick={limparFiltros} className="text-[12px] text-accent flex items-center gap-1">
                    <X size={12} /> Limpar
                  </button>
                )}
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-text-muted mb-1 block">Igreja</label>
                <select
                  value={filtroIgreja}
                  onChange={(e) => setFiltroIgreja(e.target.value)}
                  className="w-full bg-bg-main border border-accent/20 rounded-xl px-3 py-2.5 text-[13px] text-text-main"
                >
                  <option value="todas">Todas as igrejas</option>
                  {igrejas.map((i) => (
                    <option key={i.igreja_id} value={i.igreja_id}>{i.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-text-muted mb-1 block">Estado</label>
                  <select
                    value={filtroEstado}
                    onChange={(e) => { setFiltroEstado(e.target.value); setFiltroCidade("todas"); }}
                    className="w-full bg-bg-main border border-accent/20 rounded-xl px-3 py-2.5 text-[13px] text-text-main"
                  >
                    <option value="todos">Todos</option>
                    {estadosDisponiveis.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-text-muted mb-1 block">Cidade</label>
                  <select
                    value={filtroCidade}
                    onChange={(e) => setFiltroCidade(e.target.value)}
                    className="w-full bg-bg-main border border-accent/20 rounded-xl px-3 py-2.5 text-[13px] text-text-main"
                  >
                    <option value="todas">Todas</option>
                    {cidadesDisponiveis.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-text-muted mb-1 block">Gênero</label>
                  <select
                    value={filtroGenero}
                    onChange={(e) => setFiltroGenero(e.target.value)}
                    className="w-full bg-bg-main border border-accent/20 rounded-xl px-3 py-2.5 text-[13px] text-text-main"
                  >
                    <option value="todos">Todos</option>
                    <option value="male">Homens</option>
                    <option value="female">Mulheres</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-text-muted mb-1 block">Faixa etária</label>
                  <select
                    value={filtroFaixa}
                    onChange={(e) => setFiltroFaixa(e.target.value)}
                    className="w-full bg-bg-main border border-accent/20 rounded-xl px-3 py-2.5 text-[13px] text-text-main"
                  >
                    <option value="todas">Todas</option>
                    {FAIXAS_ETARIAS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Cartões de resumo (o cruzamento em números) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-card border border-accent/20 rounded-2xl p-4 text-center">
              <Users className="mx-auto text-accent mb-1" size={18} />
              <p className="text-[22px] font-black leading-none">{resumo.total}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Pessoas no filtro</p>
            </div>
            <div className="bg-bg-card border border-accent/20 rounded-2xl p-4 text-center">
              <Activity className="mx-auto text-accent mb-1" size={18} />
              <p className="text-[22px] font-black leading-none">{resumo.mediaEstacao}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Estação média</p>
            </div>
            <div className="bg-bg-card border border-accent/20 rounded-2xl p-4 text-center">
              <Clock className="mx-auto text-accent mb-1" size={18} />
              <p className="text-[22px] font-black leading-none">{resumo.mediaDia}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Dia médio na estação</p>
            </div>
            <div className="bg-bg-card border border-accent/20 rounded-2xl p-4 text-center">
              <p className="text-[22px] font-black leading-none text-red-500">{resumo.inativos21}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Inativos 21+ dias</p>
            </div>
          </div>

          <div className="bg-bg-card border border-accent/20 rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">Distribuição</p>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <span className="bg-bg-main border border-accent/10 rounded-full px-3 py-1">
                {resumo.homens} homens · {resumo.mulheres} mulheres
              </span>
              <span className="bg-bg-main border border-accent/10 rounded-full px-3 py-1">
                {resumo.comRadar} fizeram o Radar
              </span>
              <span className="bg-bg-main border border-accent/10 rounded-full px-3 py-1">
                {resumo.comPdd} assinaram o PDD
              </span>
            </div>
          </div>

          {/* Tabela de membros filtrados */}
          <div className="space-y-3">
            <p className="text-[13px] font-bold text-text-main">
              {membrosFiltrados.length} {membrosFiltrados.length === 1 ? "resultado" : "resultados"}
            </p>

            {membrosFiltrados.length === 0 && (
              <div className="text-center py-10">
                <Users className="mx-auto text-accent/30 mb-3" size={32} />
                <p className="text-text-muted text-[13px]">Nenhum membro encontrado com esse filtro.</p>
              </div>
            )}

            {membrosFiltrados.map((m) => {
              const nivel = nivelInatividade(m.ultima_atividade);
              const percentual = Math.min(100, Math.round((m.estacao_atual / TOTAL_ESTACOES) * 100));
              return (
                <div key={m.user_id} className="bg-bg-card border border-accent/20 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[14px] text-text-main truncate pr-2">{m.nome}</span>
                    <span
                      className={
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 " +
                        (nivel === "alerta"
                          ? "bg-red-500/10 text-red-500"
                          : nivel === "atencao"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-accent/10 text-accent")
                      }
                    >
                      {formatarAtividade(m.ultima_atividade)}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-muted mb-2">
                    {m.igreja_nome || "Sem igreja"}
                    {m.role === "pastor" ? " · Pastor(a)" : ""}
                    {m.cidade || m.estado ? ` · ${[m.cidade, m.estado].filter(Boolean).join("/")}` : ""}
                    {m.idade ? ` · ${m.idade} anos` : ""}
                  </p>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-text-muted">
                      Estação {m.estacao_atual} de {TOTAL_ESTACOES}
                      {m.dia_estacao_atual ? ` · Dia ${m.dia_estacao_atual}/21` : ""}
                    </span>
                    <span className="text-[12px] font-bold text-accent">{percentual}%</span>
                  </div>
                  <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden border border-accent/10">
                    <div className="bg-accent h-full rounded-full opacity-80" style={{ width: `${percentual}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
