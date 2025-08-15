import s from './PackageCard.module.scss'
import type { MenuPackage } from '@/lib/menu/packages'
import { Link } from '@/src/i18n/navigation'

export default function PackageCard({ pkg }: { pkg: MenuPackage }) {
	return (
		<Link href={`/menu/${pkg.slug}`} className={s.card}>
			<div className={s.head}>
				<h3 className={s.name}>{pkg.name}</h3>
				<div className={s.price}>{pkg.price} ₾</div>
			</div>
			<div className={s.perPerson}>{pkg.perPersonLabel}</div>
			<div className={s.highlights}>
				{pkg.highlights.slice(0, 4).map((h, i) => (
					<span className={s.tag} key={i}>
						{h}
					</span>
				))}
			</div>
			<span className={`btn ${s.cta}`}>ნახვა</span>
		</Link>
	)
}
