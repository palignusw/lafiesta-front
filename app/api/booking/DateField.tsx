'use client'

import { useEffect, useRef } from 'react'
import s from './BookingForm.module.scss' // будем юзать те же токены/кнопки

type Props = {
	name: string // имя поля (в форму уйдёт YYYY-MM-DD)
	placeholder?: string
	defaultValue?: string // формата 'YYYY-MM-DD'
	minDate?: Date
	error?: string | false
}

export default function DateField({
	name,
	placeholder = 'თარიღი',
	defaultValue,
	minDate = new Date(),
	error,
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null)
	const hiddenRef = useRef<HTMLInputElement>(null)
	const fpRef = useRef<any>(null)

	useEffect(() => {
		let mounted = true

		;(async () => {
			const fpMod = await import('flatpickr')
			const { Georgian } = await import('flatpickr/dist/l10n/ka.js')

			if (!mounted || !inputRef.current) return

			fpMod.default.localize(Georgian)

			fpRef.current = fpMod.default(inputRef.current, {
				disableMobile: true,
				dateFormat: 'Y-m-d', // значение для hidden (на сервер)
				altInput: true, // красивый видимый input
				altFormat: 'd.m.Y', // формат для пользователя
				altInputClass: s.dateAlt, // класс на alt-input из CSS-модуля
				defaultDate: defaultValue,
				minDate,
				clickOpens: true,
				allowInput: false,
				onChange: (dates: Date[]) => {
					if (hiddenRef.current) {
						const d = dates[0]
						if (d) {
							const yyyy = d.getFullYear()
							const mm = String(d.getMonth() + 1).padStart(2, '0')
							const dd = String(d.getDate()).padStart(2, '0')
							hiddenRef.current.value = `${yyyy}-${mm}-${dd}`
						} else {
							hiddenRef.current.value = ''
						}
					}
				},
			})
		})()

		return () => {
			mounted = false
			if (fpRef.current) {
				fpRef.current.destroy()
				fpRef.current = null
			}
		}
	}, [])

	return (
		<div className={s.field}>
			{/* «настоящий» инпут, на который навешиваем flatpickr */}
			<input ref={inputRef} type='text' placeholder={placeholder} />
			{/* скрытый инпут, который реально уходит в FormData */}
			<input
				ref={hiddenRef}
				type='hidden'
				name={name}
				defaultValue={defaultValue}
			/>
			{error ? <div className={s.errorText}>{error}</div> : null}
		</div>
	)
}
