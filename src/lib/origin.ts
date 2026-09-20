import { headers } from "next/headers";

/** NEXT_PUBLIC_SITE_URL est fiable en production ; en local/preview on
 * retombe sur l'en-tête Host de la requête. */
export async function getOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${h.get("host")}`;
}
