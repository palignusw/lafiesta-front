// типы и пример данных
export type MediaType = 'image' | 'video'

export type MediaItem = {
	id: string
	src: string // путь в /public
	w: number // исходная ширина
	h: number // исходная высота
	album: 'დარბაზი' | 'დეკორი' | 'საჭმელი' | 'ივენთები'
	type?: MediaType // по умолчанию 'image'
	poster?: string // постер для видео
}

export const albums = [
	{ key: 'დარბაზი', icon: '🏛️' },
	{ key: 'დეკორი', icon: '✨' },
	{ key: 'საჭმელი', icon: '🍽️' },
	{ key: 'ივენთები', icon: '💍' },
] as const

export const media: MediaItem[] = [
	// ----- Hall
	{
		id: 'h1',
		src: '/hero/hall.png',
		w: 1600,
		h: 1067,
		album: 'დარბაზი',
	},
	{
		id: 'h2',
		src: '/hero/hall.png',
		w: 1600,
		h: 1000,
		album: 'დარბაზი',
	},
	// ----- Decor
	{
		id: 'd1',
		src: '/hero/hall.png',
		w: 1200,
		h: 1500,
		album: 'დეკორი',
	},
	// ----- Food
	{
		id: 'f1',
		src: '/hero/hall.png',
		w: 1400,
		h: 933,
		album: 'საჭმელი',
	},
	// ----- Events (пример видео)
	{
		id: 'v1',
		type: 'video',
		src: '/videos/gallery/first_dance.mp4',
		poster: '/images/gallery/events/poster.jpg',
		w: 1920,
		h: 1080,
		album: 'ივენთები',
	},
]
