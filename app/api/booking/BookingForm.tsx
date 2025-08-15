/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import s from './BookingForm.module.scss'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import DateResponsive from '@/components/Booking/DateResponsive'

type FormPayload = {
	name: string
	phone: string
	date?: string
	guests?: number
	message?: string
	company?: string // honeypot
}

type Errors = Partial<Record<keyof FormPayload, string>>

/* ——— Helpers ——— */

// грузинский телефон (мобильные и городские)
// допускаем: 5XXXXXXXX (9 цифр), 05XXXXXXXX, +9955XXXXXXXX,
// а также городские: 32XXXXXXX / 0XXXXXXXXX / +99532XXXXXXX / +995XXXXXXXXX
const isValidGEPhone = (raw: string) => {
	const v = (raw || '').replace(/\s|-/g, '')
	const mobileLocal = /^0?5\d{8}$/ // 5XXXXXXXX или 05XXXXXXXX
	const mobileIntl = /^\+?9955\d{8}$/ // +9955XXXXXXXX
	const cityLocal = /^0?(?:32|\d{2})\d{7}$/ // 32XXXXXXX или 0XXXXXXXXX
	const cityIntl = /^\+?995(?:32|\d{2})\d{7}$/ // +99532XXXXXXX
	return (
		mobileLocal.test(v) ||
		mobileIntl.test(v) ||
		cityLocal.test(v) ||
		cityIntl.test(v)
	)
}

const isFutureDate = (d?: string) => {
	if (!d) return false
	const dt = new Date(d + 'T00:00:00')
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return dt.getTime() >= today.getTime()
}

// клиентская схема валидации
const ClientSchema = z.object({
	name: z.string().min(2, 'შეიყვანეთ სრული სახელი'),
	phone: z
		.string()
		.refine(isValidGEPhone, 'ნომერი დაწერეთ სწორი ფორმატით მაგ:599435644'),
	date: z
		.string()
		.min(1, 'აირჩიეთ თარიღი')
		.refine(isFutureDate, 'აირჩიეთ მომავალი თარიღი'),
	guests: z.coerce
		.number()
		.int('მხოლოდ მთელი რიცხვი')
		.min(1, 'სტუმრების მინ. 1')
		.max(1200, 'ძალიან ბევრი სტუმარი'),
	message: z.string().max(1000, 'მაქსიმუმ 1000 სიმბოლო').optional(),
	company: z.string().max(0).optional(),
})

export default function BookingForm({ locale = 'ka' }: { locale?: string }) {
	const t = useTranslations('Contacts.form')
	const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
	const [errMsg, setErrMsg] = useState('')
	const [errors, setErrors] = useState<Errors>({})

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setErrMsg('')
		setErrors({})
		setState('sending')

		const form = e.currentTarget // кэшируем до await
		const fd = new FormData(form)
		const payload: any = Object.fromEntries(fd.entries())

		// приведение типов
		payload.guests = payload.guests ? Number(payload.guests) : undefined
		payload.locale = locale

		// клиентская валидация Zod
		const parsed = ClientSchema.safeParse(payload)
		if (!parsed.success) {
			const map: Errors = {}
			parsed.error.issues.forEach(i => {
				const key = i.path[0] as keyof FormPayload
				if (!map[key]) map[key] = i.message
			})
			setErrors(map)
			setState('idle')
			// фокус на первое поле с ошибкой
			const firstKey = Object.keys(map)[0]
			if (firstKey) {
				const field = form.querySelector(
					`[name="${firstKey}"]`
				) as HTMLElement | null
				field?.focus()
			}
			return
		}

		try {
			const res = await fetch('/api/booking', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parsed.data),
			})
			const data = await res.json()
			if (!res.ok || !data.ok) {
				setState('err')
				setErrMsg(data?.error ?? 'Server error')
			} else {
				setState('ok')
				form.reset()
				setTimeout(() => setState('idle'), 10000) // авто-скрыть баннер
			}
		} catch (err: any) {
			setState('err')
			setErrMsg(err?.message ?? 'Network error')
		}
	}

	console.log(locale)

	return (
		<form className={s.form} onSubmit={onSubmit} noValidate>
			{/* honeypot */}
			<input
				type='text'
				name='company'
				className={s.honey}
				tabIndex={-1}
				autoComplete='off'
			/>

			{/* Успешная отправка */}
			{state === 'ok' && (
				<div className={`${s.alert} ${s.success}`}>
					<span className={s.icon}>✓</span>
					{t('ok')}
				</div>
			)}

			{/* Ошибка верхнего уровня */}
			{state === 'err' && (
				<div className={`${s.alert} ${s.danger}`}>
					<span className={s.icon}>!</span>
					შეცდომა: {errMsg}
				</div>
			)}

			<div className={s.field}>
				<input
					name='name'
					placeholder={t('name')}
					aria-invalid={!!errors.name}
					className={errors.name ? s.inputError : ''}
				/>
				{errors.name && <div className={s.errorText}>{errors.name}</div>}
			</div>

			<div className={s.row2}>
				<div className={s.field}>
					<input
						type='tel'
						name='phone'
						placeholder={t('phone')}
						aria-invalid={!!errors.phone}
						className={errors.phone ? s.inputError : ''}
					/>
					{errors.phone && <div className={s.errorText}>{errors.phone}</div>}
				</div>

				<DateResponsive
					name='date'
					label={t('date')} // 'თარიღი'
					locale={locale}
					error={errors.date}
					note={t('workHours')} // например: 'სამუშაო საათები: 11:00–23:00' (покажется только на телефоне)
				/>
			</div>

			<div className={s.field}>
				<input
					type='number'
					name='guests'
					min={1}
					placeholder={t('guests')}
					aria-invalid={!!errors.guests}
					className={errors.guests ? s.inputError : ''}
				/>
				{errors.guests && <div className={s.errorText}>{errors.guests}</div>}
			</div>

			<div className={s.field}>
				<textarea
					name='message'
					placeholder={t('message')}
					rows={5}
					aria-invalid={!!errors.message}
					className={errors.message ? s.inputError : ''}
				/>
				{errors.message && <div className={s.errorText}>{errors.message}</div>}
			</div>

			<button
				className={`btn ${s.btnShine} ${s.submit}`}
				disabled={state === 'sending'}
			>
				{state === 'sending' ? '...' : t('send')}
			</button>
		</form>
	)
}
