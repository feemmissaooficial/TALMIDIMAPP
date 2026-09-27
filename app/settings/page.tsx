"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, BellRing, Clock, Save, Info, Users, MapPin } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { createClient } from "../../utils/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  const [tsdTime, setTsdTime] = useState("06:30");
  const [pddTime, setPddTime] = useState("20:00");
  const [saved, setSaved] = useState(false);

  // Perfil (estado, cidade, idade) — opcional, usado só para estatísticas do painel do pastor
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [idade, setIdade] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [perfilSalvo, setPerfilSalvo] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    // Load from local storage
    const savedTsd = localStorage.getItem("talmidim_tsd_time");
    const savedPdd = localStorage.getItem("talmidim_pdd_time");
    if (savedTsd) setTsdTime(savedTsd);
    if (savedPdd) setPddTime(savedPdd);

    const carregarPerfil = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("user_roles")
        .select("estado, cidade, idade")
        .eq("user_id", session.user.id)
        .single();
      if (data) {
        if (data.estado) setEstado(data.estado);
        if (data.cidade) setCidade(data.cidade);
        if (data.idade) setIdade(String(data.idade));
      }
    };
    carregarPerfil();
  }, [supabase]);

  const handleSalvarPerfil = async () => {
    setSalvandoPerfil(true);
    const { error } = await supabase.rpc("update_my_profile_details", {
      p_estado: estado || null,
      p_cidade: cidade || null,
      p_idade: idade ? Number(idade) : null,
    });
    setSalvandoPerfil(false);
    if (!error) {
      setPerfilSalvo(true);
      setTimeout(() => setPerfilSalvo(false), 3000);
    }
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Seu navegador não suporta notificações.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      new Notification("Notificações Ativadas!", {
        body: "Você receberá lembretes para sua jornada Talmidim.",
        icon: "/icons/icon-192x192.png"
      });
    }
  };

  const handleSave = () => {
    localStorage.setItem("talmidim_tsd_time", tsdTime);
    localStorage.setItem("talmidim_pdd_time", pddTime);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans pb-24">
      {/* Header */}
      <div className="bg-bg-card pt-6 pb-4 px-6 sticky top-0 z-20 shadow-sm border-b border-accent/20 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-accent p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-serif font-bold text-text-main">Lembretes</h1>
        <div className="w-8"></div>
      </div>

      <div className="px-6 mt-8">
        
        {/* Permission Banner */}
        <div className="mb-8">
          <h2 className="text-[24px] font-bold font-serif text-text-main mb-2">Configure sua Rotina</h2>
          <p className="text-text-muted text-[14px] leading-relaxed">
            A disciplina precede o hábito. Configure os horários em que deseja ser lembrado de suas práticas espirituais diárias.
          </p>
        </div>

        {permission !== "granted" && (
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <BellRing className="text-accent" size={20} />
              <h3 className="text-[15px] font-bold text-text-main">Ative as Notificações</h3>
            </div>
            <p className="text-[13px] text-text-muted">
              Para receber os alertas no seu celular, você precisa permitir o envio de notificações.
            </p>
            <button 
              onClick={requestPermission}
              className="mt-2 bg-text-main text-bg-main px-4 py-2 rounded-lg text-[13px] font-bold active:scale-95 transition-all"
            >
              Permitir Notificações
            </button>
          </div>
        )}

        <div className="space-y-6">

          {/* Perfil: estado, cidade, idade */}
          <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-accent" size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-text-main">Meu Perfil</h3>
                <p className="text-[12px] text-text-muted leading-tight mt-1">
                  Opcional. Ajuda sua igreja a entender melhor quem está na jornada.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Estado (ex: AP)"
                className="bg-bg-main border border-accent/30 rounded-xl p-3 text-text-main text-[14px]"
              />
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Cidade"
                className="bg-bg-main border border-accent/30 rounded-xl p-3 text-text-main text-[14px]"
              />
            </div>
            <input
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder="Idade"
              min={5}
              max={120}
              className="w-full bg-bg-main border border-accent/30 rounded-xl p-3 text-text-main text-[14px] mb-3"
            />
            <button
              onClick={handleSalvarPerfil}
              disabled={salvandoPerfil}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                perfilSalvo ? "bg-green-600 text-white" : "bg-text-main text-bg-main"
              }`}
            >
              {perfilSalvo ? "Salvo!" : salvandoPerfil ? "Salvando..." : "Salvar Perfil"}
            </button>
          </div>

          {/* TSD Time */}
          <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Clock className="text-accent" size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-text-main">Tempo a Sós com Deus</h3>
                <p className="text-[12px] text-text-muted leading-tight mt-1">Lembrete para o seu tempo de leitura e oração diária.</p>
              </div>
            </div>
            <input 
              type="time" 
              value={tsdTime}
              onChange={(e) => setTsdTime(e.target.value)}
              className="w-full bg-bg-main border border-accent/30 rounded-xl p-3 text-text-main font-bold text-center text-[18px] focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* PDD Time */}
          <div className="bg-bg-card border border-accent/20 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Users className="text-accent" size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] font-bold text-text-main">Intercessão (PDD)</h3>
                  <button
                    type="button"
                    onClick={() => router.push("/pdd/intro")}
                    aria-label="O que é o PDD?"
                    className="text-accent/70 active:scale-90 transition-transform"
                  >
                    <Info size={14} />
                  </button>
                </div>
                <p className="text-[12px] text-text-muted leading-tight mt-1">Lembrete para orar por 5 pessoas de seu círculo de relacionamentos.</p>
              </div>
            </div>
            <input 
              type="time" 
              value={pddTime}
              onChange={(e) => setPddTime(e.target.value)}
              className="w-full bg-bg-main border border-accent/30 rounded-xl p-3 text-text-main font-bold text-center text-[18px] focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className={`w-full py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2
              ${saved 
                ? "bg-green-600 text-white" 
                : "bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812]"
              }`}
          >
            {saved ? (
              <>Salvo com sucesso!</>
            ) : (
              <><Save size={20} /> Salvar Horários</>
            )}
          </button>

          <div className="flex items-start gap-2 mt-4 text-text-muted bg-bg-card p-4 rounded-xl border border-accent/10">
            <Info size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              As notificações funcionarão enquanto o aplicativo tiver permissão do sistema operacional. Em iPhones (iOS), é necessário "Adicionar à Tela de Início" primeiro.
            </p>
          </div>

        </div>

      </div>
      <BottomNav />
    </div>
  );
}
