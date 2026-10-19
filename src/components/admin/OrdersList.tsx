"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus, type OrderRow } from "@/app/actions/orders";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  paid: "Payée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
};

const NEXT_ACTION_LABELS: Record<string, string> = {
  paid: "Marquer en préparation",
  preparing: "Marquer comme expédiée",
  shipped: "Marquer comme livrée",
};

const NEXT_STATUS: Record<string, string> = {
  paid: "preparing",
  preparing: "shipped",
  shipped: "delivered",
};

function OrderRowItem({ order }: { order: OrderRow }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);
  const [error, setError] = useState<string | null>(null);

  const nextActionLabel = NEXT_ACTION_LABELS[status];

  function handleAdvance() {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(order.id);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus((s) => NEXT_STATUS[s] ?? s);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 border-b border-am-offwhite/10 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-am-offwhite">{order.email}</p>
        <span className="text-xs tracking-[0.1em] text-am-gold uppercase">
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>
      <p className="text-xs font-light text-am-offwhite-muted">
        {order.items.map((item) => `${item.name} (${item.size} ×${item.quantity})`).join(", ")}
      </p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-am-offwhite-muted">
          {formatPrice(order.amount_total / 100)} —{" "}
          {new Date(order.created_at).toLocaleDateString("fr-FR")}
        </p>
        {nextActionLabel && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleAdvance}
            disabled={pending}
            className="px-4 py-2 text-[10px]"
          >
            {pending ? "..." : nextActionLabel}
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-am-gold">
          {error}
        </p>
      )}
    </div>
  );
}

export function OrdersList({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-am-offwhite-muted">Aucune commande pour le moment.</p>;
  }

  return (
    <div className="flex flex-col">
      {orders.map((order) => (
        <OrderRowItem key={order.id} order={order} />
      ))}
    </div>
  );
}
