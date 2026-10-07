// Leitura complementar opcional (proposta do Nilton: artigos do Fé em Missão
// sobre jejum, TSD, santidade, como ler a Bíblia etc.). Não é obrigatória
// pra avançar de dia — só aparece como um link "Aprofunde-se" quando o dia
// tiver um artigo associado. Espalhar entre dias de temas diferentes
// (jejum, oração, leitura), não em todos os 21 dias.
type Artigo = {
  titulo: string;
  url: string;
};

type DayContent = {
  day: number;
  title: string;
  confronto: string;
  direcao: string;
  acao: string;
  artigo?: Artigo;
  // Camada "rica" oficial (documentos ET-004 em diante, escritos pelo
  // Nilton). Opcional: só aparece nos dias em que ele já mandou o roteiro
  // completo. Nos demais dias o conteúdo continua só Ser/Saber/Fazer,
  // sem quebrar nada. Ainda não existe vídeo hospedado em lugar nenhum —
  // por isso o roteiro aparece como texto, não como player.
  tema?: string;
  versiculo?: string;
  videoRoteiro?: string;
  // Link do vídeo já gravado (YouTube). Quando presente, a tela do Vídeo
  // mostra o player de verdade em vez do roteiro em texto.
  videoUrl?: string;
  artigoRico?: { titulo: string; texto: string };
  // "Resumo para o aplicativo" oficial (documento próprio do Nilton, em
  // telas numeradas — Tela 1, Tela 2...). Quando presente, o carrossel do
  // Artigo usa exatamente essas telas em vez de dividir o texto sozinho.
  resumoTelas?: string[];
  // Desafio específico do artigo do dia (pedido do Nilton: tirar o "Desafio"
  // de dentro do carrossel do artigo, pra não duplicar com a Prática da
  // Estação, e mostrar esse texto junto da prática de TSD/leitura bíblica).
  desafioArtigo?: string;
  reflexao?: string[];
  diarioPerguntas?: string[];
  oracaoSugerida?: string;
  encerramento?: string;
  // Dia de consolidação (ex.: Dia 6 de cada semana): não tem conteúdo
  // novo, é revisão da semana — muda só um texto de aviso na tela.
  consolidacao?: boolean;
  // Dia do Memorial da Semana (ET-010, Dia 7 de cada estação): substitui o
  // fluxo tradicional de artigo por Vídeo Memorial, Linha do Tempo dos dias
  // anteriores, Minha Maior Lembrança e Gratidão — telas próprias, geradas
  // pelo componente, não por texto fixo aqui. videoRoteiro/oracaoSugerida/
  // encerramento continuam sendo usados normalmente para as telas que já
  // existem no fluxo (Vídeo Memorial e Oração/Celebração).
  memorialSemana?: boolean;
  // Desafio da Semana (ET-009, Dia 6): prática específica do dia de
  // consolidação, distinta da autoavaliação (reflexao) e do diário.
  desafioSemana?: string;
  // Tela/mensagem de abertura do dia (ET-004 a ET-008): frase de
  // acolhimento específica do dia, mostrada antes do resto do conteúdo.
  // Nos dias de consolidação/memorial isso já é feito pelo texto fixo de
  // consolidacao/memorialSemana — este campo é só para os dias "normais".
  mensagemAbertura?: string;
  // Tela "Celebração" do Dia 7 revisado (ET-010 v2): texto de adoração
  // livre, distinto da Oração (oracaoSugerida) e do Encerramento/Envio
  // (encerramento).
  celebracaoTexto?: string;
};

type Stage = {
  id: string;
  title: string;
  days: DayContent[];
};

