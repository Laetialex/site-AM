"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ReviewActionState = { error?: string };

export async function submitReview(
  productSlug: string,
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Les avis ne sont pas encore activés sur ce site." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/compte?next=/produits/${productSlug}`);
  }

  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Choisis une note entre 1 et 5 étoiles." };
  }

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    product_slug: productSlug,
    rating,
    comment: comment || null,
  });

  if (error) {
    return { error: "Tu as déjà laissé un avis pour ce produit." };
  }

  revalidatePath(`/produits/${productSlug}`);
  return {};
}
