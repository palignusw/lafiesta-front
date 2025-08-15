import { setRequestLocale, getTranslations } from 'next-intl/server'
import Section from '@/components/Section/Section'
import PackageGrid from '@/components/Menu/PackageGrid'
import { packages } from '@/lib/menu/packages'

export default async function MenuPage({
	params: { locale },
}: {
	params: { locale: string }
}) {
	setRequestLocale(locale)
	const t = await getTranslations('MenuPackages')

	return (
		<Section title={t('title')} subtitle={t('subtitle')}>
			<PackageGrid items={packages} />
			<p style={{ marginTop: 14, color: 'var(--muted)' }}>{t('note')}</p>
		</Section>
	)
}
