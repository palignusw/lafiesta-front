import s from './PackageGrid.module.scss'
import PackageCard from './PackageCard'
import type { MenuPackage } from '@/lib/menu/packages'

export default function PackageGrid({ items }: { items: MenuPackage[] }) {
	return (
		<div className={s.grid}>
			{items.map(p => (
				<PackageCard key={p.slug} pkg={p} />
			))}
		</div>
	)
}
