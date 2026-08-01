"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

export default function ScoreTab({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const loadScore = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data } = await supabase
          .from("user_station_scores")
          .select("score")
          .eq("user_id", session.user.id)
          .eq("stage_id", id)
          .single();

        if (data) {
          setScore(data.score);
        }
      }
      setLoading(false);
    };

    loadScore();
  }, [id, supabase]);

  const handleScore = async (newScore: number) => {
    setScore(newScore);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setSaving(true);
    
    // Upsert logic
    await supabase
      .from("user_station_scores")
      .upsert({
        user_id: session.user.id,
        stage_id: id,
        score: newScore,
        created_at: new Date().toISOString()
      }, { onConflict: "user_id, stage_id" });

    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center text-text-main/50">Carregando...</div>;

  return (
    <div className="animate-fade-in-left">
      <div className="mb-8">
        <h3 className="text-[19px] font-bold text-[#8b6131] mb-2">Avaliação Semanal</h3>
        <p className="text-[13px] text-text-muted leading-relaxed mb-6">
          A pontuação não tem caráter de julgamento ou mérito espiritual. Ela existe apenas para ajudar você a perceber seu nível de engajamento e crescimento ao longo da jornada.
        </p>

        <div className="flex flex-col gap-3">
          {[
            { val: 0, label: "Não realizei as práticas" },
            { val: 1, label: "Realizei parcialmente" },
            { val: 2, label: "Realizei de forma intencional" },
            { val: 3, label: "Intencional e refletida" }
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => handleScore(item.val)}
              disabled={saving}
              className={`flex items-center p-4 rounded-xl border text-left transition-all active:scale-[0.98]
                ${score === item.val 
                  ? "bg-text-main border-text-main text-bg-main shadow-md" 
                  : "bg-bg-card/50 border-accent/30 text-text-main hover:bg-bg-main"
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black mr-4 flex-shrink-0
                ${score === item.val ? "bg-accent text-bg-main" : "bg-text-main/10 text-text-muted"}
              `}>
                {item.val}
              </div>
              <span className="font-bold text-[14px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-accent/20 pt-6">
        <button
          onClick={() => router.push("/diary")}
          className="w-full bg-gradient-to-r from-[#d5b080] to-[#b38a53] text-[#111812] py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
          Registrar no Diário
        </button>
      </div>
    </div>
  );
}
