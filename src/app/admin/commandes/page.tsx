import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE } from "@/lib/admin";
import { listOrders } from "@/app/actions/orders";
import { OrdersList } from "@/components/admin/OrdersList";
import { logoutAdmin } from "@/app/actions/admin";

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value !== "1") {
    redirect("/admin/login");
  }

  const orders = await listOrders();

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-10 px-6 py-16">
      <div className="absolute left-6 top-6 flex gap-4">
        <Link
          href="/admin/offres"
          className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase underline underline-offset-4 hover:text-am-offwhite"
        >
          Emails promo
        </Link>
      </div>
      <form action={logoutAdmin} className="absolute right-6 top-6">
        <button
          type="submit"
          className="text-xs tracking-[0.1em] text-am-offwhite-muted uppercase underline underline-offset-4 hover:text-am-offwhite"
        >
          Déconnexion
        </button>
      </form>
      <h1 className="font-serif text-3xl text-am-offwhite">Commandes</h1>
      <OrdersList orders={orders} />
    </div>
  );
}
