'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { MediaItem } from '@/lib/gallery'
import s from './GalleryGrid.module.scss'
import Lightbox from './LightBox'

type Album = { key: MediaItem['album']; icon?: string }

export default function GalleryGrid({
	items,
	albums,
}: {
	items: MediaItem[]
	albums: Album[]
}) {
	const [active, setActive] = useState<MediaItem['album'] | 'all'>('all')
	const [lbIndex, setLbIndex] = useState<number | null>(null)

	// Текущий набор карточек
	const filtered = useMemo(
		() => (active === 'all' ? items : items.filter(i => i.album === active)),
		[items, active]
	)

	// Только изображения для лайтбокса
	const images = useMemo(
		() => filtered.filter(i => i.type !== 'video'),
		[filtered]
	)

	// Быстрый поиск: id -> индекс в массиве images
	const imageIndexById = useMemo(() => {
		const map = new Map<string, number>()
		images.forEach((it, idx) => map.set(it.id, idx))
		return map
	}, [images])

	// Сменили альбом — закрываем лайтбокс
	useEffect(() => {
		setLbIndex(null)
	}, [active])

	return (
		<div className={s.wrap}>
			<div className={s.toolbar}>
				<button
					className={`${s.chip} ${active === 'all' ? s.active : ''}`}
					onClick={() => setActive('all')}
				>
					ყველა
				</button>
				{albums.map(a => (
					<button
						key={a.key}
						className={`${s.chip} ${active === a.key ? s.active : ''}`}
						onClick={() => setActive(a.key)}
					>
						{a.icon && <span className={s.icon}>{a.icon}</span>}
						<span>{a.key}</span>
					</button>
				))}
			</div>

			<div className={s.grid}>
				{filtered.map((m, idx) => {
					if (m.type === 'video') {
						return (
							<div key={m.id} className={s.card}>
								<div className={s.mediaBox}>
									<video
										className={s.media}
										poster={m.poster}
										controls
										preload='metadata'
										playsInline
									>
										<source src={m.src} type='video/mp4' />
									</video>
								</div>
							</div>
						)
					}

					const imgIdx = imageIndexById.get(m.id)
					if (imgIdx === undefined) return null

					return (
						<button
							key={m.id}
							className={s.card}
							onClick={() => setLbIndex(imgIdx)}
							aria-label={'asd'}
						>
							<div className={s.mediaBox}>
								<Image
									className={s.media}
									src={m.src}
									alt={'asdsad'}
									fill
									sizes='(max-width:600px) 100vw, (max-width:1024px) 50vw, 33vw'
									priority={idx < 2}
								/>
							</div>
						</button>
					)
				})}
			</div>

			{lbIndex !== null && images.length > 0 && (
				<Lightbox
					items={images}
					start={lbIndex}
					onClose={() => setLbIndex(null)}
				/>
			)}
		</div>
	)
}
