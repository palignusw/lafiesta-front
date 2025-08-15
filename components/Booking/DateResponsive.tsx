'use client'

import { useEffect, useState } from 'react'
import s from './DateResponsive.module.scss'
import DateFancy from '@/app/api/booking/DateFancy'

type Props = {
	name?: string
	label?: string // например: 'თარიღი'
	locale?: string // 'ka' | 'ru' | 'en'
	min?: string // YYYY-MM-DD
	max?: string // YYYY-MM-DD
	error?: string
	note?: string // подсказка (покажем только на мобиле)
	defaultValue?: string
	onChange?: (value: string) => void
}

function NativeDate({
	name = 'date',
	locale = 'ka',
	min,
	max,
	error,
	defaultValue,
}: Props) {
	return (
		<div className={s.nativeBlock}>
			<input
				type='date'
				name={name}
				lang={locale}
				min={min}
				max={max}
				defaultValue={defaultValue}
				className={`${s.nativeInput} ${error ? s.inputError : ''}`}
			/>
			{error && <div className={s.errorText}>{error}</div>}
		</div>
	)
}

export default function DateResponsive(props: Props) {
	const [isMobile, setIsMobile] = useState<boolean | null>(null)

	useEffect(() => {
		const mq = window.matchMedia('(max-width: 640px)')
		const onChange = () => setIsMobile(mq.matches)
		onChange() // начальное значение
		mq.addEventListener?.('change', onChange)
		mq.addListener && mq.addListener(onChange) // старые браузеры
		return () => {
			mq.removeEventListener?.('change', onChange)
			mq.removeListener && mq.removeListener(onChange)
		}
	}, [])

	// при первом рендере (SSR) безопасно показать нативный
	if (isMobile === null) return <NativeDate {...props} />

	// на мобиле — красивый DateFancy (note показываем именно тут)
	return isMobile ? <DateFancy {...props} /> : <NativeDate {...props} />
}
