import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/compte/actions";
import { Container } from "@/components/ui/Container";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AuthPanel } from "@/components/account/AuthPanel";

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/compte";

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user || !supabase) {
    return (
      <Container className="flex flex-col items-center gap-10 py-16 sm:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl sm:text-5xl">Mon compte</h1>
          <p className="max-w-sm text-sm font-light text-am-offwhite-muted">
            Connecte-toi ou crée un compte pour retrouver tes favoris et
            suivre tes commandes.
          </p>
        </div>
        <AuthPanel next={safeNext} />
      </Container>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("prenom")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <Container className="flex flex-col items-center gap-8 py-16 sm:py-20 text-center">
      <h1 className="text-4xl sm:text-5xl">
        Bonjour{profile?.prenom ? ` ${profile.prenom}` : ""}
      </h1>
      <p className="text-sm font-light text-am-offwhite-muted">{user.email}</p>

      <div className="flex flex-col items-center gap-3">
        <Link
          href="/favoris"
          className="text-sm text-am-offwhite underline underline-offset-4 hover:text-am-gold"
        >
          Mes favoris
        </Link>
        <form action={signOut}>
          <SubmitButton variant="secondary" pendingLabel="...">
            Se déconnecter
          </SubmitButton>
        </form>
      </div>
    </Container>
  );
}
