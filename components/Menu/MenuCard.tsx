import s from './MenuCard.module.scss'

export default function MenuCard({
	name,
	desc,
	price,
	rec,
}: {
	name: string
	desc?: string
	price: number
	rec?: boolean
}) {
	return (
		<div className={s.card}>
			<div className={s.row}>
				<h3 className={s.name}>{name}</h3>
				<b className={s.price}>{price} ₾</b>
			</div>
			{desc && <p className={s.desc}>{desc}</p>}
			{rec && <span className={s.badge}>რეკომენდაცია</span>}
		</div>
	)
}
