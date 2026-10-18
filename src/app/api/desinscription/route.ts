import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, supabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id && supabaseAdminConfigured) {
    const admin = createAdminClient()!;
    await admin.from("newsletter_subscribers").delete().eq("id", id);
  }

  return new NextResponse(
    `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><title>Désinscription</title></head>
<body style="background:#000;color:#F5F1E8;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:24px;">
  <p>Tu as bien été désinscrit·e des emails AM.</p>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
