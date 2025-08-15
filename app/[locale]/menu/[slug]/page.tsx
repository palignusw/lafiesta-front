import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/src/i18n/navigation'
import { packages } from '@/lib/menu/packages'
import SectionSpy from '@/components/SectionSpy/SectionSpy' // ← НОВОЕ
import s from './page.module.scss'

export default async function PackagePage({
	params: { locale, slug },
}: {
	params: { locale: string; slug: string }
}) {
	setRequestLocale(locale)
	const t = await getTranslations('MenuPackages')
	const pkg = packages.find(p => p.slug === slug)
	if (!pkg) notFound()

	// ids для якорей
	const ids = pkg.sections.map(
		(sec, i) =>
			'sec-' +
			(sec.title || 'section').toLowerCase().replace(/\s+/g, '-') +
			'-' +
			i
	)

	return (
		<div className='container'>
			<div className={s.wrap}>
				<Link href='/menu' className={`btn outline ${s.back}`}>
					← {t('back')}
				</Link>

				<div className={s.head}>
					<h1 className={s.title}>{pkg.name}</h1>
					<div className={s.price}>{pkg.price} ₾</div>
				</div>
				<p className={s.meta}>{pkg.perPersonLabel}</p>

				<div className={s.grid}>
					<main className={s.main}>
						<SectionSpy ids={ids} /> {/* ← НОВОЕ: активные табы */}
						<nav className={s.toc}>
							{pkg.sections.map((sec, i) => (
								<a key={i} href={`#${ids[i]}`}>
									{sec.title}
								</a>
							))}
						</nav>
						{pkg.sections.map((sec, i) => {
							const dense = sec.items.length >= 14 // длинные списки в 3 колонки
							return (
								<section
									key={i}
									id={ids[i]}
									className={`${s.card} ${dense ? s.dense : ''}`}
								>
									<h3 className={s.fancyTitle}>{sec.title}</h3>
									<ul className={s.luxList}>
										{sec.items.map((x, idx) => (
											<li key={idx} className={s.luxItem}>
												{x}
											</li>
										))}
									</ul>
								</section>
							)
						})}
						<div className={s.actions}>
							<Link href='/contacts' className={`btn ${s.btnShine}`}>
								{t('book')}
							</Link>
							<Link href='/menu' className='btn outline'>
								{t('back')}
							</Link>
						</div>
					</main>

					<aside>
						<div className={s.sticky}>
							<nav className={s.toc}>
								{pkg.sections.map((sec, i) => (
									<a key={i} href={`#${ids[i]}`}>
										{sec.title}
									</a>
								))}
							</nav>
							<Link href='/contacts' className={`btn ${s.btnShine}`}>
								{t('book')}
							</Link>
						</div>
					</aside>
				</div>
			</div>
		</div>
	)
}
