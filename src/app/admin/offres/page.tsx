import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin";
import { OfferComposer } from "@/components/admin/OfferComposer";
import { logoutAdmin } from "@/app/actions/admin";

export default async function AdminOffersPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value !== "1") {
    redirect("/admin/login");
  }

  return (
    <div className="relative">
      <form action={logoutAdmin} className="absolute right-6 top-6">
        <button
          type="submit"
          className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase underline underline-offset-4 hover:text-am-offwhite"
        >
          Déconnexion
        </button>
      </form>
      <OfferComposer />
    </div>
  );
}
