import nodemailer from "nodemailer";

const FROM = process.env.EMAIL_FROM || (process.env.RESEND_API_KEY ? "onboarding@resend.dev" : "ELARA Maison <atelier@elara.maison>");

export async function sendEmail({ to, subject, html, text }) {
  // 1. Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM, to, subject, html, text }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      return { ok: true, provider: "resend" };
    } catch (err) {
      console.error("[email] Resend failed:", err);
    }
  }

  // 2. SMTP / Gmail
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transport.sendMail({ from: FROM, to, subject, html, text });
      return { ok: true, provider: "smtp" };
    } catch (err) {
      console.error("[email] SMTP failed:", err);
    }
  }

  // 3. Demo Mode (Console log)
  console.log(
    `\n[email · demo mode] → ${to}\n  subject: ${subject}\n  (add RESEND_API_KEY or GMAIL_USER + GMAIL_APP_PASSWORD to send for real)\n`
  );
  return { ok: true, provider: "demo" };
}

const shell = (inner) => `
<div style="margin:0;padding:0;background:#1a0f0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#f4f1ec;border:14px solid #1a0f0a;">
    <div style="padding:40px 40px 0;text-align:center;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:42px;color:#141210;letter-spacing:-1px;">elara</div>
      <div style="height:1px;background:repeating-linear-gradient(to right,#141210 0 1px,transparent 1px 8px);margin:18px 0;opacity:.4;"></div>
    </div>
    <div style="padding:8px 40px 40px;color:#141210;">${inner}</div>
    <div style="background:#141210;color:#8a857c;padding:22px 40px;font-size:10px;letter-spacing:2px;text-transform:uppercase;text-align:center;">
      Paris &middot; Mumbai &middot; Tokyo &nbsp;✱&nbsp; &copy; 2026 Elara Maison
    </div>
  </div>
</div>`;

export function welcomeEmail(name) {
  const first = name?.split(" ")[0] || "there";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    subject: "Welcome to ELARA — carry the extraordinary",
    html: shell(`
      <h1 style="font-family:Arial,sans-serif;font-weight:800;text-transform:uppercase;font-size:34px;line-height:1.05;margin:10px 0 6px;letter-spacing:-1px;">
        Welcome to<br/>the Maison, ${first}.
      </h1>
      <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:#5b554c;margin:6px 0 22px;">
        Your account is open. The atelier is yours to explore.
      </p>
      <p style="font-size:14px;line-height:1.7;color:#3a352e;">
        Every ELARA piece is hand-finished in small ateliers from vegetable-tanned
        leather, and carries a lifetime repair promise. As a member you'll be first
        to see new drops, private events, and atelier exclusives.
      </p>
      <p style="margin:28px 0;">
        <a href="${siteUrl}/collection"
           style="display:inline-block;background:#141210;color:#f4f1ec;text-decoration:none;padding:15px 30px;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-radius:999px;">
          Explore the Collection →
        </a>
      </p>
      <p style="font-size:11px;color:#8a857c;letter-spacing:1px;text-transform:uppercase;">
        Use code ELARA_2026 for 10% off your first order.
      </p>
    `),
    text: `Welcome to ELARA, ${first}. Your account is open. Explore the collection at ${siteUrl}/collection — use code ELARA_2026 for 10% off.`,
  };
}

export function formatPrice(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function orderEmail(opts) {
  const rows = opts.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e0d9cd;font-size:13px;">${l.name} <span style="color:#8a857c;">× ${l.qty}</span></td><td style="padding:8px 0;border-bottom:1px solid #e0d9cd;text-align:right;font-size:13px;">${l.price}</td></tr>`
    )
    .join("");
  return {
    subject: `Order confirmed — ${opts.orderId}`,
    html: shell(`
      <h1 style="font-family:Arial,sans-serif;font-weight:800;text-transform:uppercase;font-size:32px;line-height:1.05;margin:10px 0 6px;">Order Confirmed</h1>
      <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:#5b554c;margin:6px 0 22px;">
        Thank you, ${opts.name?.split(" ")[0] || "friend"} — your pieces are being wrapped in the atelier.
      </p>
      <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a857c;">Order ${opts.orderId}</p>
      <table style="width:100%;border-collapse:collapse;margin:14px 0;">${rows}
        <tr><td style="padding:14px 0 0;font-weight:800;text-transform:uppercase;font-size:13px;">Total</td><td style="padding:14px 0 0;text-align:right;font-weight:800;font-size:13px;">${opts.total}</td></tr>
      </table>
    `),
    text: `Order ${opts.orderId} confirmed. Total ${opts.total}.`,
  };
}
