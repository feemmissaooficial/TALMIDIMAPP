import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente Supabase para uso em Route Handlers / Server Components.
// Necessário para trocar o "code" do OAuth por uma sessão real ANTES
// de redirecionar o navegador, evitando a corrida (race condition)
// que causava o loop de login.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component sem permissão de escrita.
            // Pode ser ignorado pois o middleware já cuida de renovar a sessão.
          }
        },
      },
    }
  );
}
