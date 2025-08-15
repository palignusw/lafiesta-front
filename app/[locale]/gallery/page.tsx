import { setRequestLocale, getTranslations } from 'next-intl/server'
import { media, albums } from '@/lib/gallery'
import GalleryGrid from '@/components/Gallery/GalleryGrid'

export default async function GalleryPage({
	params: { locale },
}: {
	params: { locale: string }
}) {
	setRequestLocale(locale)
	const t = await getTranslations('Gallery')

	return (
		<section style={{ padding: '28px 0 40px' }}>
			<div className='container'>
				<h1 style={{ margin: '0 0 14px' }}>{t('title')}</h1>
				<p style={{ margin: '0 0 18px', opacity: 0.75 }}>{t('subtitle')}</p>
				<GalleryGrid items={media} albums={albums as any} />
			</div>
		</section>
	)
}
