import s from './Hero.module.scss'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/src/i18n/navigation'

export default async function Hero() {
	const t = await getTranslations('HomePage')
	return (
		<section className={s.hero}>
			<div className='container'>
				<div className={s.row}>
					<div>
						<p className={s.kicker}>მუკავშირდით შეუსახებად</p>
						<h1 className={s.title}>{t('title')}</h1>
						<p className={s.subtitle}>{t('subtitle')}</p>
						<div className={s.actions}>
							<Link href='/menu' className='btn'>
								{t('seeMenu')}
							</Link>
							<Link href='/contacts' className='btn outline'>
								{t('book')}
							</Link>
						</div>
					</div>

					<div className={s.frame}>
						<Image
							className={s.photo}
							src='/hero/hall.png' // фото зала
							alt='La Fiesta Hall'
							width={900}
							height={600}
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