export const stages: Stage[] = [
  {
    "id": "house",
    "title": "Intimidade com Deus",
    "days": [
      {
        "day": 1,
        "title": "Dia 1",
        "confronto": "Você reserva tempo a sós com Deus todos os dias — ou isso é só uma intenção que nunca vira prática?",
        "direcao": "Estação 1: Intimidade com Deus. O TSD — Tempo a Sós com Deus — é a fundação de tudo. Sem ele, as outras estações perdem sentido. Comece hoje.",
        "acao": "Encontre um lugar silencioso.\nDesligue o celular.\nFique 15 minutos em oração — fale com Deus em voz baixa.\nDepois leia 15 minutos a Palavra em silêncio.\nNão pule. Não reduza. Faça inteiro.",
        "tema": "Intimidade com Deus",
        "versiculo": "Antes de servir, ensinar ou liderar, todo discípulo aprende a permanecer em Cristo.",
        "mensagemAbertura": "Durante os próximos 21 dias você será convidado a fortalecer sua intimidade com Deus. Antes de servir, ensinar ou liderar, todo discípulo aprende a permanecer em Cristo. Esta estação é um convite para caminhar diariamente com o Senhor.",
        "videoRoteiro": "Acolhida ao participante, explicação da importância da intimidade com Deus e como aproveitar a jornada: um dia de cada vez, com constância e sinceridade.",
        "videoUrl": "https://youtu.be/aCbf-un3ZgE",
        "artigoRico": {
          "titulo": "O convite para caminhar com Deus",
          "texto": "A vida cristã nasce do relacionamento com Deus, e não apenas do conhecimento sobre Ele. Conhecer a respeito de Deus não substitui caminhar com Ele todos os dias."
        },
        "resumoTelas": [
          "Quando erramos, nossa tendência é esconder-nos. Foi assim com Adão e Eva no jardim do Éden e continua sendo assim conosco. Muitas vezes nos escondemos atrás da rotina, do trabalho, da culpa ou até da religiosidade, imaginando que precisamos 'arrumar a vida' antes de nos aproximarmos de Deus.",
          "Gênesis 3 revela uma verdade extraordinária: a primeira reação de Deus ao pecado humano não foi abandonar o homem, mas procurá-lo. Ao perguntar 'Onde você está?', Deus não buscava informação; Ele oferecia um convite ao arrependimento e à restauração do relacionamento.",
          "Essa graça alcançou sua plenitude em Jesus Cristo, que veio buscar e salvar o que se havia perdido. Nossa caminhada com Deus não começa pelos nossos esforços, mas pela iniciativa do próprio Deus."
        ],
        "artigo": {
          "titulo": "Dia 1 — O Convite para Caminhar com Deus",
          "url": "https://feemmissao.com.br/2026/07/30/dia-1-o-convite-para-caminhar-com-deus/"
        },
        "reflexao": [
          "O que significa buscar a Deus diariamente?",
          "Quais obstáculos dificultam sua vida devocional?",
          "O que você espera que Deus faça durante esta estação?"
        ],
        "diarioPerguntas": [
          "O que Deus falou ao seu coração hoje?",
          "Como você pretende responder?",
          "Que oração deseja registrar?"
        ],
        "oracaoSugerida": "Senhor, desejo conhecê-lo mais profundamente. Ensina-me a permanecer em tua presença e transforma minha vida enquanto caminho contigo. Amém.",
        "encerramento": "Parabéns por concluir o primeiro dia. A transformação acontece passo a passo. Amanhã continuaremos esta caminhada."
      },
      {
        "day": 2,
        "title": "Dia 2",
        "confronto": "Quando você abre a Bíblia, é para encontrar Deus — ou para cumprir uma obrigação religiosa?",
        "direcao": "A Palavra não é conteúdo para consumir. É a voz de Deus para ouvir. Leia hoje com ouvidos de discípulo.",
        "acao": "Abra em Salmos.\nLeia um salmo inteiro em voz alta, devagar.\nSublinhe uma frase que te confrontou.\nOre sobre essa frase por 5 minutos.\nEscreva o que Deus disse.",
        "tema": "Permanecer antes de produzir",
        "mensagemAbertura": "Ontem você iniciou sua jornada. Hoje você descobrirá que o segredo da vida cristã não é fazer mais, mas permanecer mais perto de Deus.",
        "videoRoteiro": "Retomar o Dia 1; explicar João 15 e a imagem da videira; mostrar que intimidade precede serviço; convidar o participante a viver esse princípio ainda hoje.",
        "videoUrl": "https://youtu.be/HAYugdwkUSA",
        "artigoRico": {
          "titulo": "Permanecer antes de Produzir",
          "texto": "João 15 mostra que Deus não procura apenas pessoas ocupadas, mas discípulos que permanecem nEle. A produtividade espiritual nasce da permanência, não a substitui."
        },
        "resumoTelas": [
          "Vivemos pressionados a produzir resultados, e essa lógica muitas vezes afeta nossa vida espiritual. Jesus nos convida a algo maior: permanecer Nele.",
          "Assim como o ramo só produz fruto quando permanece ligado à videira, nossa vida só floresce quando permanecemos em Cristo.",
          "O ativismo religioso nunca substitui a comunhão com Deus. Antes do fazer vem o ser; antes da missão vem a presença.",
          "A intimidade cresce por meio da oração, da Palavra e da constância. Os frutos aparecem naturalmente em quem permanece em Cristo.",
          "O segredo da vida cristã não é produzir mais, mas permanecer mais.",
          "Pai, ensina-me a permanecer em Ti todos os dias. Amém."
        ],
        "desafioArtigo": "Reserve um horário para estar com Deus hoje.",
        "artigo": {
          "titulo": "Dia 2 — Permanecer antes de Produzir",
          "url": "https://feemmissao.com.br/2026/07/30/dia-2-permanecer-antes-de-produzir/"
        },
        "reflexao": [
          "Minha comunhão com Deus depende apenas das circunstâncias?",
          "Tenho buscado produzir resultados antes de cultivar relacionamento?",
          "O que preciso reorganizar para priorizar a presença de Deus?"
        ],
        "diarioPerguntas": [
          "O que Deus falou comigo hoje? O que mais chamou minha atenção?",
          "Qual decisão prática assumo para amanhã? Escreva uma oração pessoal."
        ],
        "oracaoSugerida": "Pai, ajuda-me a permanecer em tua presença antes de buscar resultados. Que minha vida encontre em Cristo sua fonte de força, alegria e direção. Amém.",
        "encerramento": "Você concluiu mais um passo. A intimidade com Deus é construída um dia de cada vez. Continue caminhando."
      },
      {
        "day": 3,
        "title": "Dia 3",
        "confronto": "Você ora por 5 pessoas específicas pelo nome todos os dias — ou sua intercessão é genérica e vaga?",
        "direcao": "A oração intercessória é prática de amor. Escolha 5 nomes. Leve-os a Deus com intenção real.",
        "acao": "Escreva 5 nomes em um papel.\nOre por cada um pelo nome — mínimo 2 minutos por pessoa.\nSem pressa. Sem atalho.\nGuarde o papel para os próximos dias.",
        "tema": "Aprendendo a ouvir a voz de Deus",
        "versiculo": "João 10:27 — \"As minhas ovelhas ouvem a minha voz; eu as conheço, e elas me seguem.\"",
        "mensagemAbertura": "Hoje você será desafiado a desacelerar para ouvir Aquele que deseja falar com você todos os dias.",
        "videoRoteiro": "Retomada dos dias anteriores; apresentação de João 10; exemplos práticos de como cultivar uma escuta sensível; convite à prática do dia.",
        "videoUrl": "https://youtu.be/zGWWJ98hxpQ",
        "artigoRico": {
          "titulo": "A voz do Bom Pastor",
          "texto": "Deus fala principalmente por sua Palavra, iluminada pelo Espírito Santo, conduzindo o discípulo à obediência. Aplicação: crie um ambiente de silêncio, leia lentamente, anote percepções e obedeça ao que foi compreendido."
        },
        "resumoTelas": [
          "Deus continua falando ao seu povo. Muitas pessoas esperam experiências extraordinárias, mas Jesus ensina que suas ovelhas aprendem a reconhecer sua voz porque vivem em relacionamento com Ele. A intimidade desenvolve uma escuta sensível.",
          "A principal forma pela qual Deus fala hoje é por meio das Escrituras. Quando lemos a Bíblia com atenção e dependemos da ação do Espírito Santo, somos conduzidos a conhecer a vontade de Deus e a discernir sua direção para a vida.",
          "Ouvir a voz de Deus vai além de adquirir conhecimento. O verdadeiro discípulo responde com obediência. Cada passo de fidelidade fortalece a comunhão com Cristo e torna a voz do Bom Pastor cada vez mais familiar.",
          "Em um mundo cheio de distrações, precisamos criar espaço para ouvir Deus. Separar tempo para a leitura da Palavra, a oração e o silêncio diante do Senhor permitem que nosso coração seja moldado e direcionado por sua voz.",
          "O discípulo aprende a reconhecer a voz de Deus quando caminha diariamente com o Bom Pastor.",
          "Senhor Jesus, abre meus ouvidos espirituais para reconhecer tua voz. Dá-me um coração atento à tua Palavra e coragem para obedecer àquilo que o Senhor me ensinar. Amém."
        ],
        "desafioArtigo": "Leia João 10.27–30 duas vezes. Na primeira leitura, observe o que Jesus diz sobre suas ovelhas. Na segunda, pergunte: \"Senhor, o que desejas me ensinar hoje?\" Anote uma decisão prática e coloque-a em ação.",
        "artigo": {
          "titulo": "Dia 3 — A Voz do Bom Pastor",
          "url": "https://feemmissao.com.br/2026/07/30/dia-3-a-voz-do-bom-pastor/"
        },
        "reflexao": [
          "Tenho reservado tempo para ouvir antes de falar?",
          "Quando foi a última vez que obedeci a algo que Deus me mostrou?",
          "O que dificulta minha atenção à Palavra?"
        ],
        "diarioPerguntas": [
          "O que mais falou ao meu coração?",
          "Qual verdade preciso colocar em prática?",
          "Que oração nasce desta leitura?"
        ],
        "oracaoSugerida": "Senhor, abre meus ouvidos espirituais. Dá-me um coração sensível à tua Palavra e coragem para obedecer ao que o Senhor me revelar.",
        "encerramento": "A intimidade cresce quando ouvimos e obedecemos. Amanhã continuaremos fortalecendo esse relacionamento."
      },
      {
        "day": 4,
        "title": "Dia 4",
        "confronto": "Quantos dias você passou esta semana sem dedicar tempo real à presença de Deus?",
        "direcao": "O discípulo não negocia o TSD. É o primeiro compromisso do dia — antes das redes, antes do trabalho.",
        "acao": "Acorde 20 minutos mais cedo amanhã.\nAntes de qualquer tela: ore.\nLeia um capítulo dos Evangelhos.\nPeça a Deus que fale com você hoje especificamente.",
        "tema": "Respondendo à voz de Deus",
        "versiculo": "Tiago 1:22 — \"Sejam praticantes da Palavra, e não apenas ouvintes.\"",
        "mensagemAbertura": "Deus já falou com você. Hoje o desafio é responder. Toda transformação começa quando a Palavra encontra um coração obediente.",
        "videoRoteiro": "Recordar os três primeiros dias; explicar que conhecimento sem obediência produz estagnação; exemplos bíblicos de resposta imediata; desafio de um passo concreto hoje.",
        "videoUrl": "https://youtu.be/QctdiznKeUQ",
        "artigoRico": {
          "titulo": "Ouvir, Crer e Obedecer",
          "texto": "A obediência é fruto do amor a Deus, não mera obrigação. A prática cotidiana confirma o discipulado e molda o caráter de Cristo."
        },
        "resumoTelas": [
          "Deus fala conosco por meio da sua Palavra, mas ouvir é apenas o início da caminhada. O verdadeiro discípulo responde ao que Deus revela, permitindo que a verdade transforme sua maneira de viver.",
          "Tiago compara a Palavra de Deus a um espelho. Ela revela quem realmente somos e mostra o que precisa ser transformado. Ler a Bíblia sem colocar seus ensinamentos em prática é como olhar para um espelho e sair sem mudar nada.",
          "A obediência não nasce do medo, mas do amor por Deus. Cada pequena decisão de fidelidade fortalece nossa comunhão com Cristo e molda nosso caráter. O discipulado é construído por meio de atitudes diárias de obediência.",
          "Nem sempre obedecer será fácil, mas Deus nunca nos conduz por um caminho que não seja para o nosso bem. Quando respondemos à sua voz com confiança, experimentamos crescimento espiritual e uma vida cada vez mais semelhante à de Jesus.",
          "O discípulo demonstra que ouviu a voz de Deus quando coloca sua Palavra em prática.",
          "Pai, livra-me de ser apenas um ouvinte da tua Palavra. Dá-me coragem para obedecer ao que o Senhor me ensina e transforma minha vida para que minhas atitudes revelem minha fé. Em nome de Jesus, amém."
        ],
        "desafioArtigo": "Identifique uma verdade que Deus já lhe mostrou por meio das Escrituras e dê hoje um passo concreto de obediência. Ao final do dia, registre como essa decisão impactou sua caminhada com Cristo.",
        "artigo": {
          "titulo": "Dia 4 — Respondendo à Voz de Deus",
          "url": "https://feemmissao.com.br/2026/07/30/dia-4-respondendo-a-voz-de-deus/"
        },
        "reflexao": [
          "Qual foi a última direção de Deus que adiei?",
          "Existe alguma área da minha vida em que conheço a vontade de Deus, mas ainda não obedeci?",
          "Qual pequeno passo de obediência posso dar hoje?"
        ],
        "diarioPerguntas": [
          "O que Deus pediu?",
          "Qual decisão foi tomada?",
          "Quais dificuldades surgiram e como você percebeu a ação de Deus?"
        ],
        "oracaoSugerida": "Senhor, dá-me coragem para obedecer. Que minha fé não permaneça apenas nas palavras, mas seja visível em minhas atitudes. Amém.",
        "encerramento": "Cada ato de obediência fortalece sua intimidade com Deus. Amanhã continuaremos avançando nessa jornada."
      },
      {
        "day": 5,
        "title": "Dia 5",
        "confronto": "Você jejua? Quando foi a última vez que você abriu mão de algo para buscar a Deus com mais intensidade?",
        "direcao": "O jejum bíblico não é dieta espiritual. É uma declaração de que Deus é mais necessário que o pão. Pratique hoje.",
        "acao": "Escolha uma refeição para não fazer hoje.\nNos momentos em que sentiria fome, ore em vez de comer.\nDedique esse tempo ao TSD.\nAo fim do dia, escreva o que Deus fez nesse tempo.",
        "tema": "Cultivando uma vida de oração",
        "versiculo": "1 Tessalonicenses 5:17 — \"Orem continuamente.\"",
        "mensagemAbertura": "Conversar com Deus transforma a maneira como enfrentamos cada dia. Hoje você dará mais um passo para fazer da oração um hábito de vida.",
        "videoRoteiro": "Apresentar a oração como diálogo com Deus; desfazer a ideia de que é necessário usar palavras elaboradas; incentivar uma rotina simples e constante de oração.",
        "videoUrl": "https://youtu.be/hM4P-98vNew",
        "artigoRico": {
          "titulo": "O privilégio de falar com o Pai",
          "texto": "Fundamentos bíblicos da oração, exemplos de Jesus, a importância da perseverança e da confiança em Deus, com aplicações práticas para o cotidiano."
        },
        "resumoTelas": [
          "A oração é muito mais do que um momento para apresentar pedidos a Deus. Ela é o caminho pelo qual cultivamos nossa comunhão com o Pai. Assim como todo relacionamento cresce por meio do diálogo, nossa intimidade com Deus se fortalece quando fazemos da oração um hábito diário.",
          "Ao pedir que Jesus os ensinasse a orar, os discípulos aprenderam que Deus é um Pai amoroso. A oração nos aproxima dele com confiança, ajudando-nos a buscar não apenas nossas necessidades, mas também a viver de acordo com a sua vontade.",
          "A oração transforma primeiro quem ora. Na presença de Deus, nosso coração é moldado, nossa fé é fortalecida e aprendemos a confiar mesmo quando as respostas não chegam no tempo que esperamos. A comunhão com Deus nos torna mais semelhantes a Cristo.",
          "Jesus nos ensina a perseverar em oração. O Pai sempre ouve seus filhos e sabe do que precisamos. Mais do que conceder bênçãos, Deus deseja nos dar o maior presente de todos: sua própria presença, por meio do Espírito Santo.",
          "O discípulo cresce em intimidade com Deus quando transforma a oração em um estilo de vida.",
          "Pai amado, ensina-me a desfrutar da tua presença todos os dias. Que a oração seja mais do que um hábito; seja o lugar onde minha fé é fortalecida e meu coração é transformado. Em nome de Jesus, amém."
        ],
        "desafioArtigo": "Reserve hoje pelo menos quinze minutos para estar a sós com Deus. Leia Lucas 11.1–13, converse com o Pai sobre o que está em seu coração e permaneça alguns minutos em silêncio, permitindo que Ele fale com você por meio da sua Palavra.",
        "artigo": {
          "titulo": "Dia 5 — Uma Vida de Oração",
          "url": "https://feemmissao.com.br/2026/07/30/dia-5-uma-vida-de-oracao/"
        },
        "reflexao": [
          "Como está minha vida de oração?",
          "Minha oração é apenas uma lista de pedidos?",
          "O que preciso mudar para conversar mais com Deus durante o dia?"
        ],
        "diarioPerguntas": [
          "Pelo que você agradeceu?",
          "Por quem você intercedeu?",
          "O que percebeu durante a oração e qual compromisso deseja assumir?"
        ],
        "oracaoSugerida": "Pai, obrigado porque posso me aproximar de Ti com confiança. Ensina-me a viver em constante comunhão contigo e a depender da tua vontade. Amém.",
        "encerramento": "Cada momento de oração fortalece seu relacionamento com Deus. Continue firme; amanhã a jornada prossegue."
      },
      {
        "day": 6,
        "title": "Dia 6",
        "confronto": "Sua vida devocional é disciplina real ou depende de sentir vontade?",
        "direcao": "Intimidade com Deus se constrói no dia que você não quer ir. A fidelidade não espera o sentimento.",
        "acao": "Mesmo sem vontade: sente, abre a Bíblia.\nLeia Salmo 63 inteiro.\nOre em voz alta por 10 minutos.\nSe vier dispersão, volte. Sem se condenar.",
        "tema": "Dia 6 — Consolidação da Semana",
        "consolidacao": true,
        "videoRoteiro": "Recordar os temas dos Dias 1 a 5; destacar o progresso da caminhada; mostrar como os temas se conectam; incentivar a prática contínua. Sem conteúdo novo.",
        "reflexao": [
          "O que Deus mais falou comigo nesta semana?",
          "Em qual área percebi maior crescimento?",
          "Qual hábito preciso fortalecer?",
          "O que ainda preciso entregar ao Senhor?"
        ],
        "desafioSemana": "Escolha um dos aprendizados desta semana. Viva esse aprendizado de maneira intencional durante o dia de hoje. Ao final do dia você registrará como Deus trabalhou através dessa decisão. Não é um desafio novo. É colocar em prática aquilo que já foi aprendido.",
        "diarioPerguntas": [
          "Principal aprendizado da semana",
          "Como pretendo colocar esse aprendizado em prática?",
          "Escreva uma breve oração pedindo forças para viver esse compromisso."
        ],
        "oracaoSugerida": "Senhor, obrigado porque tens falado comigo durante esta semana. Ajuda-me a transformar aquilo que aprendi em um novo estilo de vida. Dá-me perseverança para viver tua Palavra todos os dias. Amém.",
        "encerramento": "Parabéns. Hoje você consolidou os aprendizados desta primeira semana. Amanhã não será um dia de estudo. Será um dia para celebrar a fidelidade de Deus, recordar sua caminhada e agradecer por tudo o que Ele realizou em sua vida."
      },
      {
        "day": 7,
        "title": "Dia 7",
        "confronto": "O que mudou em você desde o início desta estação? Deus está falando — você está ouvindo?",
        "direcao": "Revise a semana. O TSD não é ritual — é relacionamento. O que você levou de real para Deus esta semana?",
        "acao": "Reserve 30 minutos hoje.\nReleia o que escreveu durante a semana.\nOre de gratidão pelos dias cumpridos.\nPeça a Deus que aprofunde o que começou.",
        "tema": "Celebração da Semana",
        "memorialSemana": true,
        "videoRoteiro": "Agradecimento pela semana; testemunhos inspiradores; celebração da fidelidade de Deus; encorajamento para perseverar. Sem revisão, sem conteúdo novo.",
        "celebracaoTexto": "Reserve alguns minutos para agradecer a Deus. Louve ao Senhor pela caminhada desta semana. Reconheça sua fidelidade. Celebre aquilo que Ele começou a fazer em sua vida.",
        "oracaoSugerida": "Senhor, obrigado porque estiveste comigo durante toda esta semana. Obrigado por tua Palavra. Obrigado pelas pequenas transformações que começaste em meu coração. Que eu continue caminhando contigo na próxima semana. Amém.",
        "encerramento": "🎉 Parabéns! Você concluiu a primeira semana da Estação Intimidade com Deus. Celebre o que Deus já fez. Amanhã uma nova semana começa. Continue caminhando. Cada passo o aproxima mais de Cristo."
      },
      {
        "day": 8,
        "title": "Dia 8",
        "confronto": "Você está orando por pessoas ou apenas por si mesmo?",
        "direcao": "A intimidade com Deus expande o coração para o próximo. Quem está na sua lista de intercessão?",
        "acao": "Retome os 5 nomes escritos no dia 3.\nOre por cada um com mais detalhe hoje.\nPergunte a Deus o que Ele quer fazer na vida de cada um.\nEsteja disponível para ser a resposta."
      },
      {
        "day": 9,
        "title": "Dia 9",
        "confronto": "Você está lendo a Palavra para entender — ou apenas para concluir a leitura do dia?",
        "direcao": "Um versículo ouvido e obedecido vale mais que um capítulo lido por obrigação.",
        "acao": "Leia apenas 8 versículos hoje — João 15:1-8.\nLeia devagar. Três vezes.\nPergunta: o que Jesus está pedindo de mim aqui?\nOre sobre a resposta."
      },
      {
        "day": 10,
        "title": "Dia 10",
        "confronto": "Quando você ora, está falando — ou também está ouvindo?",
        "direcao": "Oração é diálogo. Não monólogo. Deixe espaço para o silêncio onde Deus fala.",
        "acao": "Ore por 10 minutos.\nNos últimos 5 minutos: fique em silêncio total.\nNão preencha. Aguarde.\nEscreva qualquer impressão que vier."
      },
      {
        "day": 11,
        "title": "Dia 11",
        "confronto": "O TSD é a primeira coisa do seu dia — ou a última, quando sobra tempo?",
        "direcao": "O que vem primeiro revela o que é mais importante. Reordene sua manhã a partir de hoje.",
        "acao": "Amanhã: TSD antes de qualquer coisa.\nHoje: prepare o lugar onde vai sentar amanhã.\nDeixe a Bíblia aberta, o caderno pronto.\nElimine a desculpa da organização."
      },
      {
        "day": 12,
        "title": "Dia 12",
        "confronto": "Você tem um lugar de oração — ou ora de qualquer jeito, em qualquer lugar, sem intenção?",
        "direcao": "Jesus tinha o costume de ir a lugares específicos para orar. Crie o seu hábito e o seu lugar.",
        "acao": "Defina o seu lugar de oração.\nVá até lá agora.\nOre por 15 minutos nesse lugar.\nFaça disso um compromisso diário."
      },
      {
        "day": 13,
        "title": "Dia 13",
        "confronto": "Você jejuou esta semana? O que sua resposta revela sobre sua intimidade com Deus?",
        "direcao": "O jejum não é sobre comida — é sobre prioridade. Deus antes do pão.",
        "acao": "Faça um jejum de uma refeição hoje.\nNos horários das refeições: ore.\nLeia Mateus 6:6-18.\nPergunte: o que preciso largar para me aproximar mais?"
      },
      {
        "day": 14,
        "title": "Dia 14",
        "confronto": "Quatorze dias nesta estação. O que concretamente mudou na sua vida devocional?",
        "direcao": "Transformação não é sentimento — é prática repetida. Avalie com honestidade.",
        "acao": "Anote três mudanças concretas desde o dia 1.\nSe não há mudanças: identifique o que impediu.\nOre pedindo graça para a segunda metade desta estação.\nRecomece com intenção renovada."
      },
      {
        "day": 15,
        "title": "Dia 15",
        "confronto": "Você está buscando a Deus ou está buscando experiências espirituais?",
        "direcao": "Intimidade com Deus não é emoção — é confiança construída no silêncio e na obediência.",
        "acao": "Leia Salmo 27 inteiro.\nSublinhe: 'Uma coisa pedi ao Senhor'.\nPergunta: qual é a sua uma coisa?\nOre sobre isso por 15 minutos."
      },
      {
        "day": 16,
        "title": "Dia 16",
        "confronto": "Suas 5 pessoas de intercessão — você acompanhou o que Deus tem feito na vida delas?",
        "direcao": "Intercessão sem atenção é oração sem amor. Olhe para essas pessoas de perto.",
        "acao": "Entre em contato com uma das 5 pessoas.\nNão mencione que está orando por ela — só pergunte como está.\nOuça de verdade.\nOre por ela depois, com o que ouviu."
      },
      {
        "day": 17,
        "title": "Dia 17",
        "confronto": "Você tem confessado seus pecados a Deus com especificidade — ou sua confissão é genérica e sem arrependimento real?",
        "direcao": "'Confessai os vossos pecados uns aos outros.' Deus não precisa de generalidades. Ele quer verdade.",
        "acao": "Reserve 10 minutos.\nConfesse um pecado específico a Deus em voz alta.\nNomeie. Não minimize.\nReceba o perdão — Leia 1 João 1:9 após confessar."
      },
      {
        "day": 18,
        "title": "Dia 18",
        "confronto": "Como está sua leitura bíblica? Você está apenas lendo — ou a Palavra está te lendo?",
        "direcao": "A Bíblia é viva. Ela discerne os pensamentos e intenções do coração. Deixe-a agir.",
        "acao": "Leia Hebreus 4:12-13 três vezes.\nDepois feche a Bíblia.\nPergunta: o que a Palavra expôs em você hoje?\nOre sobre o que surgiu."
      },
      {
        "day": 19,
        "title": "Dia 19",
        "confronto": "Você tem mais facilidade de falar sobre Deus do que de falar com Deus?",
        "direcao": "Discipulado começa em oração, não em conhecimento. Menos teoria, mais presença.",
        "acao": "Sem ler nada hoje.\nSó ore. 20 minutos inteiros.\nFale, escute, agradeça, peça.\nAo fim: escreva uma frase sobre o que Deus é para você hoje."
      },
      {
        "day": 20,
        "title": "Dia 20",
        "confronto": "O TSD desta estação virou hábito — ou ainda é esforço diário sem ancoragem?",
        "direcao": "Hábito se forma em 21 dias de fidelidade. Você está quase lá. Não desista agora.",
        "acao": "Faça o TSD completo: 15 min oração + 15 min Palavra.\nDepois liste 3 frases que Deus falou com você ao longo desta estação.\nCompartilhe com alguém de confiança o que aprendeu."
      },
      {
        "day": 21,
        "title": "Dia 21",
        "confronto": "Você completou 21 dias de Intimidade com Deus. O que ficou? O que mudou de verdade?",
        "direcao": "Esta estação não termina — ela se torna o chão de todas as outras. Intimidade com Deus é o ponto de partida e o ponto de chegada.",
        "acao": "Escreva uma carta de uma página para Deus.\nAgradecimento, confissão, pedido — o que precisar.\nOre sobre o que escreveu.\nGuarde essa carta. Você vai querer reler no fim da jornada."
      }
    ]
  },
  {
    "id": "street",
    "title": "Família",
    "days": [
      {
        "day": 1,
        "title": "Dia 1",
        "confronto": "Nos últimos 7 dias, quanto tempo intencional você dedicou à sua família — sem tela, sem distração?",
        "direcao": "Estação 2: Família. O discípulo que não cuida de quem está ao seu lado perde a base da formação. A missão começa em casa.",
        "acao": "Hoje: refeição com a família — sem celular na mesa.\nConversa real: cada um fala algo do seu dia.\nOre junto ao fim da refeição.\nSe você mora sozinho: ligue para um familiar com intenção real.",
        "artigoRico": {
          "titulo": "Quando a Fé Chega em Casa",
          "texto": "Dá para orar todo dia, estudar a Bíblia e nunca faltar à igreja — e ainda assim perder a paciência com quem mais amamos. A fé cristã precisa alcançar a maneira como vivemos dentro de casa."
        },
        "resumoTelas": [
          "É possível orar, estudar a Bíblia e participar da igreja e, ainda assim, ter dificuldade para viver a fé dentro de casa. Isso acontece porque é nos relacionamentos mais próximos que nossa fé encontra a vida real. É ali que somos confrontados com nossas limitações, nossos hábitos, nossas palavras e nossas reações.",
          "O discipulado não transforma apenas aquilo que fazemos na igreja. Ele transforma a maneira como vivemos com as pessoas que Deus colocou ao nosso lado. Por isso, hoje não comece tentando mudar ninguém. Comece olhando para você.",
          "Como você fala com sua família? Como reage quando está cansado ou contrariado? Você tem estado presente? Tem demonstrado amor? Como lida com os conflitos? Não olhe para essas perguntas para encontrar culpa. Olhe para perceber.",
          "Antes de transformar uma atitude, precisamos reconhecê-la. Antes de mudar alguma coisa dentro de casa, precisamos permitir que Deus nos mostre como temos vivido. A fé começa a chegar em casa quando aquilo que cremos sobre Deus começa a aparecer na maneira como tratamos as pessoas mais próximas de nós."
        ],
        "artigo": {
          "titulo": "Quando a Fé Chega em Casa",
          "url": "https://feemmissao.com.br/2026/08/31/quando-a-fe-chega-em-casa/"
        },
        "desafioArtigo": "Olhe para sua casa com novos olhos. Hoje, observe conscientemente sua maneira de se relacionar com sua família. Perceba suas palavras, suas reações, seus momentos de presença e também aquilo que costuma gerar tensão. Não tente resolver tudo. Apenas observe e pergunte: O que da minha caminhada com Deus já pode ser percebido na maneira como trato minha família?",
        "diarioPerguntas": [
          "O que percebi sobre mim hoje?"
        ]
      },
      {
        "day": 2,
        "title": "Dia 2",
        "confronto": "Você ora com sua família regularmente — ou isso é esporádico e sem compromisso?",
        "direcao": "O culto doméstico não é tarefa dos pastores — é responsabilidade do discípulo dentro de casa.",
        "acao": "Reúna sua família hoje.\nLeia um trecho curto da Bíblia — Josué 24:15.\nOre juntos por 5 minutos — cada um ora uma frase.\nFaça isso pelo menos 3 vezes esta semana.",
        "artigoRico": {
          "titulo": "Presença que Comunica Amor",
          "texto": "Estar perto de alguém não significa necessariamente estar presente. A presença verdadeira exige atenção, escuta e disposição para compartilhar a vida com o outro."
        },
        "resumoTelas": [
          "Estar perto de alguém não significa necessariamente estar presente. Podemos morar na mesma casa, fazer refeições juntos e compartilhar a rotina, mas nossa atenção pode estar sempre em outro lugar — celular, trabalho, preocupações.",
          "Mas atenção também é uma forma de amor. Quando ouvimos de verdade, demonstramos que o outro importa. Quando deixamos de lado uma distração para conversar, comunicamos que aquele momento tem valor.",
          "A convivência familiar não precisa de grandes acontecimentos para ser significativa. Uma refeição, uma caminhada, um café ou alguns minutos de conversa podem se tornar momentos importantes quando existe presença verdadeira.",
          "O discipulado também acontece assim: aprendemos a amar servindo, ouvindo e cuidando das pessoas que Deus colocou perto de nós. Hoje, não pense apenas em quanto tempo você passa com sua família — pense em como você está presente quando está com ela."
        ],
        "artigo": {
          "titulo": "Presença que Comunica Amor",
          "url": "https://feemmissao.com.br/2026/08/31/presenca-que-comunica-amor/"
        },
        "desafioArtigo": "Esteja presente. Escolha hoje um momento para estar com sua família de forma intencional. Pode ser uma refeição, uma conversa, uma caminhada ou uma atividade simples. Durante esse momento: deixe de lado as distrações; escute de verdade; faça perguntas; esteja inteiro naquele encontro. Não precisa fazer algo especial. Precisa estar presente.",
        "diarioPerguntas": [
          "Como foi estar verdadeiramente presente? O que percebi sobre minha família e sobre mim?"
        ]
      },
      {
        "day": 3,
        "title": "Dia 3",
        "confronto": "Há conflito não resolvido na sua família? Você tem evitado ou enfrentado com graça?",
        "direcao": "Reconciliação é prática discipular. Não espere o outro dar o primeiro passo.",
        "acao": "Identifique uma tensão real na sua família.\nDê o primeiro passo: converse com humildade.\nNão para ganhar — para restaurar.\nOre antes de falar.",
        "artigoRico": {
          "titulo": "Amor, Respeito e Serviço Dentro de Casa",
          "texto": "Dentro de casa, nossas palavras têm um peso diferente. Amar a família não significa apenas sentir carinho — significa aprender a tratar cada pessoa com amor, respeito e disposição para servir."
        },
        "resumoTelas": [
          "Dentro de casa, o amor precisa se transformar em atitudes. Amar é buscar o bem do outro. Respeitar é reconhecer seu valor. Servir é estar disposto a agir em favor dele.",
          "\"Sujeitando-vos uns aos outros no temor de Cristo\" (Efésios 5.21). Na perspectiva de Jesus, liderança não é domínio — é saber ouvir, reconhecer a capacidade do outro e abrir espaço para que ele também lidere.",
          "Submeter-se não significa anular-se. Significa estar disposto a considerar a necessidade legítima do outro, colocando nossa vontade em segundo plano para cuidar.",
          "Homens e mulheres precisam ser amados e honrados — a mulher tende a valorizar sentir-se amada; o homem, sentir-se reconhecido e honrado. Não basta amar do nosso jeito: o outro consegue perceber aquilo que estamos oferecendo?",
          "No casamento e na família, o amor aparece em pequenas escolhas: ouvir, agradecer, ajudar, encorajar, respeitar, servir e dedicar tempo. Não precisamos esperar uma ocasião especial para demonstrar amor."
        ],
        "artigo": {
          "titulo": "Amor, Respeito e Serviço Dentro de Casa",
          "url": "https://feemmissao.com.br/2026/08/31/amor-respeito-e-servico-dentro-de-casa/"
        },
        "desafioArtigo": "Escolha uma atitude de amor. Hoje, faça intencionalmente algo que demonstre amor, respeito ou cuidado por alguém da sua família. Se você é casado(a): separe um período de qualidade com seu cônjuge. Planeje esse momento, proteja-o das interrupções e esteja verdadeiramente presente. Não precisa ser algo caro ou extraordinário. O importante é que o outro perceba que ele é importante para você.",
        "diarioPerguntas": [
          "O que fiz para demonstrar amor? Como foi servir e estar presente?"
        ]
      },
      {
        "day": 4,
        "title": "Dia 4",
        "confronto": "Seus filhos, cônjuge ou pais sabem que você está nesta jornada de discipulado? Eles veem diferença em você?",
        "direcao": "A fé que não transforma a convivência familiar é fé que ainda não chegou em casa.",
        "acao": "Conta para sua família o que é o Talmidim.\nNão pregue — compartilhe o que está vivendo.\nPergunte o que eles percebem de diferente em você.\nOuça sem se defender.",
        "artigoRico": {
          "titulo": "Quando a Fé Reúne a Família",
          "texto": "É possível que todos em uma família sejam cristãos e, ainda assim, cada um viva sua espiritualidade de forma isolada. Existe algo especial quando uma família aprende a buscar a Deus junta."
        },
        "resumoTelas": [
          "A caminhada com Deus é pessoal, mas não precisa ser vivida de forma isolada dentro de casa. Uma família pode ter membros cristãos e, ainda assim, quase nunca conversar sobre Deus, compartilhar suas lutas ou orar juntos.",
          "Deuteronômio nos lembra que a fé deve fazer parte da vida cotidiana: em casa, no caminho, ao deitar e ao levantar. A espiritualidade familiar não é apenas cumprir uma obrigação religiosa — é criar espaço para Deus na vida que a família já vive.",
          "Uma conversa. Uma oração. Um motivo de gratidão. Um texto bíblico. Uma necessidade compartilhada. Pequenos momentos podem ajudar a construir algo maior: uma família que aprende a reconhecer, buscar e seguir a Deus juntos.",
          "Não precisa ser perfeito. Precisa apenas começar."
        ],
        "artigo": {
          "titulo": "Quando a Fé Reúne a Família",
          "url": "https://feemmissao.com.br/2026/08/31/quando-a-fe-reune-a-familia/"
        },
        "desafioArtigo": "Tempo de qualidade e fé em família. Hoje, separe um tempo intencional para estar com sua família. Conversem. Ouçam uns aos outros. Compartilhem algo sobre o dia. Depois, reservem alguns minutos para um momento simples de culto doméstico: leiam um pequeno texto bíblico; compartilhem um motivo de gratidão; conversem brevemente sobre o texto; orem juntos. Não se preocupe em fazer algo longo ou elaborado.",
        "diarioPerguntas": [
          "Como foi separar esse tempo para minha família? O que percebi quando buscamos a Deus juntos?"
        ]
      },
      {
        "day": 5,
        "title": "Dia 5",
        "confronto": "Você protege o tempo com sua família — ou deixa que o trabalho, o ministério e as distrações tomem esse espaço?",
        "direcao": "Agenda revela valor. O que a sua agenda diz sobre o quanto você valoriza sua família?",
        "acao": "Abra sua agenda da próxima semana.\nColoque um bloco fixo de tempo com a família — intocável.\nComunique isso à família hoje.\nCumpra.",
        "artigoRico": {
          "titulo": "Discipulado Familiar: O Que Estamos Transmitindo Dentro de Casa?",
          "texto": "Toda família transmite alguma coisa. Mesmo quando ninguém se senta para ensinar uma lição, a convivência está formando pessoas."
        },
        "resumoTelas": [
          "Toda família transmite alguma coisa. Mesmo sem perceber, nossas palavras, atitudes e reações estão ensinando aqueles que convivem conosco.",
          "A Bíblia nos chama a transmitir às próximas gerações os feitos do Senhor. E a história de Timóteo nos mostra como uma fé sincera pode marcar uma família. Mas a fé não é transmitida apenas pelo que ensinamos — ela também é percebida na maneira como vivemos.",
          "Quando pedimos perdão. Quando enfrentamos dificuldades confiando em Deus. Quando servimos. Quando conversamos sobre aquilo que Deus tem feito. Você não precisa ser perfeito para discipular sua família — precisa viver uma fé verdadeira.",
          "Dentro de casa, estamos transmitindo alguma coisa todos os dias. A pergunta é: o que minha vida está ensinando às pessoas que convivem comigo?"
        ],
        "artigo": {
          "titulo": "Discipulado Familiar: O Que Estamos Transmitindo Dentro de Casa?",
          "url": "https://feemmissao.com.br/2026/08/31/discipulado-familiar-o-que-estamos-transmitindo-dentro-de-casa/"
        },
        "desafioArtigo": "Compartilhe sua fé. Hoje, escolha um momento para conversar com alguém da sua família sobre aquilo que Deus tem feito em sua vida. Você pode: contar uma experiência em que percebeu o cuidado de Deus; compartilhar uma resposta de oração; falar sobre algo que Deus tem ensinado a você; lembrar uma situação difícil em que Deus sustentou você. Depois, pergunte: \"E você? O que Deus tem feito ou ensinado em sua vida?\" Não transforme o momento em um sermão.",
        "diarioPerguntas": [
          "O que compartilhei sobre minha fé? Como essa conversa aconteceu?"
        ]
      },
      {
        "day": 6,
        "title": "Dia 6",
        "confronto": "Você tem dito palavras de afirmação e cuidado para as pessoas da sua casa — ou assume que elas já sabem?",
        "direcao": "'Edificai uns aos outros.' A família é o primeiro lugar onde o discípulo pratica o amor.",
        "acao": "Hoje: diga a cada membro da sua família algo específico de gratidão ou afirmação.\nNão genérico — específico.\nOlho no olho.\nSem ironia."
      },
      {
        "day": 7,
        "title": "Dia 7",
        "confronto": "Você está presente quando está em casa — ou está presente no corpo mas ausente no espírito?",
        "direcao": "Presença real é mais que localização física. É atenção, escuta, intenção.",
        "acao": "Por 2 horas hoje: sem celular, sem TV.\nEsteja completamente disponível para quem está em casa.\nPergunte: o que você precisa de mim hoje?\nFaça o que pedirem."
      },
      {
        "day": 8,
        "title": "Dia 8",
        "confronto": "Sua família sente que você os ama ou que você os tolera?",
        "direcao": "Amor não é só ausência de brigas. É presença ativa, cuidado concreto, palavra e gesto.",
        "acao": "Faça algo prático de cuidado pela sua família hoje.\nNão porque precisam pedir — mas porque você viu a necessidade.\nSem anunciar. Só fazer."
      },
      {
        "day": 9,
        "title": "Dia 9",
        "confronto": "Como você reage quando há conflito em casa? Essa reação reflete o discípulo que você quer ser?",
        "direcao": "O caráter real aparece dentro de casa. É fácil ser gentil com estranhos.",
        "acao": "Leia Efésios 4:29-32.\nPergunta honesta: qual versículo mais te confronta?\nOre pedindo Deus para agir especificamente nessa área.\nEsta semana: aplique o versículo escolhido dentro de casa."
      },
      {
        "day": 10,
        "title": "Dia 10",
        "confronto": "Você tem liderado espiritualmente sua família — ou terceirizado essa responsabilidade para a igreja?",
        "direcao": "A liderança espiritual começa em casa. O discípulo não delega isso.",
        "acao": "Inicie o culto doméstico esta semana se ainda não fez.\nEscolha um dia fixo.\nLeia a Bíblia juntos — 10 minutos.\nOre. Encerre com uma pergunta simples: o que Deus está dizendo para nossa família?"
      },
      {
        "day": 11,
        "title": "Dia 11",
        "confronto": "Há alguém na sua família que você tem negligenciado? Pai, mãe, filho, cônjuge, irmão?",
        "direcao": "Discipulado que ignora relações próximas é incompleto. Quem está perto e esquecido?",
        "acao": "Identifique essa pessoa.\nEntre em contato hoje — não amanhã.\nConversem. Pergunte como ela está de verdade.\nOuça sem apressar o fim."
      },
      {
        "day": 12,
        "title": "Dia 12",
        "confronto": "Você tem exercido misericórdia dentro de casa — ou guarda a paciência para fora e traz o cansaço para dentro?",
        "direcao": "'A caridade começa em casa.' O amor cristão não pode ser externo e ausente no lar.",
        "acao": "Pense em uma área onde você tem sido impaciente em casa.\nHoje: escolha conscientemente a misericórdia nessa área.\nQuando vier a reação impaciente: pare, respire, escolha diferente."
      },
      {
        "day": 13,
        "title": "Dia 13",
        "confronto": "Sua família é vista por você como bênção ou como peso?",
        "direcao": "'Eis que os filhos são herança do Senhor.' A família que Deus te deu é missão, não obstáculo.",
        "acao": "Escreva 5 coisas pelas quais você é grato em relação à sua família.\nLeia em voz alta para Deus.\nCompartilhe pelo menos uma com um membro da família hoje."
      },
      {
        "day": 14,
        "title": "Dia 14",
        "confronto": "Você tem sido o mesmo em casa que é na igreja?",
        "direcao": "Integridade não é para o palco — é para a cozinha, o quarto, a mesa de jantar.",
        "acao": "Leia Salmo 101:2-3.\nPergunta: em qual área da vida doméstica há inconsistência entre o que você professa e o que você pratica?\nConfesse a Deus. Peça ajuda concreta."
      },
      {
        "day": 15,
        "title": "Dia 15",
        "confronto": "Há palavras que você disse à sua família que precisam de retratação?",
        "direcao": "'Se possível, quanto depender de vós, tende paz com todos os homens.' — comece em casa.",
        "acao": "Se há palavras que feriram: peça perdão hoje. Específico, sem 'mas'.\nSe não há: reafirme seu amor com palavras concretas.\nFaça isso antes de dormir."
      },
      {
        "day": 16,
        "title": "Dia 16",
        "confronto": "Você tem ensinado seus filhos — ou espera que a escola dominical faça esse trabalho?",
        "direcao": "Deuteronômio 6:7 — ensinar acontece no caminho, em casa, deitando e levantando.",
        "acao": "Compartilhe um ensinamento bíblico simples com um familiar hoje.\nNão precise ser perfeito — seja honesto.\nDiga o que Deus tem feito em você.\nConvide ao diálogo."
      },
      {
        "day": 17,
        "title": "Dia 17",
        "confronto": "Como está a atmosfera espiritual da sua casa? Ela fala de Deus ou fala de qualquer outra coisa?",
        "direcao": "A casa do discípulo deveria ser um lugar onde Deus é natural — não forçado, não ignorado.",
        "acao": "Coloque música de adoração na sua casa por 1 hora hoje.\nOre em voz alta em algum momento do dia dentro de casa.\nPergunte à família: o que sente quando pensa nesta casa?"
      },
      {
        "day": 18,
        "title": "Dia 18",
        "confronto": "Você tem intercedido pelos membros da sua família — ou só pede a Deus quando há problema?",
        "direcao": "Intercessão familiar é prática diária de amor. Leve cada um pelo nome diante de Deus.",
        "acao": "Ore hoje pelo nome de cada membro da sua família.\nEspecífico: uma necessidade real de cada um.\nNão genérico.\nFaça disso parte do seu TSD desta semana."
      },
      {
        "day": 19,
        "title": "Dia 19",
        "confronto": "Você tem sido generoso com seu tempo dentro de casa?",
        "direcao": "Tempo é o recurso mais escasso e mais amado. Sua família sente que você lhes dá o seu melhor tempo?",
        "acao": "Esta tarde ou noite: proponha uma atividade simples com a família.\nJogo de mesa, caminhada, conversa longa.\nSem agenda. Só presença."
      },
      {
        "day": 20,
        "title": "Dia 20",
        "confronto": "21 dias nesta estação. Sua família percebeu diferença em você?",
        "direcao": "A transformação que não aparece em casa ainda não começou. Avalie com honestidade e coragem.",
        "acao": "Pergunte a alguém de casa: em que eu mudei este mês?\nOuça sem se defender.\nAgradece o que disserem — bom ou ruim.\nOre juntos ao fim."
      },
      {
        "day": 21,
        "title": "Dia 21",
        "confronto": "O que esta estação revelou sobre sua vida familiar que você não queria ver?",
        "direcao": "Família é escola de caráter. O que você aprendeu sobre si mesmo ao viver o Evangelho em casa?",
        "acao": "Escreva uma carta curta para sua família — o que você quer ser para eles.\nNão o que fez — o que quer ser.\nLeia em voz alta para eles se tiver coragem.\nOre juntos sobre o que for dito."
      }
    ]
  },
  {
    "id": "clinic",
    "title": "Evangelização Discipuladora",
    "days": [
      {
        "day": 1,
        "title": "Dia 1",
        "confronto": "Nos últimos 7 dias, você falou sobre Jesus com alguém fora da sua bolha cristã?",
        "direcao": "Estação 3: Evangelização Discipuladora. A boa notícia não é guardada — é passada adiante. O discípulo vive para ser luz onde há escuridão.",
        "acao": "Liste 5 pessoas do seu círculo que não têm fé ou não frequentam uma igreja.\nOre por cada uma pelo nome hoje.\nGuarde essa lista — ela guiará sua intercessão nos próximos 21 dias.",
        "artigoRico": {
          "titulo": "Todo cristão deve evangelizar? Entenda por que todo discípulo é enviado",
          "texto": "Todo cristão deve evangelizar porque a missão não foi entregue apenas a especialistas, mas faz parte da identidade de quem foi reconciliado com Deus."
        },
        "resumoTelas": [
          "Evangelização não é um programa especial da igreja nem uma tarefa reservada a pastores, missionários ou pessoas que possuem um dom específico. Ela faz parte da identidade de quem foi alcançado e reconciliado por Deus. Quem recebeu a graça de Cristo também é chamado a participar da missão de Deus.",
          "Na Grande Comissão, Jesus chama seus discípulos para ir e fazer discípulos de todas as nações. A ordem não apresenta a missão como uma atividade opcional para alguns, mas como parte da vida de quem segue Jesus. O discípulo não é apenas alguém que recebe; ele também participa daquilo que o seu Senhor está fazendo no mundo.",
          "Isso muda a maneira como olhamos para o cotidiano. A missão não começa quando a igreja organiza um evento evangelístico. Ela começa onde estamos: em casa, na família, entre amigos, vizinhos, colegas de trabalho e nas pessoas que Deus coloca regularmente diante de nós.",
          "Ser enviado não significa saber responder a todas as perguntas ou possuir uma personalidade especialmente comunicativa. Significa estar disponível. Podemos começar orando, ouvindo, cuidando, servindo e compartilhando com simplicidade aquilo que Cristo fez em nossa vida.",
          "A pergunta deste dia é simples: se sou discípulo de Jesus, onde Ele está me enviando hoje?"
        ],
        "artigo": {
          "titulo": "Todo cristão deve evangelizar? Entenda por que todo discípulo é enviado",
          "url": "https://feemmissao.com.br/2026/09/15/todo-cristao-deve-evangelizar/"
        },
        "desafioArtigo": "Liste cinco pessoas que ainda não caminham com Cristo ou estão distantes da igreja. Comece a orar diariamente por elas.",
        "diarioPerguntas": [
          "Tenho tratado a evangelização como responsabilidade pessoal ou como tarefa de outras pessoas?",
          "Quem Deus já colocou no meu círculo de relacionamentos?",
          "Qual passo concreto posso dar esta semana para viver minha identidade missionária?"
        ]
      },
      {
        "day": 2,
        "title": "Dia 2",
        "confronto": "Você tem vergonha do Evangelho ou tem vergonha de como alguns cristãos o apresentam?",
        "direcao": "'Não me envergonho do Evangelho de Cristo, porque é o poder de Deus para salvação.' — Romanos 1:16",
        "acao": "Leia Romanos 1:16.\nPergunte a si mesmo: o que me impede de falar de Jesus naturalmente?\nOre sobre a resposta.\nHoje: mencione Deus em uma conversa comum — sem forçar, sem pregar.",
        "artigoRico": {
          "titulo": "Como evangelizar no dia a dia: quando a fé transborda para a vida",
          "texto": "Aprender como evangelizar no dia a dia começa por integrar a fé à rotina, permitindo que atitudes, relacionamentos, conversas e cuidado expressem o evangelho."
        },
        "resumoTelas": [
          "A evangelização não começa necessariamente com uma conversa sobre religião. Ela começa com uma vida que torna Cristo visível. Jesus ensinou que nossas boas obras devem apontar para o Pai. Por isso, testemunhar é mais do que falar; é viver de maneira coerente com aquilo que anunciamos.",
          "Uma fé que permanece somente no espaço privado perde oportunidades de testemunhar. As pessoas observam como tratamos os outros, como reagimos às dificuldades, como servimos, como perdoamos e como cuidamos. A coerência não substitui o anúncio do evangelho, mas cria pontes para que ele seja ouvido.",
          "No cotidiano surgem oportunidades simples: alguém compartilha uma preocupação, pede ajuda, fala de uma dificuldade familiar ou revela um medo. Esses momentos podem se tornar espaços de oração, cuidado, escuta e testemunho. Não precisamos transformar cada conversa em um discurso religioso. Precisamos estar presentes e atentos.",
          "Evangelizar no dia a dia é aprender a reconhecer essas oportunidades e responder com naturalidade. Uma pergunta sincera, uma oração oferecida no momento certo ou uma palavra sobre nossa esperança em Cristo pode abrir uma porta que uma abordagem artificial jamais abriria.",
          "Hoje, portanto, não pense primeiro em encontrar uma oportunidade para falar. Pense em viver de modo que sua fé transborde para as relações que já fazem parte da sua vida."
        ],
        "artigo": {
          "titulo": "Como evangelizar no dia a dia: quando a fé transborda para a vida",
          "url": "https://feemmissao.com.br/2026/09/15/como-evangelizar-no-dia-a-dia/"
        },
        "desafioArtigo": "Tenha hoje uma conversa intencional com alguém. Pergunte como essa pessoa está e se existe algo pelo qual você possa orar.",
        "diarioPerguntas": [
          "Minha fé é percebida nas minhas atitudes cotidianas?",
          "Tenho mais pressa de falar ou disposição para ouvir?",
          "Que situação comum da minha rotina pode se tornar uma oportunidade de cuidado e testemunho?"
        ]
      },
      {
        "day": 3,
        "title": "Dia 3",
        "confronto": "Quando foi a última vez que você convidou alguém sem igreja para um culto ou para uma conversa sobre fé?",
        "direcao": "Evangelização não é programa da igreja — é estilo de vida do discípulo.",
        "acao": "Escolha uma das 5 pessoas da sua lista.\nEntre em contato hoje — não para evangelizar, para cuidar.\nPergunte como ela está de verdade.\nOuça. Relacionamento antes de mensagem.",
        "artigoRico": {
          "titulo": "Onde Deus já está trabalhando? Como perceber oportunidades para evangelizar",
          "texto": "Perceber oportunidades para evangelizar exige atenção ao que Deus já está fazendo na vida das pessoas e disposição para participar com sabedoria, amor e presença."
        },
        "resumoTelas": [
          "A missão não começa em nós. Deus já está agindo no mundo e na vida das pessoas. Jesus disse que seu Pai continua trabalhando e que Ele também trabalha. Essa percepção muda a maneira como participamos da missão: não estamos tentando fazer Deus agir; estamos procurando perceber onde Ele já está agindo e cooperar com Ele.",
          "Por isso, uma das orações mais importantes de quem vive em missão pode ser: \"Senhor, leva-me às pessoas nas quais Tu já estás agindo\". Essa oração nos tira da ansiedade de produzir resultados e nos coloca em uma postura de atenção.",
          "Deus pode estar trabalhando por meio de uma necessidade, de uma crise, de uma pergunta, de uma amizade, de uma busca espiritual ou até de uma situação que inicialmente parece apenas comum. Nem sempre reconheceremos imediatamente o que está acontecendo. Por isso, precisamos aprender a observar e ouvir.",
          "Perceber não significa interpretar tudo como um sinal extraordinário. Significa estar atento às pessoas e às circunstâncias, reconhecendo que Deus pode abrir portas para cuidado, oração, testemunho e relacionamento. A nossa parte é responder quando essas oportunidades aparecem.",
          "Depois de orar pelas cinco pessoas que você escolheu, observe-as com novos olhos. Em vez de pensar apenas em como falar com elas, pergunte: que necessidades existem? Que conversas estão surgindo? Há alguma abertura? Como posso participar do que Deus já está fazendo?"
        ],
        "artigo": {
          "titulo": "Onde Deus já está trabalhando? Como perceber oportunidades para evangelizar",
          "url": "https://feemmissao.com.br/2026/09/15/oportunidades-para-evangelizar/"
        },
        "desafioArtigo": "Ore pelas cinco pessoas que você escolheu e peça: \"Senhor, leva-me às pessoas nas quais Tu já estás agindo.\" Durante o dia, observe necessidades, conversas e sinais de abertura.",
        "diarioPerguntas": [
          "Em quais pessoas percebo sinais de abertura, necessidade ou busca espiritual?",
          "Tenho pedido a Deus que me mostre onde Ele já está trabalhando?",
          "Quando foi a última vez que percebi uma oportunidade e decidi me aproximar?"
        ]
      },
      {
        "day": 4,
        "title": "Dia 4",
        "confronto": "Você sabe compartilhar seu testemunho em 2 minutos? O que Jesus mudou em você?",
        "direcao": "Todo discípulo tem uma história. A sua é a ferramenta mais poderosa que você tem.",
        "acao": "Escreva seu testemunho em 3 partes: como você era, o que aconteceu, o que mudou.\nMáximo 2 minutos falando.\nPratique em voz alta, sozinho.\nEsteja pronto para compartilhar quando a oportunidade surgir.",
        "artigoRico": {
          "titulo": "Relacionamentos intencionais: como construir pontes para compartilhar o evangelho",
          "texto": "Relacionamentos intencionais na evangelização não significam manipular amizades, mas amar pessoas conscientemente, estar presente e reconhecer oportunidades de oração, cuidado e testemunho."
        },
        "resumoTelas": [
          "A missão acontece entre pessoas. Por isso, relacionamentos não são apenas uma estratégia para evangelizar; eles fazem parte da própria maneira como Jesus se relacionava com aqueles que queria alcançar e formar. A fé é compartilhada em meio à vida real.",
          "Paulo descreve aos tessalonicenses uma relação marcada por afeto e entrega. Ele não fala apenas de transmitir uma mensagem, mas de compartilhar a própria vida. Essa perspectiva nos ajuda a compreender que pessoas não devem ser tratadas como projetos de evangelização.",
          "Relacionamentos intencionais significam estar perto com propósito. É prestar atenção, conhecer a história da pessoa, ouvir suas dores, lembrar de suas necessidades, oferecer ajuda, orar por ela e construir confiança. Quando existe relacionamento verdadeiro, o anúncio de Cristo deixa de ser uma abordagem isolada e passa a fazer parte de uma caminhada.",
          "Isso não significa manipular amizades para conseguir uma oportunidade religiosa. Significa amar pessoas de maneira genuína e estar disposto a caminhar com elas. Algumas portas serão abertas rapidamente; outras exigirão tempo, paciência e presença.",
          "A pergunta deste dia não é apenas \"Quem posso evangelizar?\", mas \"Com quem Deus me chama para caminhar?\". Quando deixamos de enxergar pessoas como alvos e começamos a enxergá-las como pessoas que Deus ama, nossa maneira de viver a missão muda."
        ],
        "artigo": {
          "titulo": "Relacionamentos intencionais: como construir pontes para compartilhar o evangelho",
          "url": "https://feemmissao.com.br/2026/09/15/relacionamentos-intencionais-na-evangelizacao/"
        },
        "desafioArtigo": "Escolha uma das cinco pessoas e faça um gesto concreto de cuidado: uma ligação, uma mensagem, uma visita ou uma ajuda.",
        "diarioPerguntas": [
          "Tenho demonstrado interesse genuíno pelas pessoas ou apenas procurado oportunidades para falar?",
          "Quem precisa de uma conversa, uma oração ou um gesto concreto de cuidado da minha parte?",
          "Que relacionamento posso cultivar com mais intencionalidade nesta semana?"
        ]
      },
      {
        "day": 5,
        "title": "Dia 5",
        "confronto": "Você ora diariamente pelas 5 pessoas da sua lista de evangelização?",
        "direcao": "Intercessão é o primeiro passo da evangelização. Antes da palavra, a oração.",
        "acao": "Ore hoje pelos 5 nomes da sua lista.\nPeça a Deus que abra portas de conversa.\nPeça que Ele trabalhe no coração de cada um.\nEsteja disponível para ser a resposta da sua própria oração.",
        "artigoRico": {
          "titulo": "Como fazer discípulos? Da presença à multiplicação",
          "texto": "Aprender como fazer discípulos é compreender que a missão de Jesus vai além de anunciar o evangelho: envolve acompanhar pessoas, ensiná-las a viver a fé e ajudá-las a multiplicar."
        },
        "resumoTelas": [
          "Fazer discípulos é o centro da Grande Comissão. Mas precisamos compreender isso como Jesus e os apóstolos viviam a missão: não como uma sequência de programas separados, mas como um movimento integrado de presença, relacionamento, anúncio, formação, envio e multiplicação.",
          "A distinção entre evangelização e discipulado pode ser útil para explicar diferentes aspectos da missão, mas é apenas didática. Jesus não separava sua vida em momentos chamados \"evangelização\" e \"discipulado\". Ele estava com pessoas, anunciava o Reino, chamava-as para segui-lo, ensinava, corrigia, cuidava, formava e enviava. Tudo fazia parte de sua missão.",
          "Por isso, não precisamos pensar: primeiro evangelizo, depois a pessoa se converte e somente então começo o discipulado. A evangelização já pode ser discipuladora quando anuncia Cristo com o propósito de conduzir pessoas a segui-lo. E o discipulado continua sendo missionário quando forma discípulos que também são enviados.",
          "Fazer discípulos envolve caminhar. É ajudar alguém a conhecer Jesus, aprender seus ensinamentos, praticar sua vontade e crescer em sua relação com Deus e com a comunidade. Esse processo não termina quando alguém toma uma decisão; ele amadurece à medida que a pessoa aprende a viver como discípulo.",
          "E há um horizonte ainda maior: multiplicação. Paulo orienta Timóteo a transmitir o que recebeu a pessoas fiéis que também fossem capazes de ensinar outros. O discípulo amadurecido não é apenas alguém que cresceu; é alguém que também passa a participar da formação de outros.",
          "Assim, o movimento pode ser compreendido desta forma: presença → relacionamento → anúncio → seguimento → formação → envio → multiplicação. A missão começa com a presença e encontra seu propósito quando discípulos ajudam outros discípulos a seguir Jesus."
        ],
        "artigo": {
          "titulo": "Como fazer discípulos? Da presença à multiplicação",
          "url": "https://feemmissao.com.br/2026/09/15/como-fazer-discipulos/"
        },
        "desafioArtigo": "Pense em uma pessoa com quem você pode caminhar de maneira intencional. Ore por ela e dê hoje um primeiro passo para aprofundar esse relacionamento.",
        "diarioPerguntas": [
          "Tenho acompanhado alguém de maneira intencional em sua caminhada com Cristo?",
          "Minha evangelização aponta para uma caminhada ou termina na decisão inicial?",
          "Quem poderia ser ajudado por mim a crescer e, depois, discipular outras pessoas?"
        ]
      },
      {
        "day": 6,
        "title": "Dia 6",
        "confronto": "Você está orando por pessoas ou está evitando o desconforto de se envolver na vida delas?",
        "direcao": "Evangelização começa na oração mas não termina nela. Oração sem ação é intenção sem compromisso.",
        "acao": "Dê um passo prático hoje em direção a uma das 5 pessoas.\nUma mensagem, uma visita, um café.\nNão precisa mencionar Deus — só estar presente.\nRelacionamento é solo onde o Evangelho cresce."
      },
      {
        "day": 7,
        "title": "Dia 7",
        "confronto": "Como você reage quando a conversa sobre fé é rejeitada ou ignorada?",
        "direcao": "Jesus foi rejeitado. Paulo foi expulso. A rejeição não é sinal de que você errou — é parte da missão.",
        "acao": "Leia Atos 17:32-34 — reações diferentes à mesma mensagem.\nPergunte: como estou lidando com as respostas que recebo?\nOre pedindo resistência e amor que não desiste."
      },
      {
        "day": 8,
        "title": "Dia 8",
        "confronto": "Sua vida diária é uma boa notícia para quem te observa — ou ela contradiz o que você prega?",
        "direcao": "A mais poderosa mensagem do Evangelho é uma vida transformada. Isso não se pregrega — se vive.",
        "acao": "Pergunte a um amigo não cristão: o que ele percebe de diferente em você.\nOuça sem se defender.\nOre sobre o que ouvir — seja encorajador ou desafiador."
      },
      {
        "day": 9,
        "title": "Dia 9",
        "confronto": "Você tem medo de falar de Jesus — ou medo de não viver o suficiente para que as pessoas perguntem sobre Ele?",
        "direcao": "'Sede sempre prontos para responder a todo aquele que vos pedir razão da esperança.' — 1 Pedro 3:15",
        "acao": "Releia seu testemunho do dia 46.\nAjuste o que precisar.\nHoje: compartilhe seu testemunho com alguém da sua lista de 5.\nDe forma natural, sem roteiro rígido."
      },
      {
        "day": 10,
        "title": "Dia 10",
        "confronto": "Você já levou alguém à fé? Como foi? O que impediu ou facilitou?",
        "direcao": "Cada discípulo que discipula multiplica. O Evangelho se espalha de pessoa a pessoa.",
        "acao": "Leia 2 Coríntios 5:18-20.\n'Deus nos reconciliou consigo e nos deu o ministério da reconciliação.'\nOre: Senhor, use-me como instrumento de reconciliação hoje.\nEsteja atento às oportunidades que surgirem."
      },
      {
        "day": 11,
        "title": "Dia 11",
        "confronto": "Alguém da sua lista de 5 está em crise agora? Você está presente ou apenas orando de longe?",
        "direcao": "O Evangelho ganha credibilidade quando aparece nas crises. Estar presente é pregar sem palavras.",
        "acao": "Verifique cada pessoa da sua lista.\nSe alguém está passando por algo difícil: apareça.\nNão precisa ter respostas — só esteja lá.\nIsso é evangelização encarnada."
      },
      {
        "day": 12,
        "title": "Dia 12",
        "confronto": "Você já convidou alguém para um culto ou evento da igreja este mês?",
        "direcao": "Convite intencional é ato de amor. Você pode ser a razão pela qual alguém encontra uma comunidade de fé.",
        "acao": "Convide uma pessoa da sua lista de 5 para um culto, evento ou encontro.\nNão force — convide com calor e liberdade.\nIndependente da resposta: já foi obediência."
      },
      {
        "day": 13,
        "title": "Dia 13",
        "confronto": "Como você trata pessoas que têm crenças diferentes das suas?",
        "direcao": "Jesus jantou com pecadores, conversou com samaritanos, tocou em leprosos. O Evangelho vai até as pessoas.",
        "acao": "Leia João 4:7-26 — Jesus e a mulher samaritana.\nObserve: ele foi até ela, iniciou conversa, fez perguntas, não a condenou.\nPergunta: o que posso aprender sobre abordagem evangelizadora com esse texto?"
      },
      {
        "day": 14,
        "title": "Dia 14",
        "confronto": "Você já compartilhou algum recurso de fé — livro, podcast, vídeo — com alguém da sua lista?",
        "direcao": "Evangelização também é curadoria — apresentar conteúdo que pode abrir portas.",
        "acao": "Escolha um recurso cristão de qualidade.\nEnvie para uma pessoa da lista com uma mensagem simples: 'Isso me ajudou muito. Queria compartilhar.'.\nSem pressão. Só oferta."
      },
      {
        "day": 15,
        "title": "Dia 15",
        "confronto": "Sua lista de 5 ainda é a mesma do início? Você tem observado essas pessoas de perto?",
        "direcao": "Intercessão que cresce em amor começa a ver as pessoas com os olhos de Deus.",
        "acao": "Revise sua lista.\nPara cada nome: anote uma necessidade específica dessa pessoa.\nOre sobre cada necessidade com detalhes.\nPense em um gesto prático de cuidado para cada uma esta semana."
      },
      {
        "day": 16,
        "title": "Dia 16",
        "confronto": "Você tem vivido sua fé de forma natural — ou ela parece artificial quando aparece em conversa?",
        "direcao": "Fé que não cabe na conversa do dia a dia ainda está trancada no quarto do domingo.",
        "acao": "Hoje: mencione algo de Deus de forma completamente natural em uma conversa comum.\nNão force o contexto — espere ele surgir.\nMencione sem sermão, sem performance.\nSó autenticidade."
      },
      {
        "day": 17,
        "title": "Dia 17",
        "confronto": "Você tem orado por oportunidades de compartilhar o Evangelho — ou espera que as situações venham sozinhas?",
        "direcao": "'Orai também por nós, para que Deus nos abra a porta da palavra.' — Colossenses 4:3",
        "acao": "Ore hoje especificamente por uma porta aberta esta semana.\nSeja específico: com quem, onde, como.\nDepois: fique atento. A resposta pode vir hoje."
      },
      {
        "day": 18,
        "title": "Dia 18",
        "confronto": "Qual das 5 pessoas da sua lista está mais perto de ouvir o Evangelho de verdade?",
        "direcao": "Concentre energia onde o terreno está sendo preparado. Deus já está trabalhando antes de você chegar.",
        "acao": "Identifique essa pessoa.\nDê um passo mais intencional em direção a ela esta semana.\nOre com mais especificidade por ela hoje.\nEsteja disponível."
      },
      {
        "day": 19,
        "title": "Dia 19",
        "confronto": "19 dias nesta estação. O que mudou na sua forma de ver as pessoas que não têm fé?",
        "direcao": "Evangelização transforma o evangelizador tanto quanto o evangelizado. O amor pelo perdido é sinal de maturidade discipular.",
        "acao": "Escreva o que aprendeu sobre evangelização nesta estação.\nQual foi o momento mais desconfortável? O mais natural?\nOre de gratidão pelo que Deus está fazendo."
      },
      {
        "day": 20,
        "title": "Dia 20",
        "confronto": "Alguém da sua lista de 5 deu algum sinal de abertura espiritual neste mês?",
        "direcao": "Deus trabalha. Sua função é plantar, regar e estar disponível para colher no tempo dEle.",
        "acao": "Avalie cada pessoa da lista.\nSe houve abertura: avance com cuidado e oração.\nSe não houve: continue plantando sem desistir.\nLembre: Paulo plantou, Apolo regou, Deus deu o crescimento."
      },
      {
        "day": 21,
        "title": "Dia 21",
        "confronto": "O que esta estação revelou sobre seu amor pelo próximo?",
        "direcao": "Você não pode amar Deus e ser indiferente às pessoas que Ele ama. Evangelização é consequência de intimidade com Deus.",
        "acao": "Escreva uma oração pelos 5 nomes da sua lista.\nEntregue-os formalmente a Deus: 'Senhor, continua o que começou nessas vidas.'\nGuarde essa oração.\nContinue orando por eles mesmo depois desta estação."
      }
    ]
  },
  {
    "id": "office",
    "title": "Compaixão e Graça",
    "days": [
      {
        "day": 1,
        "title": "Dia 1",
        "confronto": "Nos últimos 7 dias, você viu alguém em necessidade e passou por cima — ou parou?",
        "direcao": "Estação 4: Compaixão e Graça. O discípulo não passa por cima da dor do outro. Ele para, desce e cuida. Como o bom samaritano.",
        "acao": "Leia Lucas 10:30-37.\nPergunte: quem é meu próximo nesta semana?\nIdentifique uma pessoa em necessidade real ao seu redor.\nPlaneje uma ação concreta de cuidado para esta semana.",
        "videoUrl": "https://youtu.be/ot5nwY3ENfk",
        "artigoRico": {
          "titulo": "Compaixão à maneira de Cristo: quando o evangelho alcança o ser humano por inteiro",
          "texto": "A compaixão cristã nos ensina a enxergar e cuidar do ser humano por inteiro, tornando o evangelho visível na vida."
        },
        "resumoTelas": [
          "Frequentemente reduzimos as pessoas àquilo que enxergamos de imediato, mas ninguém cabe em uma única necessidade. O evangelho encontra pessoas inteiras: corpo, alma, relacionamentos, história e contexto.",
          "Os Evangelhos mostram Jesus percebendo quem passaria despercebido. Diante da viúva de Naim, ele viu aquela mulher e teve compaixão — não como estratégia, mas porque viu a dor e respondeu a ela.",
          "A compaixão faz parte de quem Deus é: Ele vê, se importa e age. Quando a igreja cuida de quem sofre, está refletindo o caráter de Deus. Não resolvemos todos os problemas, mas podemos nos recusar a passar indiferentes.",
          "O evangelho todo é para o ser humano todo. Diminua a velocidade e pergunte: quem está sofrendo perto de mim? Quem precisa ser ouvido? Quem precisa de presença antes de precisar de uma resposta?"
        ],
        "artigo": {
          "titulo": "Compaixão à maneira de Cristo: quando o evangelho alcança o ser humano por inteiro",
          "url": "https://feemmissao.com.br/2026/10/06/compaixao-a-maneira-de-cristo/"
        },
        "diarioPerguntas": [
          "Minha maneira de enxergar as pessoas considera apenas suas necessidades aparentes ou procura perceber a pessoa inteira?",
          "Quem perto de mim pode estar sofrendo sem que eu tenha percebido?",
          "Que atitude concreta posso tomar para enxergar e cuidar melhor de alguém nesta semana?"
        ]
      },
      {
        "day": 2,
        "title": "Dia 2",
        "confronto": "Você participa das ações sociais da sua igreja — ou deixa isso para os que 'têm dom de misericórdia'?",
        "direcao": "Compaixão não é dom de poucos — é marca de todo discípulo de Jesus.",
        "acao": "Verifique as ações sociais da sua igreja.\nEscolha uma para participar esta semana ou este mês.\nNão espere ser chamado — ofereça-se.\nDê um passo concreto hoje.",
        "videoUrl": "https://youtu.be/Jh4CEl_LL84",
        "artigoRico": {
          "titulo": "Como cultivar compaixão pelas pessoas: aprendendo com Jesus",
          "texto": "Cultivar compaixão começa pela maneira de enxergar: deixar de olhar rapidamente para as pessoas e aprender a prestar atenção."
        },
        "resumoTelas": [
          "Existe diferença entre saber que devemos amar as pessoas e aprender a olhar para elas com amor. Jesus não encontrava apenas multidões, enfermos ou necessitados: encontrava pessoas.",
          "Há dores evidentes e muitas escondidas: gente que continua trabalhando e sorrindo enquanto enfrenta lutas profundas. Perceber exige atenção — ouvir além das palavras e perceber além das aparências.",
          "Perceber o sofrimento não basta: é preciso ficar disponível. Muitas vezes quem sofre não precisa de explicação, mas de alguém que ouça, sem transformar a dor em conselho, julgamento ou comparação.",
          "Jesus permaneceu fiel mesmo sabendo que nem todos responderiam. O amor cristão cuida sem controlar a resposta do outro. Peça a Deus que te ensine a ver as pessoas como Ele as vê."
        ],
        "artigo": {
          "titulo": "Como cultivar compaixão pelas pessoas: aprendendo com Jesus",
          "url": "https://feemmissao.com.br/2026/10/06/como-cultivar-compaixao-pelas-pessoas/"
        },
        "diarioPerguntas": [
          "Tenho percebido as pessoas ao meu redor ou apenas aquilo que preciso realizar?",
          "Que tipo de sofrimento costumo ignorar porque não sei como responder a ele?",
          "Quem precisa que eu simplesmente pare, ouça e esteja presente?"
        ]
      },
      {
        "day": 3,
        "title": "Dia 3",
        "confronto": "Você visita pessoas doentes, solitárias ou que não podem sair de casa?",
        "direcao": "'Visitei-me enfermo e me fostes ver.' — Mateus 25:36. Presença é ministério.",
        "acao": "Identifique uma pessoa hospitalizada, idosa ou isolada.\nVisite ou ligue hoje.\nNão porque tem o que dizer — porque sua presença já é o ministério.\nFique o tempo que precisar.",
        "videoUrl": "https://youtu.be/EjUKH-uMpKE",
        "artigoRico": {
          "titulo": "Compaixão cristã na prática: como transformar cuidado em ação",
          "texto": "A compaixão precisa se transformar em atitude: o amor cristão encontra expressão concreta no cuidado."
        },
        "resumoTelas": [
          "Ser tocado pelo sofrimento não é o ponto final. A Primeira Carta de João confronta quem percebe a necessidade de um irmão e fecha o coração. A fé não pode ficar só nas intenções: o amor precisa de expressão concreta.",
          "O cuidado começa com presença. Nem sempre temos respostas ou recursos, mas podemos visitar, sentar ao lado, ouvir e não desaparecer quando a situação fica difícil. Ouvir também é cuidar.",
          "Ajudar de forma concreta pode envolver alimento, transporte, tempo ou acompanhamento — dentro das possibilidades de cada um. O cuidado cristão não exige resolver tudo, mas fazer o que está ao nosso alcance, mesmo quando custa tempo, energia ou conforto.",
          "Servir sem transformar pessoas em instrumentos: cuidamos porque pessoas importam. O cuidado torna visível aquilo que anunciamos."
        ],
        "artigo": {
          "titulo": "Compaixão cristã na prática: como transformar cuidado em ação",
          "url": "https://feemmissao.com.br/2026/10/06/compaixao-crista-na-pratica/"
        },
        "diarioPerguntas": [
          "Quando percebo uma necessidade, costumo agir ou espero que outra pessoa faça alguma coisa?",
          "Que tipo de ajuda concreta está ao meu alcance hoje?",
          "Existe alguém cuja necessidade conheço, mas ainda não transformei em cuidado?"
        ]
      },
      {
        "day": 4,
        "title": "Dia 4",
        "confronto": "Quando você doa, doa com alegria — ou com obrigação calculada?",
        "direcao": "'Cada um dê conforme propôs no coração, não com tristeza nem por necessidade, porque Deus ama ao que dá com alegria.' — 2 Coríntios 9:7",
        "acao": "Faça uma doação hoje — dinheiro, tempo ou recurso.\nEscolha com alegria, não por obrigação.\nSe possível: faça anonimamente.\nOre antes: 'Senhor, uso isso como ato de amor, não de performance.'",
        "videoUrl": "https://youtu.be/EcG2HtacXPA",
        "artigoRico": {
          "titulo": "Graça de Deus: como viver e demonstrar a graça no dia a dia",
          "texto": "A graça recebida de Deus transforma a maneira como tratamos as pessoas e torna o amor visível no dia a dia."
        },
        "resumoTelas": [
          "A graça não deve ficar só como verdade que afirmamos sobre Deus: ela começa a transformar nossa maneira de viver. O que muda no modo como tratamos as pessoas quando entendemos a graça que recebemos?",
          "É fácil falar de graça quando somos nós que a recebemos; difícil é oferecê-la a quem nos decepciona. A graça não ignora a verdade, mas trata pessoas sem abandonar a misericórdia.",
          "Graça não é estratégia: o cuidado não é ferramenta de marketing nem de crescimento institucional. Onde há graça, há cuidado — ouvir, perdoar, acolher, dar segunda oportunidade — e isso começa dentro de casa.",
          "Uma boa medida da graça é como tratamos quem não pode nos oferecer nada em troca. Recebemos um amor que não merecíamos, e isso forma em nós um novo jeito de amar."
        ],
        "artigo": {
          "titulo": "Graça de Deus: como viver e demonstrar a graça no dia a dia",
          "url": "https://feemmissao.com.br/2026/10/06/graca-de-deus-no-dia-a-dia/"
        },
        "diarioPerguntas": [
          "Minha maneira de tratar as pessoas revela a graça que afirmo ter recebido de Deus?",
          "Há alguém que precisa experimentar mais misericórdia e cuidado da minha parte?",
          "Em que situação concreta posso demonstrar graça nesta semana?"
        ]
      },
      {
        "day": 5,
        "title": "Dia 5",
        "confronto": "Você tem se colocado disponível quando vê alguém em dificuldade — ou espera que alguém mais habilitado apareça?",
        "direcao": "Disponibilidade é a primeira forma de compaixão. Você não precisa ter todas as respostas.",
        "acao": "Esta semana: quando ver necessidade, não passe para o lado.\nPergunta: 'Posso ajudar?'\nSe não souber como: 'Posso orar com você agora?'\nFaça isso ao menos uma vez hoje.",
        "videoUrl": "https://youtu.be/dueJjlmD5QM",
        "artigoRico": {
          "titulo": "Evangelho e ação social: por que a missão cristã não pode ser dividida",
          "texto": "Evangelho e ação social não precisam disputar espaço: a missão cristã alcança o ser humano inteiro."
        },
        "resumoTelas": [
          "Tendemos a separar o anúncio do evangelho das ações de cuidado. Mas o evangelho alcança pessoas reais, com corpo, história, relacionamentos e necessidades. Dividir a missão é apresentá-la fragmentada.",
          "Jesus ensinava, anunciava o Reino, chamava e formava discípulos — e também via a dor e respondia com misericórdia. Tudo fazia parte da mesma missão.",
          "Dois extremos: reduzir a missão à assistência, perdendo o anúncio de Cristo; ou usar a ação social como mecanismo para atrair pessoas, o que contradiz a graça. O cuidado não substitui o evangelho: torna visível o que anunciamos.",
          "A pergunta não é se devemos evangelizar ou ajudar, mas como anunciar e viver o evangelho diante das pessoas que Deus colocou ao nosso redor. Anunciamos, cuidamos, servimos, ouvimos, oramos, acolhemos."
        ],
        "artigo": {
          "titulo": "Evangelho e ação social: por que a missão cristã não pode ser dividida",
          "url": "https://feemmissao.com.br/2026/10/06/evangelho-e-acao-social/"
        },
        "diarioPerguntas": [
          "Em minha maneira de viver a fé, existe alguma separação entre falar do evangelho e cuidar das pessoas?",
          "Que necessidades das pessoas ao meu redor tenho percebido, mas ainda não transformei em cuidado?",
          "Como posso unir, de maneira natural e verdadeira, anúncio de Cristo e cuidado com as pessoas nesta semana?"
        ]
      },
      {
        "day": 6,
        "title": "Dia 6",
        "confronto": "Você tem aproveitado os momentos de cuidado para compartilhar o Evangelho — ou separa o social do espiritual?",
        "direcao": "O bom samaritano cuidou do corpo. Jesus cuidou do corpo e do espírito. Compaixão completa não separa os dois.",
        "acao": "Leia Lucas 4:18.\nJesus veio pregar e curar — missão integrada.\nPergunta: como posso integrar cuidado e Evangelho na minha ação desta semana?\nEscolha uma ação concreta."
      },
      {
        "day": 7,
        "title": "Dia 7",
        "confronto": "Há alguém que você sabe que está sofrendo e que você tem evitado por não saber o que dizer?",
        "direcao": "Você não precisa ter palavras. Precisa ter presença. Silêncio compassivo vale mais que sermão inconveniente.",
        "acao": "Identifique essa pessoa.\nVá até ela hoje — ou ligue.\nNão leve palavras prontas.\nSó leve você. Diga: 'Vim porque me importo.'"
      },
      {
        "day": 8,
        "title": "Dia 8",
        "confronto": "Você tem perdoado — ou guarda mágoa sob a justificativa de que o outro não merece perdão?",
        "direcao": "'Perdoai uns aos outros, como Deus vos perdoou em Cristo.' — Efésios 4:32. Compaixão inclui perdão.",
        "acao": "Há alguém com quem você guarda ressentimento?\nHoje: ore pelo nome dessa pessoa — sem pedir que Deus a julgue, mas que a abençoe.\nFaça isso por 5 minutos.\nRepita amanhã."
      },
      {
        "day": 9,
        "title": "Dia 9",
        "confronto": "Sua compaixão é seletiva — só alcança quem você considera merecedor?",
        "direcao": "O samaritano socorreu um judeu — seu inimigo histórico. Compaixão real não tem filtro de merecimento.",
        "acao": "Pense em alguém com quem você tem dificuldade de se compadecer.\nOre pela compaixão de Deus sobre essa pessoa.\nPeça que Deus coloque amor onde você tem julgamento."
      },
      {
        "day": 10,
        "title": "Dia 10",
        "confronto": "Você tem escutado de verdade — ou ouve enquanto prepara sua resposta?",
        "direcao": "Escuta ativa é um dos maiores atos de compaixão. Quem se sente ouvido se sente amado.",
        "acao": "Hoje: em uma conversa, ouça sem interromper.\nNão dê conselhos a não ser que peçam.\nFaça perguntas que aprofundem — não que redirecionem.\nAo fim: só diga 'Fico contente que me contou.'"
      },
      {
        "day": 11,
        "title": "Dia 11",
        "confronto": "Você tem cuidado da sua saúde como mordomia do corpo que Deus te deu?",
        "direcao": "Compaixão também é cuidar de si para poder cuidar dos outros. Quem está vazio não pode servir com plenitude.",
        "acao": "Avalie sua saúde esta semana.\nDormir, alimentação, movimento físico — como estão?\nFaça uma coisa prática hoje para cuidar do seu corpo.\nOre: 'Senhor, este corpo é Teu. Ajuda-me a cuidar dele para Tua glória.'"
      },
      {
        "day": 12,
        "title": "Dia 12",
        "confronto": "Há projetos de ação social na sua comunidade onde você poderia contribuir regularmente?",
        "direcao": "Compaixão sistemática tem mais impacto que compaixão episódica. Compromisso transforma.",
        "acao": "Pesquise um projeto social na sua comunidade.\nNão precisa ser da igreja — pode ser qualquer ação de bem.\nEscolha um modo de contribuir regularmente: tempo, recurso, habilidade.\nDê o primeiro passo esta semana."
      },
      {
        "day": 13,
        "title": "Dia 13",
        "confronto": "Você tem compartilhado seus recursos com os que têm menos — ou vive no princípio do 'cada um por si'?",
        "direcao": "'O que tem dois casacos reparta com o que não tem.' — Lucas 3:11. Generosidade é marca de discípulo.",
        "acao": "Olhe ao seu redor: há algo que você tem em excesso e alguém precisa?\nDoe hoje. De forma concreta.\nRoupa, alimento, dinheiro, tempo.\nNão adie."
      },
      {
        "day": 14,
        "title": "Dia 14",
        "confronto": "Você tem orado pelos pobres, vulneráveis e marginalizados da sua cidade?",
        "direcao": "Intercessão pelos vulneráveis é ato de justiça. O discípulo carrega para Deus o que está ao seu redor.",
        "acao": "Ore hoje pelos mais vulneráveis da sua cidade.\nSem generalidade: nomeie grupos, situações, bairros que você conhece.\nPeça a Deus que Te use como parte da resposta."
      },
      {
        "day": 15,
        "title": "Dia 15",
        "confronto": "Como você reage quando alguém te pede ajuda e você não tem disponibilidade?",
        "direcao": "'Não deixes para amanhã o bem que podes fazer hoje.' — Provérbios 3:27-28",
        "acao": "Hoje: se alguém pedir ajuda — não redirecione, não adie.\nSe genuinamente não puder: diga a verdade com cuidado e ajude a encontrar quem possa.\nSua presença é valiosa mesmo quando é breve."
      },
      {
        "day": 16,
        "title": "Dia 16",
        "confronto": "Você tem tido dificuldade de receber ajuda dos outros?",
        "direcao": "Humildade é também saber receber. O orgulho que não aceita cuidado impede a comunidade de exercer o amor.",
        "acao": "Pense em uma área onde você precisou de ajuda mas não pediu.\nEsta semana: peça. Aceite.\nPermita que alguém te cuide.\nIsso também é prática de compaixão — na direção contrária."
      },
      {
        "day": 17,
        "title": "Dia 17",
        "confronto": "Há alguém na sua vida que você julgou com dureza e que poderia se beneficiar da sua compaixão?",
        "direcao": "'Sede misericordiosos, como também vosso Pai é misericordioso.' — Lucas 6:36",
        "acao": "Identifique essa pessoa.\nOre por ela com genuína misericórdia.\nSe possível: faça um gesto de cuidado concreto.\nSem esperar que ela mereça."
      },
      {
        "day": 18,
        "title": "Dia 18",
        "confronto": "19 dias de compaixão e graça. O que ficou mais difícil — a ação ou a atitude interna?",
        "direcao": "Compaixão que vem de lugar errado esgota. Compaixão que vem de Deus renova. Qual tem sido a sua fonte?",
        "acao": "Leia 2 Coríntios 1:3-4.\nDeus consola para que consolemos.\nPergunta: o que Deus tem me consolado que posso oferecer a outros?\nEscreva a resposta."
      },
      {
        "day": 19,
        "title": "Dia 19",
        "confronto": "Você termina esta estação diferente de como começou?",
        "direcao": "Compaixão não é episódio — é caráter. O que desta estação vai permanecer como modo de vida?",
        "acao": "Escreva uma ação concreta de compaixão que vai manter como hábito permanente.\nCommeta-se com ela.\nDiga a alguém de confiança.\nOre: 'Senhor, que minha vida seja uma extensão da Tua compaixão.'"
      },
      {
        "day": 20,
        "title": "Dia 20",
        "confronto": "O que esta estação revelou sobre como você enxerga as necessidades ao seu redor?",
        "direcao": "Olhos de compaixão enxergam o que olhos apressados não veem. Você aprendeu a ver diferente?",
        "acao": "Caminhe ou dirija pela sua rua ou bairro com olhos atentos.\nO que você vê que nunca tinha prestado atenção?\nOre sobre o que enxergar.\nPergunte a Deus: o que Tu queres fazer aqui por meio de mim?"
      },
      {
        "day": 21,
        "title": "Dia 21",
        "confronto": "Há algo que você prometeu fazer por alguém e ainda não cumpriu?",
        "direcao": "Compaixão com integridade. A palavra dada é ato de amor. Cumpra o que prometeu.",
        "acao": "Identifique uma promessa não cumprida.\nCumpra hoje — ou comunique honestamente por que não pode.\nNão deixe o outro esperando sem resposta."
      }
    ]
  },
  {
    "id": "construction",
    "title": "Mordomia Cristã",
    "days": [
      {
        "day": 1,
        "title": "Dia 1",
        "confronto": "Como você administra seu tempo? Ele reflete que Deus é prioridade — ou revela o contrário?",
        "direcao": "Estação 5: Mordomia Cristã. 'Do Senhor é a terra e tudo o que nela existe.' Tudo que você tem foi confiado a você. Gerencie com fidelidade.",
        "acao": "Abra sua agenda desta semana.\nIdentifique 3 blocos de tempo que estão sendo gastos em algo que não edifica.\nSubstitua um deles por algo que serve a Deus ou ao próximo.\nFaça isso hoje.",
        "videoUrl": "https://youtu.be/zjfVLy0YyuM",
        "artigoRico": {
          "titulo": "Mordomia cristã: o que significa viver como administrador do que Deus confiou",
          "texto": "Mordomia cristã é reconhecer que Deus é o Senhor de tudo e administrar com fidelidade o que Ele confiou às nossas mãos."
        },
        "resumoTelas": [
          "A mordomia começa com uma mudança de perspectiva: nossa vida, tempo, recursos, capacidades e oportunidades pertencem ao Senhor. Em vez de perguntar só \"o que eu tenho?\", perguntamos como administrar o que Deus colocou em nossas mãos.",
          "A Bíblia apresenta Deus como fonte de tudo (Salmo 24.1). Isso não diminui o trabalho nem as conquistas — só os coloca no lugar certo: recebemos a vida como responsabilidade confiada, não como propriedade absoluta.",
          "Mordomo não é dono. O dono dispõe como quiser; o mordomo administra o que recebeu e responde por isso. E a mordomia alcança a vida inteira: trabalho, família, saúde, espiritualidade, descanso — não só dinheiro.",
          "A bênção recebida carrega uma missão: Abraão foi abençoado para ser bênção. Somos meio, não fim. A pergunta que muda tudo: \"Para que Deus colocou isso em minhas mãos?\""
        ],
        "artigo": {
          "titulo": "Mordomia cristã: o que significa viver como administrador do que Deus confiou",
          "url": "https://feemmissao.com.br/2026/10/06/mordomia-crista-o-que-significa/"
        },
        "diarioPerguntas": [
          "O que tenho tratado como propriedade exclusivamente minha, embora tenha recebido de Deus?",
          "Que área da minha vida revela mais claramente minha compreensão — ou incompreensão — da mordomia?",
          "O que Deus colocou em minhas mãos que pode se tornar bênção para outra pessoa?"
        ]
      },
      {
        "day": 2,
        "title": "Dia 2",
        "confronto": "Você é dizimista fiel — ou dá quando sobra?",
        "direcao": "O dízimo não é para a igreja prosperar — é para o discípulo aprender que Deus é o dono de tudo.",
        "acao": "Verifique: você tem dado o dízimo regularmente?\nSe sim: ore de gratidão pela fidelidade.\nSe não: decida hoje. Calcule. Dê na próxima oportunidade.\nOre: 'Senhor, reconheço que tudo é Teu.'",
        "videoUrl": "https://youtu.be/huW7nNadV6c",
        "artigoRico": {
          "titulo": "Tudo pertence a Deus: como essa verdade muda a maneira de viver",
          "texto": "Tudo pertence a Deus: reconhecer isso reorganiza nossa relação com bens, trabalho, capacidades e escolhas."
        },
        "resumoTelas": [
          "É fácil falar em \"meu dinheiro, meu tempo, meu trabalho\". A fé bíblica traz outra perspectiva: tudo o que administramos foi recebido. Isso não elimina nossa responsabilidade — a aprofunda.",
          "O Salmo 24.1 diz que a terra e tudo o que nela se contém pertencem ao Senhor. Davi e Jó reconheceram que o que tinham veio de Deus. Reconhecer isso não é desprezar o que temos, mas saber de onde veio e diante de quem somos responsáveis.",
          "Até a capacidade de trabalhar vem de Deus. O trabalho continua exigindo dedicação, mas é recebido com humildade. Recursos têm propósito: evita-se o extremo de acumular como finalidade e o de gastar sem responsabilidade.",
          "Viver com as mãos abertas: confiança e disposição para administrar, sem construir a identidade sobre o que possuímos. Somos administradores, não o centro. A pergunta: \"O que estou fazendo com aquilo que recebi?\""
        ],
        "artigo": {
          "titulo": "Tudo pertence a Deus: como essa verdade muda a maneira de viver",
          "url": "https://feemmissao.com.br/2026/10/06/tudo-pertence-a-deus/"
        },
        "diarioPerguntas": [
          "Que palavras ou atitudes revelam que considero certas áreas da vida exclusivamente minhas?",
          "Como tenho usado meus recursos além das minhas necessidades pessoais?",
          "Existe algo que Deus colocou em minhas mãos que eu poderia colocar a serviço de outra pessoa?"
        ]
      },
      {
        "day": 3,
        "title": "Dia 3",
        "confronto": "Você gasta mais do que ganha? Suas finanças refletem disciplina ou impulsividade?",
        "direcao": "'O tolo gasta tudo o que tem; o sábio guarda para o futuro.' — Provérbios 21:20",
        "acao": "Faça um levantamento honesto: quanto entra, quanto sai.\nIdentifique um gasto desnecessário.\nElimina-o esta semana.\nOre pedindo sabedoria para administrar o que Deus te deu.",
        "videoUrl": "https://youtu.be/ZRGaBrh1L-s",
        "artigoRico": {
          "titulo": "Deus nos abençoa para sermos bênção: o propósito daquilo que recebemos",
          "texto": "Deus nos abençoa para sermos bênção: aquilo que recebemos tem propósito e pode alcançar outras pessoas."
        },
        "resumoTelas": [
          "Receber uma bênção desperta gratidão, mas a bênção também carrega propósito. A Abraão Deus disse: \"Sê tu uma bênção\" (Gênesis 12.2). A bênção não deveria terminar nele — deveria alcançar outros.",
          "Recebemos capacidades, tempo, oportunidades, relacionamentos, experiências, recursos e uma história. Cada um pode ir além do benefício pessoal. A pergunta não é só \"o que Deus me deu?\", mas \"o que posso fazer com isso?\"",
          "Recursos existem para cumprir propósitos: responsabilidades da família, provisão para tempos difíceis, cuidado com pessoas, obra de Deus. Capacidades e oportunidades também são bênção — podem se tornar serviço.",
          "Somos meio, não fim. Mordomia é discernir quando guardar, usar ou compartilhar: \"aquilo que chegou às minhas mãos não precisa terminar nas minhas mãos\". Deus nos abençoa para sermos bênção."
        ],
        "artigo": {
          "titulo": "Deus nos abençoa para sermos bênção: o propósito daquilo que recebemos",
          "url": "https://feemmissao.com.br/2026/10/06/deus-nos-abencoa-para-sermos-bencao/"
        },
        "diarioPerguntas": [
          "O que Deus colocou em minhas mãos que pode beneficiar outras pessoas?",
          "Tenho usado minhas capacidades principalmente para mim ou também para servir?",
          "Existe uma oportunidade que recebi recentemente que pode se transformar em bênção para alguém?"
        ]
      },
      {
        "day": 4,
        "title": "Dia 4",
        "confronto": "Você cuida da sua saúde como um mordomo fiel do corpo que Deus te deu?",
        "direcao": "Seu corpo é templo do Espírito Santo. Negligenciá-lo não é humildade — é irresponsabilidade.",
        "acao": "Avalie: sono, alimentação, exercício.\nEscolha uma área para melhorar esta semana.\nFaça algo prático hoje: caminhe, durma mais cedo, escolha melhor o que comer.\nOre sobre sua saúde.",
        "videoUrl": "https://youtu.be/W4MdZHN61gc",
        "artigoRico": {
          "titulo": "Como administrar bem o tempo: prioridades, responsabilidade e sabedoria",
          "texto": "Administrar bem o tempo não é fazer mais coisas, mas dar espaço ao que importa, com sabedoria e responsabilidade."
        },
        "resumoTelas": [
          "O tempo é um recurso recebido para administrar. Aprender a administrá-lo é questão de sabedoria, responsabilidade e fidelidade — não apenas de produtividade. A vida reúne trabalho, família, saúde, espiritualidade e lazer; o desafio é saber o que precisa de atenção em cada momento.",
          "Prioridades precisam aparecer na agenda: tempo com Deus, família e descanso não podem depender das sobras. Salmo 90.12: \"Ensina-nos a contar os nossos dias para que alcancemos corações sábios.\"",
          "Escolher faz parte da mordomia: dizer sim a uma coisa é dizer não a outra, e procrastinar rouba espaço do essencial. Descanso, lazer e silêncio também têm valor — uma agenda cheia não é sinal de vida bem administrada.",
          "A agenda revela prioridades: ela confirma o que digo ser importante? Planejar não é controlar o futuro, é viver com sabedoria o tempo que recebemos. A questão é de fidelidade: o que estou fazendo com os dias que recebi?"
        ],
        "artigo": {
          "titulo": "Como administrar bem o tempo: prioridades, responsabilidade e sabedoria",
          "url": "https://feemmissao.com.br/2026/10/06/como-administrar-bem-o-tempo/"
        },
        "diarioPerguntas": [
          "Minha agenda revela as prioridades que afirmo ter?",
          "Que atividade está ocupando espaço excessivo e roubando tempo do essencial?",
          "Onde preciso aprender a descansar sem culpa e a trabalhar sem desorganização?"
        ]
      },
      {
        "day": 5,
        "title": "Dia 5",
        "confronto": "Você reserva um dia de descanso semanal — ou o descanso é o que sobra depois de tudo?",
        "direcao": "O Sabbath não foi sugestão — foi mandamento. Descanso é ato de confiança em Deus.",
        "acao": "Defina seu dia de descanso desta semana.\nO que você vai deixar de fazer nesse dia?\nPlaneje algo restaurador: caminhada, conversa, leitura prazerosa.\nProteja esse tempo como compromisso sagrado.",
        "videoUrl": "https://youtu.be/Ajt47-qdF-A",
        "artigoRico": {
          "titulo": "Mordomia cristã na prática: como reorganizar a vida à luz do senhorio de Deus",
          "texto": "A mordomia cristã na prática começa quando \"tudo pertence a Deus\" deixa de ser ideia e passa a orientar nossas escolhas."
        },
        "resumoTelas": [
          "Não precisamos mudar tudo de uma vez: o primeiro passo é olhar a vida com honestidade. Tenho administrado minha vida como quem pertence a Deus ou como dono de mim mesmo? Olhe para o conjunto — trabalho, família, saúde, espiritualidade, lazer.",
          "Reorganizar começa pelas prioridades, que aparecem nas escolhas, não nas afirmações. Pequenas decisões repetidas com consistência reorganizam a vida: rever um gasto, proteger o descanso, reservar tempo para a família.",
          "Planejar é forma de responsabilidade, não de controle. E os recursos também precisam ser examinados: vivemos dentro das possibilidades? Há espaço para generosidade? Servem só aos nossos interesses?",
          "Mordomia é privilégio, não apenas peso: nossa vida, tempo, recursos e oportunidades podem honrar a Deus e alcançar outros. Comece pelo que está diante de você: uma decisão fiel hoje."
        ],
        "artigo": {
          "titulo": "Mordomia cristã na prática: como reorganizar a vida à luz do senhorio de Deus",
          "url": "https://feemmissao.com.br/2026/10/06/mordomia-crista-na-pratica/"
        },
        "diarioPerguntas": [
          "Onde tenho agido como dono e não como mordomo?",
          "O que preciso reorganizar com mais urgência?",
          "Qual pequena decisão posso tomar hoje para alinhar minha vida ao senhorio de Deus?"
        ]
      },
      {
        "day": 6,
        "title": "Dia 6",
        "confronto": "Seus recursos financeiros estão sendo investidos em coisas que duram — ou em consumo que passa?",
        "direcao": "'Fazei para vós bolsas que não envelhecem, tesouro no céu que não se acaba.' — Lucas 12:33",
        "acao": "Liste seus últimos 5 gastos maiores.\nPergunta honesta: quantos desses foram investimento eterno?\nNão se condene — aprenda.\nEsta semana: faça um gasto com propósito eterno."
      },
      {
        "day": 7,
        "title": "Dia 7",
        "confronto": "Você tem talentos, habilidades ou recursos que não está usando a serviço de Deus?",
        "direcao": "A parábola dos talentos não fala de dinheiro — fala de tudo que você recebeu. O que você está enterrando?",
        "acao": "Leia Mateus 25:14-30.\nIdentifique um talento seu que está 'enterrado'.\nPense em como colocá-lo a serviço de Deus ou do próximo.\nDê um passo prático esta semana."
      },
      {
        "day": 8,
        "title": "Dia 8",
        "confronto": "Você tem gerenciado seu tempo nas redes sociais? Ou as redes gerenciam você?",
        "direcao": "O tempo gasto em distração é tempo tirado do que importa. Monitore com honestidade.",
        "acao": "Verifique o tempo de tela do seu celular esta semana.\nSe estiver acima do que você considera saudável: defina um limite hoje.\nRemova apps que drenam seu tempo sem edificar.\nSubstitua esse tempo por TSD ou por ação concreta."
      },
      {
        "day": 9,
        "title": "Dia 9",
        "confronto": "Como você administra os relacionamentos que Deus te deu? Você é um mordomo fiel das pessoas ao seu redor?",
        "direcao": "Pessoas também são dádiva de Deus. Como você cuida delas?",
        "acao": "Liste 3 relacionamentos importantes em sua vida.\nPara cada um: o que você tem dado? O que tem negligenciado?\nEscolha um e invista tempo nele esta semana."
      },
      {
        "day": 10,
        "title": "Dia 10",
        "confronto": "Você tem cumprido suas obrigações com qualidade — trabalho, família, compromissos — ou tem entregado menos do que pode?",
        "direcao": "'Tudo o que fizerdes, fazei-o de todo o coração, como para o Senhor.' — Colossenses 3:23",
        "acao": "Escolha uma tarefa que você tem adiado ou feito com pouco empenho.\nFaça-a hoje com excelência.\nOfe-reça ao Senhor como ato de culto.\nNão como performance — como fidelidade."
      },
      {
        "day": 11,
        "title": "Dia 11",
        "confronto": "Há dívidas na sua vida que você tem evitado enfrentar?",
        "direcao": "Mordomia inclui honestidade financeira. 'O ímpio toma emprestado e não paga.' — Salmo 37:21",
        "acao": "Se há dívidas: faça um plano honesto de quitação.\nNão adie mais.\nSe não há: ajude alguém que está em dificuldade financeira — com conselho ou recurso.\nOre pedindo sabedoria financeira."
      },
      {
        "day": 12,
        "title": "Dia 12",
        "confronto": "Você tem feito exames médicos preventivos regularmente?",
        "direcao": "Cuidar do corpo não é vaidade — é mordomia. Você não pode servir se não está bem.",
        "acao": "Verifique: quando foi seu último exame médico preventivo?\nSe passou de 1 ano: agende esta semana.\nCuide dos exames básicos como ato de responsabilidade com o que Deus te deu."
      },
      {
        "day": 13,
        "title": "Dia 13",
        "confronto": "Sua generosidade é espontânea ou calculada ao mínimo possível?",
        "direcao": "O rico jovem tinha tudo em regra — menos a generosidade radical. O que você está segurando?",
        "acao": "Faça uma oferta além do dízimo esta semana.\nNão calculada — generosa.\nEscolha uma causa ou pessoa com necessidade real.\nDê com alegria, não com contabilidade."
      },
      {
        "day": 14,
        "title": "Dia 14",
        "confronto": "Você tem tratado a criação de Deus — o meio ambiente ao seu redor — com responsabilidade?",
        "direcao": "'A terra é do Senhor.' Mordomia inclui cuidado com o que Deus criou.",
        "acao": "Uma ação prática de cuidado ambiental hoje.\nReduzir desperdício, descartar corretamente, reutilizar.\nNão como ativismo — como mordomia."
      },
      {
        "day": 15,
        "title": "Dia 15",
        "confronto": "Você tem equilibrado trabalho, família, Deus e lazer — ou alguma dessas áreas está em colapso?",
        "direcao": "Equilíbrio não é perfeição. É intencionalidade sobre todas as áreas que Deus te confiou.",
        "acao": "Avalie as quatro áreas: trabalho, família, Deus, lazer.\nQual está mais negligenciada?\nO que você pode fazer esta semana para dar atenção a ela?\nFaça."
      },
      {
        "day": 16,
        "title": "Dia 16",
        "confronto": "3 dias para encerrar esta estação. O que a mordomia revelou sobre o que você realmente valoriza?",
        "direcao": "Onde está seu tesouro, lá estará seu coração. Sua agenda e seu extrato bancário revelam o que você de fato ama.",
        "acao": "Releia suas anotações desta estação.\nO que mais te confrontou?\nOre de gratidão pelas mudanças — e de humildade pelo que ainda precisa mudar."
      },
      {
        "day": 17,
        "title": "Dia 17",
        "confronto": "Há algo que você recebeu de Deus que você ainda não colocou a serviço dEle?",
        "direcao": "Tudo foi dado para ser multiplicado. O que você está conservando que deveria estar investindo?",
        "acao": "Identifique esse recurso, talento ou oportunidade.\nDê um passo de entrega hoje.\nNão precisa ser grande — precisa ser real.\nOre: 'Senhor, isto é Teu. Use como quiser.'"
      },
      {
        "day": 18,
        "title": "Dia 18",
        "confronto": "O que desta estação vai permanecer como estilo de vida — não como tarefa concluída?",
        "direcao": "Mordomia não é projeto de 21 dias — é postura permanente de quem sabe que é mordomo, não dono.",
        "acao": "Escreva 3 hábitos de mordomia que vai manter permanentemente.\nMostre para alguém de confiança.\nOre juntos sobre esses compromissos.\nGuarde o que escreveu."
      },
      {
        "day": 19,
        "title": "Dia 19",
        "confronto": "Você tem sido fiel nas pequenas coisas — ou só se empenha quando há visibilidade?",
        "direcao": "'Quem é fiel no mínimo também é fiel no muito.' — Lucas 16:10. Mordomia começa no detalhe.",
        "acao": "Escolha uma tarefa pequena que você tem negligenciado.\nFaça-a hoje com cuidado e capricho.\nOfe-reça ao Senhor como ato de fidelidade."
      },
      {
        "day": 20,
        "title": "Dia 20",
        "confronto": "O que esta estação de mordomia mudou na forma como você vê o que tem?",
        "direcao": "Gratidão é o coração da mordomia. Quem é grato cuida bem do que recebeu.",
        "acao": "Escreva 5 coisas que você tem e frequentemente toma como garantidas.\nOre de gratidão por cada uma.\nEscolha uma para cuidar melhor a partir de hoje."
      },
      {
        "day": 21,
        "title": "Dia 21",
        "confronto": "O que esta estação revelou sobre a relação entre sua fé e sua vida prática com recursos?",
        "direcao": "Fé que não aparece na carteira, na agenda e no espelho ainda não chegou na vida real.",
        "acao": "Escreva uma declaração pessoal de mordomia — 3 linhas.\nComeçando com: 'Reconheço que sou mordomo e não dono...'\nAssine. Ore sobre ela.\nColoque em algum lugar onde vai ver todo dia."
      }
    ]
  },
  {
    "id": "rooftop",
    "title": "Serviço Cristão",
    "days": [
      {
        "day": 1,
        "title": "Dia 1",
        "confronto": "Você participa de algum ministério ou área de serviço na sua igreja — ou frequenta como espectador?",
        "direcao": "Estação 6: Serviço Cristão. 'Somos feitura de Deus, criados para boas obras.' — Efésios 2:10. Você foi feito para servir, não para ser servido.",
        "acao": "Liste os ministérios e áreas de serviço da sua igreja.\nIdentifique onde você poderia contribuir com suas habilidades.\nConverse com um líder esta semana sobre como servir.\nNão espere ser chamado — ofereça-se.",
        "videoUrl": "https://youtu.be/28P7fLs5K30",
        "artigoRico": {
          "titulo": "Serviço cristão: como Deus pode usar sua vida",
          "texto": "Deus não chama apenas pessoas extraordinárias: usa pessoas comuns que se colocam à disposição dele."
        },
        "resumoTelas": [
          "Serviço cristão começa quando entendemos que nossa vida não está separada dos propósitos de Deus. A pergunta não é só \"o que eu consigo fazer?\", mas \"como Deus pode usar minha vida?\"",
          "Deus tem um propósito para cada pessoa, e nossas limitações não impedem isso: o diferencial está no poder de Deus agindo por meio de nós. O serviço não começa com autoconfiança, mas com dependência de Deus.",
          "Deus não precisa de cópias. Temos histórias, capacidades e sensibilidades distintas, e essa singularidade pode ser justamente a forma de participarmos da missão. Em 2Coríntios 5.17–21, quem foi reconciliado passa a participar do ministério da reconciliação.",
          "O serviço não se limita à igreja: acontece na família, no trabalho e na comunidade. A pergunta fundamental é \"estou disponível para Deus?\" Disponibilidade vem antes da capacidade."
        ],
        "artigo": {
          "titulo": "Serviço cristão: como Deus pode usar sua vida",
          "url": "https://feemmissao.com.br/2026/10/06/servico-cristao-como-deus-pode-usar-sua-vida/"
        }
      },
      {
        "day": 2,
        "title": "Dia 2",
        "confronto": "Quando termina um evento ou programação da sua igreja, você ajuda a organizar — ou vai embora antes?",
        "direcao": "Servir nos bastidores é sinal de maturidade. O discípulo não serve só onde é visto.",
        "acao": "No próximo evento ou culto: fique após o término.\nAjude a organizar, limpar, desmontar.\nFaça sem que ninguém precise pedir.\nSem anunciar o que fez.",
        "videoUrl": "https://youtu.be/kO4uob8N2-g",
        "artigoRico": {
          "titulo": "Dons espirituais: como descobrir o que Deus colocou em você",
          "texto": "Deus distribui dons diferentes e forma pessoas com capacidades, experiências e sensibilidades distintas — para serem postas a serviço."
        },
        "resumoTelas": [
          "Deus não chama pessoas iguais para a mesma tarefa. Paulo apresenta diferentes dons e funções no corpo de Cristo (Efésios 4.11): ninguém precisa ocupar todos os lugares nem reproduzir o serviço de outro.",
          "Descobrir dons não é fazer um teste. É observar a própria vida: o que faço que ajuda pessoas? Em que situações percebo necessidades que outros não percebem? O que pessoas maduras na fé reconhecem em mim?",
          "Dom não é título, é responsabilidade. Reconhecer uma capacidade não exige posição formal de liderança, e ela pode ser exercida em muitos contextos. Um dom não existe para autopromoção.",
          "Sua singularidade tem lugar na missão: sua história e suas capacidades contribuem para a maneira como você serve. Deus não distribui dons para serem admirados, mas para serem colocados a serviço."
        ],
        "artigo": {
          "titulo": "Dons espirituais: como descobrir o que Deus colocou em você",
          "url": "https://feemmissao.com.br/2026/10/06/dons-espirituais-como-descobrir/"
        }
      },
      {
        "day": 3,
        "title": "Dia 3",
        "confronto": "Você já identificou quais são seus dons e habilidades para servir ao corpo de Cristo?",
        "direcao": "'Cada um recebeu algum dom; empregai-o uns para os outros.' — 1 Pedro 4:10. Você sabe qual é o seu?",
        "acao": "Liste 3 habilidades ou capacidades que você tem.\nPara cada uma: como poderia ser usada a serviço de Deus ou da comunidade?\nFale com alguém de liderança sobre como colocá-las em prática.",
        "videoUrl": "https://youtu.be/2YbOIdDSxMQ",
        "artigoRico": {
          "titulo": "Chamado para servir: quando Deus nos convida a participar",
          "texto": "O chamado para servir nem sempre vem com certeza ou sensação de capacidade: começa com disponibilidade."
        },
        "resumoTelas": [
          "Na Bíblia, pessoas chamadas por Deus perceberam suas limitações e ainda assim responderam. Em Isaías 6.8: \"Eis-me aqui. Envia-me.\" Antes de discutir capacidade, Isaías se colocou à disposição.",
          "O chamado nem sempre é uma experiência extraordinária. Às vezes Deus nos faz perceber uma necessidade que parece exigir nossa participação — na família, na igreja, na comunidade. Nem toda necessidade é nossa de resolver, mas precisamos prestar atenção.",
          "Ser chamado não é sentir-se preparado: o chamado pode produzir crise, ao evidenciar nossas limitações. Essa crise pode levar à dependência de Deus. A obra pertence a Ele; participamos como instrumentos.",
          "Disponibilidade não é ausência de medo, é não deixar o medo ter a palavra final. O chamado leva a uma resposta concreta. Quem se dispõe a Deus não precisa conhecer todo o caminho para dar o próximo passo."
        ],
        "artigo": {
          "titulo": "Chamado para servir: quando Deus nos convida a participar",
          "url": "https://feemmissao.com.br/2026/10/06/chamado-para-servir/"
        }
      },
      {
        "day": 4,
        "title": "Dia 4",
        "confronto": "Você serve por gratidão — ou por obrigação e pressão de líderes?",
        "direcao": "Serviço que vem de gratidão renova. Serviço que vem de obrigação esgota. Verifique sua motivação.",
        "acao": "Leia João 13:1-17 — Jesus lavando os pés dos discípulos.\nPergunta: o que motivou Jesus a servir desta forma?\nO que motiva o seu serviço?\nOre sobre a resposta.",
        "videoUrl": "https://youtu.be/q6sReKUSc48",
        "artigoRico": {
          "titulo": "Como desenvolver seus dons e servir a Deus com propósito",
          "texto": "Descobrir um dom é só o começo: para servir bem, é preciso desenvolver aquilo que recebemos."
        },
        "resumoTelas": [
          "Uma capacidade pode existir sem estar madura: quem tem facilidade para ensinar ainda precisa aprender a comunicar; quem tem sensibilidade para cuidar precisa amadurecer. Reconhecer um dom é assumir a responsabilidade de desenvolvê-lo, com aprendizado, prática e perseverança.",
          "O propósito não é a realização pessoal. Na perspectiva cristã, desenvolver é preparar-se para servir: \"como aquilo que estou desenvolvendo pode servir ao propósito de Deus?\"",
          "Deus usa capacidades em diferentes lugares: profissão, habilidade técnica, organização, experiência de vida. O cristão não deixa de servir quando sai da igreja — o lugar onde você está pode ser onde Deus quer usar o que você desenvolveu.",
          "Desenvolver exige prática: quem ensina precisa ensinar, quem cuida precisa cuidar. Não espere estar perfeitamente preparado: comece com fidelidade e aprenda no caminho."
        ],
        "artigo": {
          "titulo": "Como desenvolver seus dons e servir a Deus com propósito",
          "url": "https://feemmissao.com.br/2026/10/06/como-desenvolver-seus-dons/"
        }
      },
      {
        "day": 5,
        "title": "Dia 5",
        "confronto": "Há necessidades reais ao seu redor que você poderia suprir e está ignorando?",
        "direcao": "Serviço cristão não é só dentro da igreja. É em qualquer lugar onde há necessidade e você tem capacidade de agir.",
        "acao": "Olhe ao seu redor hoje com intenção.\nIdentifique 2 necessidades reais — na igreja, no trabalho, na vizinhança.\nDê 1 passo prático para suprir uma delas esta semana.",
        "videoUrl": "https://youtu.be/j-iiSBS52xQ",
        "artigoRico": {
          "titulo": "Serviço cristão na prática: vivendo como instrumento de Deus",
          "texto": "Servir na prática é transformar disponibilidade em ações concretas, onde Deus nos colocou."
        },
        "resumoTelas": [
          "Não basta reconhecer capacidades, perceber um chamado ou desenvolver dons: em algum momento é preciso passar da intenção para a prática. Serviço não é só ocupar uma função na igreja, é viver como instrumento de Deus onde Ele nos colocou.",
          "O serviço começa muitas vezes em coisas pequenas: organizar um espaço, cuidar de alguém, oferecer tempo, perceber uma necessidade. Seu valor não depende da visibilidade — no Reino, servir é colocar-se à disposição do propósito de Deus.",
          "Servimos onde Deus nos colocou: na família, pelo cuidado e presença; no trabalho, pela responsabilidade e testemunho; na igreja, pelos dons; na sociedade, pelo amor ao próximo. Não precisamos esperar a oportunidade ideal.",
          "Do espectador ao participante: o espectador percebe a necessidade e espera outro agir; o participante pergunta \"o que Deus deseja que eu faça diante disso?\". Comece onde está, use o que recebeu e confie em Deus, que trabalha por meio de instrumentos imperfeitos."
        ],
        "artigo": {
          "titulo": "Serviço cristão na prática: vivendo como instrumento de Deus",
          "url": "https://feemmissao.com.br/2026/10/06/servico-cristao-na-pratica/"
        }
      },
      {
        "day": 6,
        "title": "Dia 6",
        "confronto": "Você apoia as programações da sua igreja nos bastidores — ou só as que têm visibilidade?",
        "direcao": "'O que é grande aos olhos dos homens é abominação diante de Deus.' — Lucas 16:15. Sirva onde Deus vê.",
        "acao": "Esta semana: silencie em algum serviço da igreja que não tem visibilidade.\nFinanceiro, limpeza, recepção, comunicação, infraestrutura.\nFaça com excelência e sem publicidade."
      },
      {
        "day": 7,
        "title": "Dia 7",
        "confronto": "Você tem discernido onde Deus quer que você sirva — ou serve em qualquer área disponível sem direção?",
        "direcao": "Deus não chama para tudo. Ele chama para algo específico. Discerna com oração.",
        "acao": "Ore esta semana: 'Senhor, onde o meu dom encontra a necessidade do Teu reino?'\nConverse com seu pastor ou líder sobre o assunto.\nAguarde direção com humildade e disponibilidade."
      },
      {
        "day": 8,
        "title": "Dia 8",
        "confronto": "Você participa dos mutirões de serviço da sua comunidade ou igreja quando convocado?",
        "direcao": "Presença nos momentos coletivos de serviço é declaração de pertencimento e compromisso.",
        "acao": "Verifique se há algum mutirão, serviço coletivo ou ação programada na sua comunidade.\nSe houver: inscreva-se e vá.\nSe não houver: proponha um para seu grupo."
      },
      {
        "day": 9,
        "title": "Dia 9",
        "confronto": "Você tem servido com alegria — ou com resmungo e cansaço?",
        "direcao": "'Servi ao Senhor com alegria.' — Salmo 100:2. O serviço que ressente é sinal de que o coração precisa de renovação.",
        "acao": "Avalie: qual área de serviço você faz com mais vontade?\nQual você tem feito por obrigação?\nConverse com Deus sobre o que está pesando.\nPeça renovação da motivação."
      },
      {
        "day": 10,
        "title": "Dia 10",
        "confronto": "Você tem servido sua família como forma de serviço cristão — ou separa o 'ministério' da vida doméstica?",
        "direcao": "'Quem não sabe governar a própria casa, como cuidará da igreja?' — 1 Timóteo 3:5. Servir começa em casa.",
        "acao": "Hoje: sirva sua família de forma prática.\nSem reconhecimento, sem esperar reciprocidade.\nLave a louça, cuide das crianças, prepare uma refeição.\nFaça como ato de ministério, não de tarefa."
      },
      {
        "day": 11,
        "title": "Dia 11",
        "confronto": "Há alguém que você poderia mentorear, ensinar ou acompanhar no crescimento espiritual?",
        "direcao": "Serviço mais multiplicador é o que forma outros servos. Discipulado gera discipulado.",
        "acao": "Identifique uma pessoa menos experiente na fé ao seu redor.\nOfereça-se para caminhar junto com ela por um período.\nNão precisar ter tudo resolvido — precisa estar disponível.\nDê o primeiro passo esta semana."
      },
      {
        "day": 12,
        "title": "Dia 12",
        "confronto": "Você tem servido além do que é confortável — ou só no que não custa muito?",
        "direcao": "Serviço que não custa nada pode ser apenas conveniência. Seguir Jesus sempre custa algo.",
        "acao": "Identifique uma área de serviço que está além da sua zona de conforto.\nDê um passo nessa direção esta semana.\nNão para impressionar — para crescer."
      },
      {
        "day": 13,
        "title": "Dia 13",
        "confronto": "Você tem cuidado bem das pessoas ao seu lado no serviço — ou está tão focado na tarefa que esquece das pessoas?",
        "direcao": "Serviço cristão não é sobre projetos — é sobre pessoas. Jesus sempre via as pessoas por trás das necessidades.",
        "acao": "No próximo momento de serviço: pare e olhe para quem está servindo junto com você.\nPergunte como estão.\nOuça de verdade.\nO ministério às vezes está na equipe, não no projeto."
      },
      {
        "day": 14,
        "title": "Dia 14",
        "confronto": "Você sente que está servindo no lugar certo — ou há uma voz interna dizendo que há outro chamado?",
        "direcao": "Deus não coloca dons para ficarem não-utilizados. Se há insatisfação, talvez haja direcionamento.",
        "acao": "Ore esta semana sobre seu chamado.\nConverse com alguém sábio sobre onde você se sente mais vivo ao servir.\nNão tome decisões precipitadas — mas não ignore o que Deus pode estar dizendo."
      },
      {
        "day": 15,
        "title": "Dia 15",
        "confronto": "Você tem servido com excelência — ou com o mínimo aceitável?",
        "direcao": "'Qualquer coisa que façais, fazei-a de todo o coração, como para o Senhor.' — Colossenses 3:23",
        "acao": "Escolha uma tarefa de serviço que você faz.\nFaça-a hoje com o máximo de excelência que consegue.\nNão por performance — por oferta.\nOfereça ao Senhor o melhor do que tem."
      },
      {
        "day": 16,
        "title": "Dia 16",
        "confronto": "Há alguém no ministério com quem você tem conflito não resolvido?",
        "direcao": "Servir junto com quem você não suporta é o teste real de maturidade cristã.",
        "acao": "Identifique essa pessoa.\nOre por ela com genuíno amor por 5 minutos.\nSe necessário: busque reconciliação.\nNão espere que ela venha primeiro."
      },
      {
        "day": 17,
        "title": "Dia 17",
        "confronto": "Você já chegou a 17 dias desta estação. O que o serviço está ensinando sobre você?",
        "direcao": "O serviço revela o caráter. O que você descobriu sobre si mesmo ao servir?",
        "acao": "Escreva 3 lições sobre seu caráter que o serviço revelou.\nSeja honesto — bom e ruim.\nOre sobre cada uma.\nAgradeça pela escola do serviço."
      },
      {
        "day": 18,
        "title": "Dia 18",
        "confronto": "Há algo que você poderia construir, criar ou iniciar que serviria à comunidade ao seu redor?",
        "direcao": "Neemias não esperou alguém construir o muro. Ele orou, planejou e começou. E vocação em ação.",
        "acao": "Leia Neemias 2:17-18.\nPense: o que precisa ser construído na sua comunidade?\nO que você pode iniciar?\nDê o primeiro passo — mesmo que pequeno."
      },
      {
        "day": 19,
        "title": "Dia 19",
        "confronto": "Esta estação está quase no fim. O que vai ficar como compromisso permanente de serviço?",
        "direcao": "Serviço não é fase — é postura. 'O Filho do Homem não veio para ser servido, mas para servir.' — Mateus 20:28",
        "acao": "Decida uma área de serviço onde vai se comprometer permanentemente.\nComunique esse compromisso a um líder.\nOre: 'Senhor, sou servo do Teu reino. Use-me.'"
      },
      {
        "day": 20,
        "title": "Dia 20",
        "confronto": "O que esta estação revelou sobre a diferença entre servir para ser visto e servir por amor?",
        "direcao": "'Quando, pois, deres esmola, não faças tocar trombeta diante de ti.' — Mateus 6:2. Serviço secreto é serviço puro.",
        "acao": "Faça hoje um ato de serviço que ninguém vai saber que foi você.\nNenhum registro. Nenhum comentário.\nSó você e Deus.\nOre: 'Senhor, Tu vês. Isso basta.'"
      },
      {
        "day": 21,
        "title": "Dia 21",
        "confronto": "Como você vai sair desta estação diferente de como entrou?",
        "direcao": "Serviço cristão forma o servo tanto quanto abençoa quem é servido. O que mudou em você?",
        "acao": "Escreva uma declaração de serviço — o que você se compromete a ser e fazer a partir de agora.\nAssine.\nCompartilhe com alguém de confiança.\nOre sobre ela com essa pessoa."
      }
    ]
  },
  {
    "id": "city",
    "title": "Comunhão com os Santos",
    "days": [
      {
        "day": 1,
        "title": "Dia 1",
        "confronto": "Você tem pessoas na sua igleja em quem confia como confidentes — ou vive a fé de forma isolada?",
        "direcao": "Estação 7: Comunhão com os Santos. 'Em Disto todos conhecerão que sois meus discípulos: se tiverdes amor uns aos outros.' — João 13:35",
        "acao": "Liste pessoas de fé com quem você tem vínculos reais.\nSe a lista estiver vazia ou com poucos nomes: isso é o ponto de partida desta estação.\nOre: 'Senhor, dá-me comunidade real.'",
        "artigoRico": {
          "titulo": "Comunhão cristã: por que não vivemos a fé sozinhos",
          "texto": "Estar conectado não é ter comunhão. É possível frequentar o mesmo culto, cantar as mesmas canções e ainda assim viver a fé de forma individualizada."
        },
        "resumoTelas": [
          "Conexão não significa comunhão. Estamos conectados a muitas pessoas, mas isso não garante vínculos profundos — nem dentro da igreja.",
          "A experiência cristã pode se tornar individualizada mesmo dentro do templo: a igreja pode parecer uma fila de cinema, onde todos compartilham o espaço, mas pouco se conectam. Ou um shopping, onde cada um pega o que precisa e vai embora.",
          "A comunhão não é detalhe da vida cristã. Em Atos 2.42, os primeiros cristãos perseveravam na comunhão, e Jesus ligou a identidade dos discípulos ao amor mútuo (João 13.34–35).",
          "A pergunta não é só \"estou frequentando a igreja?\", mas \"estou vivendo a fé com meus irmãos?\". Comunhão é participação, sociedade e amizade — ter vida em comum."
        ],
        "artigo": {
          "titulo": "Comunhão cristã: por que não vivemos a fé sozinhos",
          "url": "https://feemmissao.com.br/2026/10/05/comunhao-crista-fe-nao-vivida-sozinho/"
        },
        "diarioPerguntas": [
          "Você sente que pertence à igreja, que é parte dela?",
          "Em quais momentos sua experiência cristã corre o risco de ficar concentrada apenas em você?",
          "Você tem construído vínculos com irmãos de fé para além dos encontros formais da igreja?"
        ],
        "videoUrl": "https://youtu.be/Su9OcAK_Wv4"
      },
      {
        "day": 2,
        "title": "Dia 2",
        "confronto": "Você fica após os cultos conversando com seus irmãos de fé — ou vai embora assim que termina?",
        "direcao": "'Não deixando de nos reunirmos.' — Hebreus 10:25. Comunhão acontece no tempo não programado.",
        "acao": "No próximo culto ou reunião: fique ao menos 30 minutos depois.\nConverse. Pergunte. Ouça.\nNão para cumprir tarefa — para fazer conexão real.",
        "artigoRico": {
          "titulo": "Frequentar a igreja é o mesmo que pertencer?",
          "texto": "Frequentar não é pertencer. Pertencer é mais profundo do que ocupar um espaço: envolve reconhecer que minha história está ligada à de outros irmãos."
        },
        "resumoTelas": [
          "É possível estar anos em uma igreja sem sentir pertencimento. A diferença está entre \"eu vou à igreja\" e \"eu sou igreja com essas pessoas\".",
          "Na Bíblia, os cristãos são \"concidadãos dos santos e da família de Deus\" (Efésios 2.19). Pertencer é reconhecer-se parte da comunidade, não apenas estar perto dela.",
          "O pertencimento não nasce automaticamente: ambientes e programações não produzem vínculos profundos por si só. Ele exige iniciativa de se aproximar de quem ainda não faz parte do seu círculo.",
          "Um passo simples: no próximo domingo, converse antes e depois do culto com duas pessoas que não fazem parte do seu círculo mais próximo. Comunhão pode começar com uma conversa."
        ],
        "artigo": {
          "titulo": "Frequentar a igreja é o mesmo que pertencer?",
          "url": "https://feemmissao.com.br/2026/10/05/pertencimento-a-igreja/"
        },
        "diarioPerguntas": [
          "Você se sente parte da igreja ou apenas alguém que frequenta a igreja?",
          "Que fatores têm impedido você de aprofundar relacionamentos com seus irmãos de fé?",
          "Quais pessoas estão ao seu redor, mas ainda não fazem parte do seu círculo de relacionamento?"
        ],
        "videoUrl": "https://youtu.be/JLq5MsCqIlM"
      },
      {
        "day": 3,
        "title": "Dia 3",
        "confronto": "Quando foi a última vez que você foi à casa de um irmão de fé — ou o convidou para a sua casa?",
        "direcao": "Comunhão acontece em mesas, casas e conversas. Não só em templos e programações formais.",
        "acao": "Convide um irmão de fé para sua casa esta semana.\nRefeição simples, café, conversa.\nSem grande produção — só presença.\nSe não tiver espaço em casa: proponha um café fora.",
        "artigoRico": {
          "titulo": "Comunhão cristã na prática: convivência além do culto",
          "texto": "A reciprocidade bíblica só é possível através da convivência: comunhão exige tempo e presença, além dos encontros formais da igreja."
        },
        "resumoTelas": [
          "Podemos acompanhar pessoas pelas redes e por mensagens, mas existe uma dimensão da comunhão que exige presença e convivência.",
          "No culto encontramos irmãos em um momento específico. É na convivência que conhecemos histórias, percebemos crises, alegrias e quem precisa de companhia.",
          "Hebreus 10.24–25 liga a reunião dos cristãos ao encorajamento mútuo. Um café, um passeio ou uma refeição podem abrir conversas que nunca aconteceriam no corredor da igreja. Às vezes, comunhão é simplesmente estar junto.",
          "A convivência pode ser desconfortável, porque somos diferentes. Mas é essa multiplicidade que produz crescimento. Comunhão não é aumentar contatos: é aprofundar a qualidade dos vínculos."
        ],
        "artigo": {
          "titulo": "Comunhão cristã na prática: convivência além do culto",
          "url": "https://feemmissao.com.br/2026/10/05/comunhao-crista-na-pratica/"
        },
        "diarioPerguntas": [
          "Com quais irmãos você convive além dos momentos formais da igreja?",
          "Quando foi a última vez que você encontrou alguém da igreja simplesmente para estar junto?",
          "Seu círculo de relacionamento dentro da igreja é amplo ou está concentrado sempre nas mesmas pessoas?",
          "Que passo concreto você pode dar nesta semana para cultivar uma amizade cristã?"
        ],
        "videoUrl": "https://youtu.be/Z25cJgTRHuY"
      },
      {
        "day": 4,
        "title": "Dia 4",
        "confronto": "Você tem pessoas que consideram amigos de fé — com quem pode ser vulnerable e honesto?",
        "direcao": "Amizade espiritual não é sobre ter alguém para orar junto nos eventos — é sobre ser conhecido de verdade.",
        "acao": "Identifique uma pessoa de fé com quem você poderia ter uma conversa honesta.\nMarque um encontro esta semana.\nNa conversa: seja real. Não performance. Não devocional decorado.\nSeja você.",
        "artigoRico": {
          "titulo": "Uns aos outros na Bíblia: a prática da comunhão",
          "texto": "A expressão \"uns aos outros\" torna concreta a ideia de comunhão: uma comunidade em que os membros cuidam uns dos outros."
        },
        "resumoTelas": [
          "A Bíblia usa a linguagem da reciprocidade: amar, orar, carregar cargas, edificar, admoestar e exortar \"uns aos outros\". Não é só alguém fazendo algo por outro — é uma comunidade cuidando de si.",
          "Amar uns aos outros (João 13.34–35) é o sinal do discipulado. Não depende de afinidade: é possível decidir tratar com amor quem não é do nosso círculo.",
          "Orar uns pelos outros (Tiago 5.16) e carregar as cargas uns dos outros (Gálatas 6.2) significa não permanecer indiferente: perceber, aproximar-se e oferecer o que está ao nosso alcance.",
          "Edificar, admoestar e exortar (1Ts 5.11; Rm 15.14) exigem vínculos profundos, com verdade e graça. Eu não existo só para receber da comunidade — minha vida também serve e cuida dos irmãos."
        ],
        "artigo": {
          "titulo": "Uns aos outros na Bíblia: a prática da comunhão",
          "url": "https://feemmissao.com.br/2026/10/05/uns-aos-outros-na-biblia/"
        },
        "diarioPerguntas": [
          "Quem são as pessoas da sua comunidade pelas quais você tem orado?",
          "Existe alguém cuja carga você poderia ajudar a carregar?",
          "Você tem relacionamentos nos quais consegue receber conselho e também oferecer cuidado?",
          "De que maneira sua presença tem contribuído para edificar outras pessoas?"
        ],
        "videoUrl": "https://youtu.be/cAIabueJv58"
      },
      {
        "day": 5,
        "title": "Dia 5",
        "confronto": "Você sai com seus irmãos de fé para encontros informais — fora das programações da igreja?",
        "direcao": "Os primeiros discípulos comiam juntos, andavam juntos, sofriam juntos. Comunhão é cotidiana, não só litúrgica.",
        "acao": "Organize ou participe de um encontro informal com irmãos esta semana.\nRestaurante, praça, casa.\nSem pauta religiosa obrigatória — só vida compartilhada.\nIsso é comunhão.",
        "artigoRico": {
          "titulo": "Como viver como igreja: de espectador a participante",
          "texto": "A comunhão nos leva a uma mudança de posição: de espectador para participante. O espectador pergunta o que a igreja oferece; o participante, como pode contribuir."
        },
        "resumoTelas": [
          "A igreja não é um serviço que consumimos. Na lógica do consumo, o relacionamento é substituído pela utilidade — e a comunhão perde espaço.",
          "Paulo descreve a igreja como um corpo (1Co 12.27): cada pessoa é parte de algo maior, e sua presença tem relação com a vida dos demais.",
          "Participar não é necessariamente ocupar uma função. Começa em conhecer pessoas, ser conhecido, ouvir, celebrar com quem celebra e aproximar-se de quem sofre.",
          "Comunhão não acontece de uma vez: é construída na convivência, na reciprocidade e na disposição de caminhar juntos. Pense nos nomes das pessoas, não só na frequência aos cultos."
        ],
        "artigo": {
          "titulo": "Como viver como igreja: de espectador a participante",
          "url": "https://feemmissao.com.br/2026/10/05/como-viver-como-igreja/"
        },
        "desafioArtigo": "Nesta semana, tenha um tempo de qualidade com um irmão ou uma irmã da igreja. Além disso, converse, antes ou depois do culto, com duas pessoas que não fazem parte do seu círculo de amizade mais próximo. Não transforme isso em tarefa mecânica: conheça pessoas, escute, pergunte, esteja presente.",
        "diarioPerguntas": [
          "Você sente que pertence à igreja, que é parte dela?",
          "Quem conhece suas lutas e alegrias na sua comunidade?",
          "Que passo concreto você pode dar nesta semana para deixar de ser espectador e passar a participar?"
        ],
        "videoUrl": "https://youtu.be/iDLCjVivaP0"
      },
      {
        "day": 6,
        "title": "Dia 6",
        "confronto": "Você tem se colocado vulnerável com alguém de fé — ou mantém as aparências espirituais?",
        "direcao": "'Confessai as vossas faltas uns aos outros e orai uns pelos outros.' — Tiago 5:16. Transparência é força, não fraqueza.",
        "acao": "Com alguém de confiança esta semana: compartilhe algo real com que você está lutando.\nNão minimize. Não exagere. Seja honesto.\nPermita que orem por você."
      },
      {
        "day": 7,
        "title": "Dia 7",
        "confronto": "Você tem intercedido pelos seus irmãos de fé com especificidade — ou sua intercessão pela comunidade é genérica?",
        "direcao": "Comunhão inclui carregar o outro em oração. Quem você está levando a Deus pelo nome?",
        "acao": "Liste 3 irmãos de fé e uma necessidade específica de cada um.\nOre por cada um hoje com detalhe e amor.\nSe não souber as necessidades deles: isso revela que o vínculo precisa ser aprofundado."
      },
      {
        "day": 8,
        "title": "Dia 8",
        "confronto": "Há alguém na sua comunidade de fé que está isolado ou em sofrimento e que você poderia alcançar?",
        "direcao": "Comunhão real não espera que o outro apareça — ela vai buscar.",
        "acao": "Identifique alguém que sumiu dos cultos ou que está passando por algo difícil.\nEntre em contato hoje.\nNão para pregar — para estar presente.\n'Vi que você sumiu. Pensei em você.'"
      },
      {
        "day": 9,
        "title": "Dia 9",
        "confronto": "Você tem conflitos não resolvidos com alguém da sua comunidade de fé?",
        "direcao": "'Se trouxeres a tua oferta ao altar, e ali te lembrares que teu irmão tem alguma coisa contra ti, deixa ali a tua oferta e vai primeiro reconciliar-te com teu irmão.' — Mateus 5:23-24",
        "acao": "Se há conflito: dê o primeiro passo hoje.\nNão espere que ele reconheça o erro primeiro.\nBusque paz. Seja humilde.\nOre antes de ir."
      },
      {
        "day": 10,
        "title": "Dia 10",
        "confronto": "Você tem ampliado seu círculo de comunhão — ou fica nas mesmas 3 ou 4 pessoas de sempre?",
        "direcao": "'Terás amigos muitos se quiseres ser amigo.' — Comunidade crescente requer iniciativa constante.",
        "acao": "Esta semana: inicie conversa com alguém da sua igreja com quem você não tem proximidade.\nPresente-se. Pergunte o nome, a história, como chegou à fé.\nUm novo vínculo começa com uma primeira conversa."
      },
      {
        "day": 11,
        "title": "Dia 11",
        "confronto": "Você tem exigido mais da comunidade do que tem oferecido a ela?",
        "direcao": "Comunhão é reciprocidade. Você colhe onde não semeou — ou tem contribuído com o que tem?",
        "acao": "Avalie: o que você tem dado à sua comunidade?\nNão em serviços formais — em presença, atenção, cuidado, oração.\nO que você poderia oferecer mais?\nDê um passo prático hoje."
      },
      {
        "day": 12,
        "title": "Dia 12",
        "confronto": "Você tem celebrado as conquistas dos seus irmãos de fé — ou o sucesso alheio te incomoda?",
        "direcao": "'Alegrai-vos com os que se alegram; chorai com os que choram.' — Romanos 12:15. Comunhão partilha os dois.",
        "acao": "Identifique algo que um irmão está vivendo com alegria — conquista, resposta de oração, notícia boa.\nCelebre com ele. Genuinamente.\nDiga: 'Fico feliz com isso. Que Deus continue abrindo portas.'"
      },
      {
        "day": 13,
        "title": "Dia 13",
        "confronto": "Você tem orado com outros irmãos — ou sua vida de oração é sempre individual?",
        "direcao": "'Onde dois ou três estiverem reunidos em meu nome, ali estarei no meio deles.' — Mateus 18:20",
        "acao": "Organize ou participe de um momento de oração com um irmão esta semana.\nNão precisa ser longo — 15 minutos.\nOrem um pelo outro com especificidade.\nIsso é comunhão de oração."
      },
      {
        "day": 14,
        "title": "Dia 14",
        "confronto": "Você conhece a história de fé dos seus irmãos mais próximos — como chegaram a Deus, o que passaram?",
        "direcao": "Comunidade profunda conhece histórias, não apenas nomes. Você conhece as histórias das pessoas ao seu redor?",
        "acao": "Pergunte a um irmão de fé: como foi seu encontro com Deus?\nOuça sem pressa.\nPartilhe também a sua história.\nIsso aprofunda o vínculo."
      },
      {
        "day": 15,
        "title": "Dia 15",
        "confronto": "Há alguém na sua comunidade que você julgou e tomou distância — e que você poderia buscar com graça?",
        "direcao": "Comunhão se quebra com julgamento. Se restaura com graça.",
        "acao": "Identifique essa pessoa.\nOre por ela com genuíno amor.\nDê um passo de aproximação esta semana.\nSem cobrar — só oferecer presença."
      },
      {
        "day": 16,
        "title": "Dia 16",
        "confronto": "Você tem sido grato pela comunidade que Deus te deu — ou reclama mais do que celebra?",
        "direcao": "A comunidade imperfeita é a única que existe. Deus a usa assim mesmo para nos formar.",
        "acao": "Escreva 5 coisas pelas quais você é grato na sua comunidade de fé.\nLeia em voz alta para Deus.\nCompartilhe pelo menos uma com alguém da comunidade hoje."
      },
      {
        "day": 17,
        "title": "Dia 17",
        "confronto": "Como está sua participação no culto dominical? Ela é regular, intencional e participativa?",
        "direcao": "O culto coletivo não é opcional para o discípulo. É onde o corpo se reúne, ora e recebe.",
        "acao": "Avalie sua participação nos últimos 3 meses.\nSe tem sido irregular: comprometa-se com regularidade a partir desta semana.\nQuando for: participe ativamente — não como espectador."
      },
      {
        "day": 18,
        "title": "Dia 18",
        "confronto": "18 dias de comunhão. Seus vínculos na fé estão mais profundos do que quando começou?",
        "direcao": "Comunidade é investimento de longo prazo. O que você plantou nesta estação vai crescer.",
        "acao": "Escreva os nomes das pessoas com quem seu vínculo cresceu nesta estação.\nOre por cada uma de gratidão.\nEnvie uma mensagem de cuidado para pelo menos uma hoje."
      },
      {
        "day": 19,
        "title": "Dia 19",
        "confronto": "Há alguém com quem você quer cultivar uma amizade espiritual profunda nos próximos meses?",
        "direcao": "Amizades espirituais profundas não acontecem por acidente — são cultivadas com intenção.",
        "acao": "Identifique essa pessoa.\nOfereça a ela um compromisso regular: café mensal, grupo de oração, caminhada semanal.\nProponha essa semana.\nComeçe."
      },
      {
        "day": 20,
        "title": "Dia 20",
        "confronto": "Você já chegou em 20 dias desta última estação. O que a comunhão com os santos ensinou sobre sua fé?",
        "direcao": "'O hierro afia o hierro.' — Provérbios 27:17. Você foi apurado em comunidade nesta jornada?",
        "acao": "Escreva o que a comunhão revelou sobre você.\nO que foi difícil? O que foi transformador?\nOre de gratidão pela escola da comunidade."
      },
      {
        "day": 21,
        "title": "Dia 21",
        "confronto": "Você termina a jornada inteira do Talmidim. O que permanece?",
        "direcao": "Não há graduação no discipulado — há aprofundamento. O fim desta jornada é o início de uma vida discipular mais intencional.",
        "acao": "Escreva uma carta para você mesmo — a ser lida em 1 ano.\nO que você quer ter se tornado?\nO que você não quer ter abandonado?\nOre sobre o que escreveu."
      }
    ]
  }
];

export const stageOrder = stages.map((s) => s.id);

export const getStage = (id: string) => stages.find((s) => s.id === id);

// Nome da insígnia concedida ao concluir cada estação (21 dias).
// Usado no rodapé do plano diário (barra de evolução) e na tela de
// congratulações (revelação da insígnia).
export const badgeNames: Record<string, string> = {
  house: "A Semente",
  street: "O Caminho",
  clinic: "A Cura",
  office: "A Vocação",
  construction: "A Edificação",
  rooftop: "A Visão",
  city: "O Cidadão",
};
