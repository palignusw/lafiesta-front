'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { MediaItem } from '@/lib/gallery'
import s from './LightBox.module.scss'

export default function Lightbox({
	items,
	start = 0,
	onClose,
}: {
	items: MediaItem[]
	start?: number
	onClose: () => void
}) {
	// фильтруем сразу, но без раннего return
	const safeItems = useMemo(() => items.filter(i => !!i.src), [items])

	const clamp = (n: number) =>
		Math.max(0, Math.min(n, Math.max(safeItems.length - 1, 0)))
	const [i, setI] = useState(() => clamp(start))

	// если длина изменилась (сменили альбом) — корректируем индекс
	useEffect(() => {
		setI(prev => clamp(prev))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [safeItems.length])

	const prev = useCallback(
		() =>
			setI(
				v =>
					(v - 1 + Math.max(safeItems.length, 1)) %
					Math.max(safeItems.length, 1)
			),
		[safeItems.length]
	)
	const next = useCallback(
		() => setI(v => (v + 1) % Math.max(safeItems.length, 1)),
		[safeItems.length]
	)

	const cur = safeItems[i]

	// клавиатура + запрет скролла
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
			if (e.key === 'ArrowLeft') {
				e.preventDefault()
				prev()
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault()
				next()
			}
		}
		const original = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		window.addEventListener('keydown', onKey)
		return () => {
			window.removeEventListener('keydown', onKey)
			document.body.style.overflow = original
		}
	}, [onClose, prev, next])

	// свайп на мобилке
	const touchX = useRef<number | null>(null)
	const onTouchStart = (e: React.TouchEvent) => {
		touchX.current = e.touches[0].clientX
	}
	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchX.current == null) return
		const dx = e.changedTouches[0].clientX - touchX.current
		if (Math.abs(dx) > 40) (dx > 0 ? prev : next)()
		touchX.current = null
	}

	// РЕНДЕР-ГУАРДЫ — только теперь (после хуков)
	if (safeItems.length === 0 || !cur?.src) return null

	return (
		<div
			className={s.backdrop}
			onClick={onClose}
			role='dialog'
			aria-modal='true'
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
		>
			<div className={s.inner} onClick={e => e.stopPropagation()}>
				<button className={s.close} onClick={onClose} aria-label='Close'>
					×
				</button>

				<div className={s.stage}>
					<button
						className={`${s.nav} ${s.left}`}
						onClick={prev}
						aria-label='Prev'
					>
						‹
					</button>
					<button
						className={`${s.nav} ${s.right}`}
						onClick={next}
						aria-label='Next'
					>
						›
					</button>

					<Image
						src={cur.src}
						alt={cur.alt ?? ''}
						width={cur.w || 1600}
						height={cur.h || 1067}
						sizes='100vw'
						priority
					/>
				</div>

				{cur.alt && <div className={s.caption}>{cur.alt}</div>}
			</div>
		</div>
	)
}
