import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

// Recebe a volta do login com Google, troca o "code" por uma sessão
// válida (gravando o cookie no servidor) e só então redireciona.
// Isso elimina a corrida entre o cookie ser gravado e a página seguinte
// já checar a sessão, que era o que causava o loop de login.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/start";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/start?auth_error=1`);
}
