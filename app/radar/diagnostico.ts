// Motor de diagnóstico do Radar Discipular.
//
// Antes disso o app só mostrava a pontuação crua de cada área num gráfico.
// O livro do Talmidim (seção "RADAR DISCIPULAR" -> "COMBINAÇÕES") ensina que
// o diagnóstico real não olha as áreas isoladas — olha como elas se
// relacionam entre si. As regras abaixo são adaptadas diretamente dos
// exemplos que o Nilton já escreveu no livro, não são texto genérico.
//
// scores: Record<areaId, pontuação de 0 a 15> — usa os ids de radarAreas
// (intimidade, familia, evangelizacao, compaixao, mordomia, servico, comunhao).

export type Insight = {
  titulo: string;
  texto: string;
};

const MAX = 15;

export function generateDiagnostico(scores: Record<string, number>): {
  pontosFortes: string[];
  pontosFracos: string[];
  combinacoes: Insight[];
} {
  const areas = [
    { id: "intimidade", name: "Intimidade com Deus" },
    { id: "familia", name: "Família" },
    { id: "evangelizacao", name: "Evangelização Discipuladora" },
    { id: "compaixao", name: "Compaixão e Graça" },
    { id: "mordomia", name: "Mordomia Cristã" },
    { id: "servico", name: "Serviço Cristão" },
    { id: "comunhao", name: "Comunhão com os Santos" },
  ];

  const ranked = [...areas].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  const pontosFortes = ranked.slice(0, 3).map((a) => a.name);
  const pontosFracos = ranked.slice(-3).map((a) => a.name).reverse();
  const bottom2Ids = ranked.slice(-2).map((a) => a.id);
  const top1Id = ranked[0].id;

  const s = (id: string) => scores[id] || 0;
  const combinacoes: Insight[] = [];

  // Regra 1 — "Religiosidade": Serviço Cristão bem mais alto que Intimidade
  // com Deus. Trecho do livro: "mais empenhado na obra de Deus do que na
  // busca de um relacionamento com o Deus da obra... reflete um certo grau
  // de religiosidade."
  if (s("servico") - s("intimidade") >= 4 && s("servico") >= 8) {
    combinacoes.push({
      titulo: "Serviço à frente da Intimidade",
      texto:
        "Sua pontuação em Serviço Cristão está bem mais alta que em Intimidade com Deus. Serviço Cristão fala do trabalho na obra de Deus — atividades, estruturas, programas. Intimidade com Deus fala da busca por um relacionamento profundo com Ele, através da oração, da Palavra, do jejum. Estar mais empenhado na obra de Deus do que na busca de um relacionamento com o Deus da obra reflete um certo grau de religiosidade.",
    });
  }

  // Regra 2 — fraqueza dupla no Grande Mandamento + Grande Comissão.
  if (bottom2Ids.includes("intimidade") && bottom2Ids.includes("evangelizacao")) {
    combinacoes.push({
      titulo: "Fundamento e missão fragilizados",
      texto:
        "Intimidade com Deus e Evangelização Discipuladora estão entre suas áreas mais fracas. Intimidade com Deus tem relação com o Grande Mandamento; Evangelização Discipuladora tem a ver com a Grande Comissão. Estar fraco justamente naquilo que é a missão da Igreja e o centro da existência em Cristo é algo que precisa ser analisado e trabalhado com bastante afinco.",
    });
  }

  // Regra 3 — Comunhão alta, Evangelização baixa: amizade só com crentes.
  if (top1Id === "comunhao" && bottom2Ids.includes("evangelizacao")) {
    combinacoes.push({
      titulo: "Comunhão fechada",
      texto:
        "Comunhão com os Santos é sua área mais forte, e Evangelização Discipuladora está entre as mais fracas. Isso costuma indicar alguém expansivo, comunicativo, que constrói bons relacionamentos — mas cuja amizade é só com quem já é crente. Bom de construir relacionamento, mas talvez não os esteja usando para levar pessoas a Cristo.",
    });
  }

  // Regra 4 — individualismo: áreas que beneficiam a si mesmo (Família,
  // Comunhão, Mordomia) muito mais fortes que as áreas voltadas ao próximo
  // (Compaixão e Graça, Evangelização Discipuladora).
  const selfFocused = (s("familia") + s("comunhao") + s("mordomia")) / 3;
  const otherFocused = (s("compaixao") + s("evangelizacao")) / 2;
  if (selfFocused - otherFocused >= 3) {
    combinacoes.push({
      titulo: "Fé voltada para si",
      texto:
        "Suas marcações mais fortes estão nas áreas que têm você mesmo como beneficiário — Comunhão com os Santos, Família, Mordomia. As mais baixas estão nas áreas focadas no outro — Compaixão e Graça, Evangelização Discipuladora. Vale a pergunta: você não estaria vivendo a vida cristã de forma um pouco individualizada, dedicando-se ao que lhe faz bem, sem a mesma preocupação com a Missão da Igreja?",
    });
  }

  // Regra 5 — Intimidade com Deus como a mais fraca de todas: alerta de
  // fundação, já que o Talmidim começa justamente por essa estação.
  if (ranked[ranked.length - 1].id === "intimidade") {
    combinacoes.push({
      titulo: "A base pede atenção",
      texto:
        "Intimidade com Deus é sua área mais frágil agora. Não é por acaso que o Talmidim começa exatamente por aqui: é do cultivo de um relacionamento profundo com Deus que nasce a autoridade espiritual para viver bem todas as outras áreas. Vale começar a jornada com atenção redobrada nesta estação.",
    });
  }

  if (combinacoes.length === 0) {
    combinacoes.push({
      titulo: "Um perfil equilibrado",
      texto:
        "Suas áreas estão relativamente equilibradas entre si — sem um contraste forte entre o que você vive com Deus e o que você vive com os outros. Isso não significa ausência de crescimento a buscar: revise suas marcações mais baixas, mesmo que próximas das demais, e comece por ali.",
    });
  }

  return { pontosFortes, pontosFracos, combinacoes };
}
