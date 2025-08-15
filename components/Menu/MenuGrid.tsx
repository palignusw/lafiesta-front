import s from './MenuGrid.module.scss'
import MenuCard from './MenuCard'

type MenuCardProps = React.ComponentProps<typeof MenuCard>

export type MenuItem = MenuCardProps & { id: number }

export default function MenuGrid({ items }: { items: MenuItem[] }) {
	return (
		<div className={s.grid}>
			{items.map(({ id, ...card }) => (
				<MenuCard key={id} {...card} />
			))}
		</div>
	)
}
