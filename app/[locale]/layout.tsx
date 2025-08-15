import '../globals.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/src/i18n/routing'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: { locale: string } // ⬅ не Promise!
}) {
	const { locale } = params

	if (!hasLocale(routing.locales, locale)) notFound()

	setRequestLocale(locale)
	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Header />
					<main>{children}</main>
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
