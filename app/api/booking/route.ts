/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs' // нужен Node для fetch с секретами

const BookingSchema = z.object({
	name: z.string().min(2).max(120),
	phone: z.string().min(5).max(40),
	date: z.string().optional(), // 'YYYY-MM-DD'
	guests: z.number().int().min(1).max(1000).optional(),
	message: z.string().max(1000).optional(),
	locale: z.string().optional(),
	// honeypot
	company: z.string().max(0).optional(),
})

function line(label: string, val?: string | number) {
	return val ? `<b>${label}:</b> ${val}<br/>` : ''
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const parsed = BookingSchema.safeParse({
			...body,
			guests:
				typeof body.guests === 'string'
					? parseInt(body.guests, 10)
					: body.guests,
		})

		if (!parsed.success) {
			return NextResponse.json(
				{ ok: false, error: 'VALIDATION', issues: parsed.error.issues },
				{ status: 400 }
			)
		}

		const data = parsed.data

		// honeypot: если заполнили скрытое поле — делаем вид, что всё ок
		if (data.company && data.company.length > 0) {
			return NextResponse.json({ ok: true })
		}

		// готовим текст
		const subject = `Ახალი ჯავშანი — ${data.date ?? 'თარიღი არაა მითითებული'}`
		const html = [
			`<b>La Fiesta — ახალი ჯავშანი</b><br/>`,
			line('სახელი', data.name),
			line('ტელეფონი', data.phone),
			line('თარიღი', data.date),
			line('სტუმრები', data.guests ?? ''),
			line('ენა', data.locale),
			data.message
				? `<b>შეტყობინება:</b><br/>${data.message.replace(/\n/g, '<br/>')}`
				: '',
		].join('')

		// 1) Telegram
		const botToken = process.env.TELEGRAM_BOT_TOKEN
		const chatId = process.env.TELEGRAM_CHAT_ID
		if (botToken && chatId) {
			const tg = await fetch(
				`https://api.telegram.org/bot${botToken}/sendMessage`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chat_id: chatId,
						parse_mode: 'HTML',
						text: html.replace(/<br\/>/g, '\n').replace(/<[^>]+>/g, ''), // в Телеграм можно и HTML, но plain надёжнее
						disable_web_page_preview: true,
					}),
				}
			)
			if (!tg.ok) console.error('Telegram error', await tg.text())
		} else {
			console.warn('Telegram env not set, skipping.')
		}

		// 2) Email (опционально, через Resend)
		const resendKey = process.env.RESEND_API_KEY
		const toEmail = process.env.BOOKINGS_EMAIL_TO // куда слать
		const fromEmail = process.env.BOOKINGS_EMAIL_FROM || 'bookings@example.com'
		if (resendKey && toEmail) {
			// динамический импорт, чтобы модуль не тянулся если не нужен
			const { Resend } = await import('resend')
			const resend = new Resend(resendKey)
			const res = await resend.emails.send({
				from: `La Fiesta <${fromEmail}>`,
				to: [toEmail],
				subject,
				html,
			})
			if (res.error) console.error('Resend error', res.error)
		}

		return NextResponse.json({ ok: true })
	} catch (e: any) {
		console.error(e)
		return NextResponse.json(
			{ ok: false, error: 'SERVER_ERROR' },
			{ status: 500 }
		)
	}
}
