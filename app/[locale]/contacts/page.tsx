import { setRequestLocale, getTranslations } from 'next-intl/server'
import BookingForm from '../../../app/api/booking/BookingForm'

export default async function ContactsPage({
	params: { locale },
}: {
	params: { locale: string }
}) {
	setRequestLocale(locale)
	const t = await getTranslations('Contacts')

	return (
		<section style={{ padding: '28px 0' }}>
			<div className='container'>
				<h2 style={{ margin: '0 0 12px', textAlign: 'center' }}>
					{t('title')}
				</h2>
				<p style={{ textAlign: 'center' }}>{t('address')}</p>
				<p style={{ textAlign: 'center' }}>{t('hours')}</p>

				<div style={{ marginTop: 12 }}>
					<BookingForm locale={locale} />
				</div>
			</div>
		</section>
	)
}
