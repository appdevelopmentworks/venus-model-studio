import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';
import siteJson from '@/data/site.json';

/**
 * Contact受付API。
 * - honeypot と Zod検証、簡易レート制限
 * - 配信: RESEND_API_KEY があればサーバー送信(delivered:true)
 *         未設定なら mode:'mailto' を返し、クライアントが実際にメールソフトを開く
 *   (成功したように見せて送信しない実装はしない)
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

const contactEmail =
  process.env.CONTACT_EMAIL || siteJson.contactEmail || '';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 400 });
  }

  const data = parsed.data;

  // honeypotに値 → botとして受理を装いつつ何もしない
  if (data.company_website) {
    return NextResponse.json({ ok: true, delivered: false, silent: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const deliveryMode = process.env.CONTACT_DELIVERY_MODE || 'mailto';

  if (deliveryMode === 'email' && resendKey && contactEmail) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Venus Model Studio <onboarding@resend.dev>',
          to: [contactEmail],
          reply_to: data.email,
          subject: `[Venus] ${data.type} enquiry from ${data.name}`,
          text: [
            `Type: ${data.type}`,
            `Name: ${data.name}`,
            `Organization: ${data.organization || '-'}`,
            `Email: ${data.email}`,
            '',
            data.message
          ].join('\n')
        })
      });
      if (!res.ok) throw new Error(`resend ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    } catch {
      return NextResponse.json({ ok: false, error: 'delivery' }, { status: 502 });
    }
  }

  // 配信未設定 → クライアントにmailtoを指示
  return NextResponse.json({ ok: true, delivered: false, mode: 'mailto' });
}
