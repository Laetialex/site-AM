import { Resend } from "resend";
import { siteConfig } from "@/config/site.config";
import { formatPrice } from "@/lib/format";

export const resendConfigured = Boolean(process.env.RESEND_API_KEY);

export function getResend() {
  if (!resendConfigured) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export type OrderEmailItem = {
  slug: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
};

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
          ${siteConfig.drop.estimatedDeliveryText}.
        </p>
        <table style="width:100%;border-collapse:collapse;margin-top:24px;">
          ${rows}
        </table>
        <p style="text-align:right;color:#F5F1E8;font-family:Arial,sans-serif;font-size:16px;margin-top:16px;">
          Total : ${formatPrice(amountTotalCents / 100)}
        </p>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:12px;margin-top:40px;">
          ${siteConfig.brand.name} — des questions ? ${siteConfig.brand.contactEmail}
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

function renderOrderStatusEmailHtml(params: {
  title: string;
  message: string;
  items: OrderEmailItem[];
}) {
  const itemLines = params.items
    .map((item) => `${item.name} — Taille ${item.size} · Qté ${item.quantity}`)
    .join("<br/>");

  return `
    <div style="background:#000000;padding:40px 20px;">
      <div style="max-width:480px;margin:0 auto;">
        <p style="text-align:center;color:#C9A96E;letter-spacing:4px;font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;">
          ${siteConfig.brand.name}
        </p>
        <h1 style="text-align:center;color:#F5F1E8;font-family:Georgia,serif;font-weight:400;font-size:26px;margin:16px 0;">
          ${params.title}
        </h1>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
          ${params.message}
        </p>
        <p style="text-align:center;color:#F5F1E8;font-family:Georgia,serif;font-size:13px;line-height:1.8;margin-top:24px;">
          ${itemLines}
        </p>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:12px;margin-top:40px;">
          ${siteConfig.brand.name} — des questions ? ${siteConfig.brand.contactEmail}
        </p>
      </div>
    </div>`;
}

export async function sendOrderPreparingEmail(params: { to: string; items: OrderEmailItem[] }) {
  const resend = getResend();
  if (!resend) return;
  const from = process.env.RESEND_FROM_EMAIL || "AM <onboarding@resend.dev>";
  await resend.emails.send({
    from,
    to: params.to,
    subject: "Ta commande AM est en préparation",
    html: renderOrderStatusEmailHtml({
      title: "En préparation",
      message: "Ta commande est en cours de préparation. On te prévient dès qu'elle part.",
      items: params.items,
    }),
  });
}

export async function sendOrderShippedEmail(params: { to: string; items: OrderEmailItem[] }) {
  const resend = getResend();
  if (!resend) return;
  const from = process.env.RESEND_FROM_EMAIL || "AM <onboarding@resend.dev>";
  await resend.emails.send({
    from,
    to: params.to,
    subject: "Ta commande AM a été expédiée",
    html: renderOrderStatusEmailHtml({
      title: "Expédiée",
      message: "Ta commande vient de partir. Elle devrait arriver sous peu.",
      items: params.items,
    }),
  });
}

export async function sendOrderDeliveredEmail(params: {
  to: string;
  items: OrderEmailItem[];
  origin: string;
}) {
  const resend = getResend();
  if (!resend) return;
  const from = process.env.RESEND_FROM_EMAIL || "AM <onboarding@resend.dev>";

  const reviewLinks = params.items
    .map(
      (item) =>
        `<a href="${params.origin}/produits/${item.slug}" style="color:#C9A96E;">${item.name}</a>`,
    )
    .join("<br/>");

  const html = `
    <div style="background:#000000;padding:40px 20px;">
      <div style="max-width:480px;margin:0 auto;">
        <p style="text-align:center;color:#C9A96E;letter-spacing:4px;font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;">
          ${siteConfig.brand.name}
        </p>
        <h1 style="text-align:center;color:#F5F1E8;font-family:Georgia,serif;font-weight:400;font-size:26px;margin:16px 0;">
          Livrée
        </h1>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
          Ta commande a été livrée. Si ce n'est pas le cas, écris-nous à
          ${siteConfig.brand.contactEmail}.
        </p>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;margin-top:16px;">
          Dis-nous ce que tu en penses — laisse un avis (connexion requise) :
        </p>
        <p style="text-align:center;font-family:Georgia,serif;font-size:14px;line-height:1.8;margin-top:12px;">
          ${reviewLinks}
        </p>
        <p style="text-align:center;color:#9a9488;font-family:Arial,sans-serif;font-size:12px;margin-top:40px;">
          ${siteConfig.brand.name} — des questions ? ${siteConfig.brand.contactEmail}
        </p>
      </div>
    </div>`;

  await resend.emails.send({
    from,
    to: params.to,
    subject: "Ta commande AM est arrivée — donne-nous ton avis",
    html,
  });
}

export function renderOfferEmailHtml(params: {
  body: string;
  unsubscribeUrl: string;
}) {
  const paragraphs = params.body
    .split(/\n+/)
    .filter(Boolean)
    .map(
      (line) =>
        `<p style="color:#F5F1E8;font-family:Georgia,serif;font-size:15px;line-height:1.7;margin:0 0 16px;">${escapeHtml(line)}</p>`,
    )
    .join("");

  return `
    <div style="background:#000000;padding:40px 20px;">
      <div style="max-width:480px;margin:0 auto;">
        <p style="text-align:center;color:#C9A96E;letter-spacing:4px;font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;">
          ${siteConfig.brand.name}
        </p>
        <div style="margin-top:24px;">
          ${paragraphs}
        </div>
        <p style="text-align:center;color:#6b6558;font-family:Arial,sans-serif;font-size:11px;margin-top:40px;">
          Tu reçois cet email parce que tu as commandé chez ${siteConfig.brand.name}.
          <br/>
          <a href="${params.unsubscribeUrl}" style="color:#6b6558;">Se désinscrire</a>
        </p>
      </div>
    </div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactEmail(params: {
  name: string;
  email: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.RESEND_FROM_EMAIL || "AM <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: siteConfig.brand.contactEmail,
    replyTo: params.email,
    subject: `Message du site — ${params.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
        <p><strong>De :</strong> ${escapeHtml(params.name)} (${escapeHtml(params.email)})</p>
        <p style="white-space:pre-wrap;">${escapeHtml(params.message)}</p>
      </div>`,
  });

  return true;
}
