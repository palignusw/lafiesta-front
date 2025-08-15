'use client'
import s from './Header.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/src/i18n/navigation'
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher'

export default function Header() {
	const t = useTranslations('Nav')
	return (
		<header className={s.header}>
			<div className={`container ${s.inner}`}>
				<Link href='/' className={s.brand}>
					<Image
						src='/brand/la-fiesta-logo.png'
						alt='La Fiesta'
						width={100}
						height={60}
						priority
					/>
				</Link>

				<nav className={s.nav}>
					<Link href='/'>{t('home')}</Link>
					<Link href='/menu'>{t('menu')}</Link>
					<Link href='/gallery'>{t('gallery')}</Link>
					<Link href='/about'>{t('about')}</Link>
				</nav>

				<Link href='/contacts' className='btn'>
					{t('contacts')}
				</Link>
				{/* <LocaleSwitcher /> */}
			</div>
		</header>
	)
}
