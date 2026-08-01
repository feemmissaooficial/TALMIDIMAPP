# Talmidim App: Canonical Design System

Este documento estabelece as regras visuais absolutas para o aplicativo Talmidim. Qualquer nova tela, componente ou módulo deve seguir estritamente estas diretrizes para manter a consistência premium nível "Apple".

## 1. Princípio Estrutural (O "Mobile Frame")
O aplicativo é um PWA com mentalidade Mobile-First.
- **Telas Pequenas (Smartphones):** O aplicativo assume 100% da largura e altura da tela.
- **Telas Grandes (Tablets e Desktops):** O aplicativo **NÃO** deve esparramar. Ele deve assumir a forma de um "celular virtual" (Mobile Frame) flutuando no centro da tela.
  - O fundo da tela inteira do Desktop deve ser preto/escuro (`bg-black` ou `bg-[#0a0f0a]`).
  - O "envelope" principal do app deve ter largura máxima fixa (`max-w-[420px]`) e ser centralizado (`mx-auto`).
  - Isso garante que barras fixas na base (ex: "Próxima Área") acompanhem a largura do envelope e não do monitor.

## 2. Paleta de Cores Oficial
As cores representam a seriedade, elegância e espiritualidade profunda da jornada (baseado nas raízes da identidade visual original).

| Função | Cor | Hex Code | Uso |
|---|---|---|---|
| **Fundo Secundário (Desktop)** | Preto Puro | `#000000` | Preencher as laterais no monitor grande. |
| **Fundo Escuro Premium** | Verde Floresta Escuro | `#0a0f0a` | Fundo de telas noturnas, alertas, ou a base do Radar. |
| **Fundo Claro (Conteúdo)** | Creme / Off-White | `#fdfaf6` | Fundo de telas de leitura e fundo principal do App. |
| **Texto Primário (Escuro)** | Verde Musgo Forte | `#243525` ou `#1f3020` | Títulos, textos principais em fundo claro. |
| **Texto Secundário (Claro)** | Creme Suave | `#eaddc5` | Textos em fundo escuro, descrições. |
| **Acento Primário (CTA)** | Dourado | `#c69b5c` | Botões, estrelas, gráficos SVG, bordas de foco. |
| **Acento Secundário** | Ouro Envelhecido | `#b38a53` e `#d5b080` | Usados em gradientes lineares (ex: `from-[#d5b080] to-[#b38a53]`). |

## 3. Tipografia
- **Fontes de Leitura (Corpo):** Sans-serif do sistema (padrão do Next.js/Tailwind). Deve transmitir clareza absoluta e legibilidade. Peso 400 ou 500. Tamanho base: `16px`.
- **Títulos e Destacados:** Para telas de vitória ou capas, usar a família `serif` (fontes serifadas no Tailwind) combinada com pesos ousados (`font-bold`).
- **Pequenas Etiquetas:** Letras maiúsculas, fonte bem pequena (`11px` ou `12px`), peso `font-bold` e com espaçamento entre letras alargado (`tracking-widest`). Traz a sensação de editorial fino.

## 4. Sombras e Texturas (Glassmorphism)
- A estética "Apple" é baseada em profundidades sutis. 
- Evite sombras duras pretas.
- Use `shadow-[0_15px_30px_rgba(X,X,X,0.2)]` personalizando a cor do RGBA para a cor de acento do componente. (ex: Sombras douradas levemente transparentes embaixo de um botão dourado).
- Sobreposições modais devem usar desfoque: `bg-black/80 backdrop-blur-md`.

## 5. Padrão de Botões
Todos os botões principais devem seguir as seguintes regras:
- Largura total do formulário ou card (`w-full`).
- Espaçamento interno vertical generoso (`py-4`).
- Bordas arredondadas e amigáveis (`rounded-[16px]` ou `rounded-[20px]`).
- Peso da fonte pesado (`font-bold`).
- Interatividade física sutil: deve afundar ao ser tocado (`active:scale-95 transition-all`).
