import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const ADMIN_WA    = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? '15072009576';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'elitepartz.orders@gmail.com';
const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elitepartz.com';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OrderItem {
  id:       string;
  name:     string;
  brand:    string;
  price:    number;
  quantity: number;
  images:   string[];
}

export interface OrderPayload {
  orderRef:   string;
  items:      OrderItem[];
  subtotal:   number;
  shipping: {
    firstName:  string;
    lastName:   string;
    email:      string;
    phone:      string;
    whatsapp:   string;
    address:    string;
    city:       string;
    state:      string;
    zip:        string;
    country:    string;
    notes:      string;
  };
  payment:    string;
  grandTotal: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Build the rich HTML email sent to admin */
function buildAdminEmail(o: OrderPayload): string {
  const itemRows = o.items.map((item) => {
    const lineTotal = item.price * item.quantity;
    const imgSrc    = item.images?.[0] ?? '';
    const imgTag    = imgSrc.startsWith('data:')
      ? ''
      : imgSrc
        ? `<img src="${imgSrc}" width="60" height="60" style="object-fit:cover;border-radius:4px;border:1px solid #e5e7eb;" alt="${item.name}" />`
        : '';
    return `
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 8px;vertical-align:middle;">${imgTag}</td>
        <td style="padding:10px 8px;vertical-align:middle;">
          <strong style="color:#111;">${item.name}</strong><br/>
          <span style="color:#6b7280;font-size:12px;">${item.brand}</span><br/>
          <a href="${SITE_URL}/parts/${item.id}" style="color:#dc2626;font-size:12px;">View product</a>
        </td>
        <td style="padding:10px 8px;text-align:center;vertical-align:middle;">${item.quantity}</td>
        <td style="padding:10px 8px;text-align:right;vertical-align:middle;">$${fmt(item.price)}</td>
        <td style="padding:10px 8px;text-align:right;vertical-align:middle;font-weight:bold;">$${fmt(lineTotal)}</td>
      </tr>`;
  }).join('');

  const s = o.shipping;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;color:#111;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

      <!-- Header -->
      <tr style="background:#111;">
        <td style="padding:24px 32px;">
          <span style="font-size:26px;font-weight:900;letter-spacing:-0.5px;">
            <span style="color:#dc2626;">Elite</span><span style="color:#fff;">Partz</span>
          </span>
          <span style="float:right;color:#9ca3af;font-size:13px;line-height:36px;">New Order</span>
        </td>
      </tr>

      <!-- Order ref / date -->
      <tr>
        <td style="padding:20px 32px 0;border-bottom:1px solid #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Order Reference</p>
                <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111;">${o.orderRef}</p>
              </td>
              <td align="right">
                <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Date</p>
                <p style="margin:0 0 16px;font-size:14px;color:#374151;">${new Date().toUTCString()}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Items -->
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;">Order Items</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
            <thead>
              <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb;">
                <th style="padding:8px;text-align:left;color:#6b7280;font-weight:600;" width="60"></th>
                <th style="padding:8px;text-align:left;color:#6b7280;font-weight:600;">Part</th>
                <th style="padding:8px;text-align:center;color:#6b7280;font-weight:600;">Qty</th>
                <th style="padding:8px;text-align:right;color:#6b7280;font-weight:600;">Unit</th>
                <th style="padding:8px;text-align:right;color:#6b7280;font-weight:600;">Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
        </td>
      </tr>

      <!-- Totals -->
      <tr>
        <td style="padding:16px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <tr>
              <td style="padding:4px 0;color:#6b7280;">Subtotal</td>
              <td style="padding:4px 0;text-align:right;">$${fmt(o.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;">Shipping</td>
              <td style="padding:4px 0;text-align:right;color:#059669;">Included / TBD</td>
            </tr>
            <tr style="border-top:2px solid #111;">
              <td style="padding:10px 0 4px;font-weight:700;font-size:16px;">Grand Total</td>
              <td style="padding:10px 0 4px;text-align:right;font-weight:700;font-size:16px;color:#dc2626;">$${fmt(o.grandTotal)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Payment method -->
      <tr>
        <td style="padding:0 32px 20px;">
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px 16px;">
            <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Payment Method</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#dc2626;">${o.payment}</p>
          </div>
        </td>
      </tr>

      <!-- Shipping info -->
      <tr>
        <td style="padding:0 32px 20px;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;">Shipping Details</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
            ${[
              ['Full Name',    `${s.firstName} ${s.lastName}`],
              ['Email',        s.email],
              ['Phone',        s.phone],
              ['WhatsApp',     s.whatsapp],
              ['Address',      s.address],
              ['City',         s.city],
              ['State/Region', s.state],
              ['ZIP/Post',     s.zip],
              ['Country',      s.country],
              ['Notes',        s.notes || '—'],
            ].map(([label, val], i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
                <td style="padding:8px 12px;color:#6b7280;font-weight:600;width:130px;">${label}</td>
                <td style="padding:8px 12px;color:#111;">${val}</td>
              </tr>`).join('')}
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr style="background:#111;">
        <td style="padding:16px 32px;text-align:center;color:#6b7280;font-size:12px;">
          ElitePartz — elitepartz.orders@gmail.com — <a href="${SITE_URL}" style="color:#dc2626;">${SITE_URL.replace('https://', '')}</a>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Build the plain-text confirmation email sent to the customer */
function buildCustomerEmail(o: OrderPayload): string {
  const s = o.shipping;
  const lines = o.items.map(
    (it) => `  • ${it.name} (${it.brand}) x${it.quantity} — $${fmt(it.price * it.quantity)}`
  ).join('\n');

  return `Hi ${s.firstName},

Thank you for your order at ElitePartz! We have received your request and will be in touch shortly to confirm payment and shipping.

ORDER REFERENCE: ${o.orderRef}
DATE: ${new Date().toUTCString()}

─────────────────────────────────────────
ORDER SUMMARY
─────────────────────────────────────────
${lines}

GRAND TOTAL: $${fmt(o.grandTotal)}
PAYMENT METHOD: ${o.payment}

─────────────────────────────────────────
SHIPPING TO
─────────────────────────────────────────
${s.firstName} ${s.lastName}
${s.address}, ${s.city}, ${s.state} ${s.zip}
${s.country}
Phone: ${s.phone}
WhatsApp: ${s.whatsapp}

─────────────────────────────────────────

We will contact you on WhatsApp or email to coordinate payment and confirm dispatch.

For any questions, reply to this email or WhatsApp us at +${ADMIN_WA}.

Thank you for shopping with ElitePartz.
${SITE_URL}
`;
}

/** Build the pre-filled WhatsApp message body */
function buildWhatsAppMessage(o: OrderPayload): string {
  const s = o.shipping;
  const lines = o.items.map(
    (it) => `  • ${it.name} (${it.brand}) x${it.quantity} — $${fmt(it.price * it.quantity)}`
  ).join('\n');

  return `*ElitePartz — New Order*\n` +
    `Order Ref: *${o.orderRef}*\n` +
    `Date: ${new Date().toDateString()}\n\n` +
    `*ORDER ITEMS*\n${lines}\n\n` +
    `*Grand Total: $${fmt(o.grandTotal)}*\n` +
    `Payment Method: ${o.payment}\n\n` +
    `*SHIPPING TO*\n` +
    `${s.firstName} ${s.lastName}\n` +
    `${s.address}, ${s.city}, ${s.state} ${s.zip}\n` +
    `${s.country}\n` +
    `Phone: ${s.phone}\n` +
    `WhatsApp: ${s.whatsapp}\n\n` +
    `Please confirm payment details at your earliest convenience. Thank you!`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let payload: OrderPayload;
  try {
    payload = await req.json() as OrderPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // ── Send emails via Gmail (OAuth2 app-password) ───────────────────────────
  const gmailUser = process.env.GMAIL_USER ?? 'elitepartz.orders@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD ?? '';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,  // Gmail App Password (not your account password)
    },
  });

  try {
    // 1. Email to admin
    await transporter.sendMail({
      from:    `"ElitePartz Orders" <${gmailUser}>`,
      to:      ADMIN_EMAIL,
      subject: `[ElitePartz] New Order ${payload.orderRef} — $${fmt(payload.grandTotal)} — ${payload.shipping.firstName} ${payload.shipping.lastName}`,
      html:    buildAdminEmail(payload),
    });

    // 2. Confirmation email to customer
    if (payload.shipping.email) {
      await transporter.sendMail({
        from:    `"ElitePartz" <${gmailUser}>`,
        to:      payload.shipping.email,
        subject: `Your ElitePartz order ${payload.orderRef} — received`,
        text:    buildCustomerEmail(payload),
      });
    }
  } catch (emailErr) {
    console.error('[ElitePartz] Gmail send error:', emailErr);
    // Don't fail the whole request — WhatsApp URL still returned
  }

  // ── Build WhatsApp deep-link ──────────────────────────────────────────────
  const waMessage = buildWhatsAppMessage(payload);
  const waUrl     = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`;

  return NextResponse.json({ success: true, whatsappUrl: waUrl, orderRef: payload.orderRef });
}
