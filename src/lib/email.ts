import { Resend } from "resend";
import { siteConfig } from "@/config/site.config";
import { formatPrice } from "@/lib/format";

export const resendConfigured = Boolean(process.env.RESEND_API_KEY);

function getResend() {
  if (!resendConfigured) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

type OrderEmailItem = { name: string; size: string; quantity: number; price: number };

function renderOrderEmailHtml(items: OrderEmailItem[], amountTotalCents: number) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#F5F1E8;font-family:Georgia,serif;font-size:14px;">
            ${item.name}<br/>
            <span style="color:#9a9488;font-size:12px;font-family:Arial,sans-serif;">Taille ${item.size} · Qté ${item.quantity}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#F5F1E8;font-family:Arial,sans-serif;font-size:14px;text-align:right;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  return `
    <div style="background:#000000;padding:40px 20px;">
      <div style="max-width:480px;margin:0 auto;">
        <p style="text-align:center;color:#C9A96E;letter-spacing:4px;font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;">
          ${siteConfig.brand.name}
        </p>
        <h1 style="text-align:center;color:#F5F1E8;font-family:Georgia,serif;font-weight:400;font-size:26px;margin:16px 0;">
          Précommande confirmée
        </h1>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
          Merci pour ta précommande. Livraison estimée sous
          ${siteConfig.drop.estimatedDeliveryWeeks} semaines.
        </p>
        <table style="width:100%;border-collapse:collapse;margin-top:24px;">
          ${rows}
        </table>
        <p style="text-align:right;color:#F5F1E8;font-family:Arial,sans-serif;font-size:16px;margin-top:16px;">
          Total : ${formatPrice(amountTotalCents / 100)}
        </p>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:12px;margin-top:40px;">
          ${siteConfig.brand.fullName} — des questions ? ${siteConfig.brand.contactEmail}
        </p>
      </div>
    </div>`;
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  items: OrderEmailItem[];
  amountTotalCents: number;
}) {
  const resend = getResend();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL || "AM <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: params.to,
    subject: "Ta précommande AM est confirmée",
    html: renderOrderEmailHtml(params.items, params.amountTotalCents),
  });
}
