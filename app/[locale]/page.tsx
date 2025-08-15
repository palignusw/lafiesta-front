import { setRequestLocale } from 'next-intl/server'
import Hero from '@/components/Hero/Hero'
import PackageGrid from '@/components/Menu/PackageGrid'
import { packages } from '@/lib/menu/packages'
import Section from '@/components/Section/Section'

export default async function HomePage({
	params: { locale },
}: {
	params: { locale: string }
}) {
	setRequestLocale(locale)
	return (
		<>
			<Hero />
			<Section
				title='ბანკეტის პაკეტები'
				subtitle='აირჩიეთ შესაბამისი შეთავაზება'
			>
				<PackageGrid items={packages} />
			</Section>
		</>
	)
}
