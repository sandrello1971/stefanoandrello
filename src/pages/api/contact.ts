import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const tipoLabels: Record<string, string> = {
  primus: 'Formazione PRIMUS',
  consilium: 'Formazione CONSILIUM',
  initium: 'Formazione INITIUM',
  consulenza: 'Consulenza AI agentica/MCP',
  altro: 'Altro',
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, number[]>();

function rateLimitCheck(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const existing = (rateLimitMap.get(ip) ?? []).filter((t) => t > cutoff);
  if (existing.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, existing);
    return false;
  }
  existing.push(now);
  rateLimitMap.set(ip, existing);
  return true;
}

function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ error: 'Content-Type deve essere application/json' }, 415);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Payload JSON non valido' }, 400);
  }

  // Honeypot: if the hidden "website" field is filled, it's a bot.
  // Respond 200 without sending to avoid giving feedback.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json({ success: true });
  }

  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const problema = typeof body.problema === 'string' ? body.problema.trim() : '';
  const tipoRichiesta = typeof body.tipoRichiesta === 'string' ? body.tipoRichiesta.trim() : '';
  const messaggio = typeof body.messaggio === 'string' ? body.messaggio.trim() : '';

  if (!nome) return json({ error: 'Il nome è obbligatorio.' }, 400);
  if (!email || !isValidEmail(email)) return json({ error: 'Email non valida.' }, 400);
  if (!tipoRichiesta || !tipoLabels[tipoRichiesta]) {
    return json({ error: 'Tipo di richiesta non valido.' }, 400);
  }
  if (!messaggio) return json({ error: 'Il messaggio è obbligatorio.' }, 400);

  let ip = 'unknown';
  try {
    ip = clientAddress;
  } catch {
    const fwd = request.headers.get('x-forwarded-for');
    if (fwd) ip = fwd.split(',')[0].trim();
  }

  if (!rateLimitCheck(ip)) {
    return json(
      { error: 'Troppi invii in poco tempo. Riprova fra qualche minuto.' },
      429
    );
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL;
  const fromEmail = import.meta.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return json({ error: 'Configurazione email non disponibile.' }, 500);
  }

  const resend = new Resend(apiKey);
  const tipoLabel = tipoLabels[tipoRichiesta];

  const notificationHtml = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1F1F1F; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #F5F0E6;">
  <h1 style="color: #0B1F3A; font-size: 20px; margin: 0 0 24px;">Nuova richiesta dal sito</h1>
  <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
    <tr><td style="color: #6B6358; padding: 8px 0; width: 35%; vertical-align: top;">Nome</td><td style="padding: 8px 0;">${escapeHtml(nome)}</td></tr>
    <tr><td style="color: #6B6358; padding: 8px 0; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #0B1F3A;">${escapeHtml(email)}</a></td></tr>
    <tr><td style="color: #6B6358; padding: 8px 0; vertical-align: top;">Tipo richiesta</td><td style="padding: 8px 0;">${escapeHtml(tipoLabel)}</td></tr>
    <tr><td style="color: #6B6358; padding: 8px 0; vertical-align: top;">IP</td><td style="padding: 8px 0; color: #6B6358; font-size: 13px;">${escapeHtml(ip)}</td></tr>
  </table>
  ${
    problema
      ? `<h2 style="color: #0B1F3A; font-size: 15px; margin: 32px 0 8px;">Problema principale con l'AI in azienda</h2>
         <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${escapeHtml(problema)}</p>`
      : ''
  }
  <h2 style="color: #0B1F3A; font-size: 15px; margin: 32px 0 8px;">Messaggio</h2>
  <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${escapeHtml(messaggio)}</p>
</body>
</html>`;

  const confirmationHtml = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1F1F1F; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #F5F0E6; line-height: 1.6;">
  <p>Ciao ${escapeHtml(nome)},</p>
  <p>ho ricevuto la tua richiesta. Rispondo entro 24 ore lavorative.</p>
  <p style="margin-top: 32px;">&mdash; Stefano</p>
</body>
</html>`;

  try {
    const notify = await resend.emails.send({
      from: `Sito Stefano Andrello <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `[${tipoLabel}] ${nome}`,
      html: notificationHtml,
    });
    if (notify.error) {
      return json({ error: 'Invio non riuscito. Riprova fra poco.' }, 502);
    }

    await resend.emails.send({
      from: `Stefano Andrello <${fromEmail}>`,
      to: [email],
      subject: 'Ho ricevuto la tua richiesta',
      html: confirmationHtml,
    });

    return json({ success: true });
  } catch {
    return json({ error: 'Invio non riuscito. Riprova fra poco.' }, 502);
  }
};
