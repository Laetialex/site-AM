"use server";

import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin";
import { createAdminClient, supabaseAdminConfigured } from "@/lib/supabase/admin";
import {
  sendOrderPreparingEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  type OrderEmailItem,
} from "@/lib/email";
import { getOrigin } from "@/lib/origin";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

export type OrderRow = {
  id: string;
  email: string;
  items: OrderEmailItem[];
  amount_total: number;
  status: string;
  created_at: string;
};

export async function listOrders(): Promise<OrderRow[]> {
  if (!(await isAdmin()) || !supabaseAdminConfigured) return [];

  const admin = createAdminClient()!;
  const { data } = await admin
    .from("orders")
    .select("id,email,items,amount_total,status,created_at")
    .order("created_at", { ascending: false });

  return (data as OrderRow[]) ?? [];
}

export type UpdateOrderStatusState = { success?: boolean; error?: string };

const NEXT_STATUS: Record<string, "preparing" | "shipped" | "delivered" | undefined> = {
  paid: "preparing",
  preparing: "shipped",
  shipped: "delivered",
  delivered: undefined,
};

export async function updateOrderStatus(orderId: string): Promise<UpdateOrderStatusState> {
  if (!(await isAdmin())) {
    return { error: "Non autorisé." };
  }
  if (!supabaseAdminConfigured) {
    return { error: "Supabase n'est pas configuré." };
  }

  const admin = createAdminClient()!;
  const { data: order, error: fetchError } = await admin
    .from("orders")
    .select("email,items,status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { error: "Commande introuvable." };
  }

  const nextStatus = NEXT_STATUS[order.status];
  if (!nextStatus) {
    return { error: "Cette commande a déjà atteint son dernier statut." };
  }

  const { error: updateError } = await admin
    .from("orders")
    .update({ status: nextStatus })
    .eq("id", orderId);

  if (updateError) {
    return { error: "Erreur lors de la mise à jour." };
  }

  const items = order.items as OrderEmailItem[];

  try {
    if (nextStatus === "preparing") {
      await sendOrderPreparingEmail({ to: order.email, items });
    } else if (nextStatus === "shipped") {
      await sendOrderShippedEmail({ to: order.email, items });
    } else if (nextStatus === "delivered") {
      const origin = await getOrigin();
      await sendOrderDeliveredEmail({ to: order.email, items, origin });
    }
  } catch (err) {
    console.error("Erreur envoi email de suivi de commande :", err);
  }

  return { success: true };
}
