"use client";

// Rede de segurança: se qualquer parte do app quebrar (erro de código,
// dado inesperado do banco, etc.), o Next mostra isto em vez de uma tela
// branca sem nada. Sem isso, qualquer erro não tratado deixava a pessoa
// travada numa tela em branco, sem saber o que fazer.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "#0a0f0a",
            color: "#eaddc5",
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Algo travou aqui.
          </h1>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 24, maxWidth: 320 }}>
            Não se preocupe, seu progresso está salvo. Toque no botão abaixo pra tentar de novo.
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                reset();
              }
            }}
            style={{
              background: "linear-gradient(90deg, #b58b54, #eaddc5)",
              color: "#1a1406",
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 16,
              border: "none",
            }}
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
