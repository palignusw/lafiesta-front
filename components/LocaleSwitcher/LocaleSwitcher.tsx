import { useLocale } from 'next-intl'
import Link from 'next/link'
import s from './LocaleSwitcher.module.scss'

const locales = ['ka', 'ru', 'en'] as const

export default function LocaleSwitcher() {
	const active = useLocale()

	return (
		<div className={s.switcher}>
			{locales.map(l => (
				<Link
					key={l}
					href='/'
					locale={l}
					className={`${s.btn} ${active === l ? s.active : ''}`}
				>
					{l.toUpperCase()}
				</Link>
			))}
		</div>
	)
}
