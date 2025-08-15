import s from './Section.module.scss'

export default function Section({
	title,
	subtitle,
	children,
}: {
	title?: string
	subtitle?: string
	children: React.ReactNode
}) {
	return (
		<section className={s.section}>
			<div className='container'>
				{(title || subtitle) && (
					<div className={s.head}>
						{title && <h2 className={s.title}>{title}</h2>}
						{subtitle && <p className={s.subtitle}>{subtitle}</p>}
					</div>
				)}
				{children}
			</div>
		</section>
	)
}
