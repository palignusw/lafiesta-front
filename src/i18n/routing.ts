import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
	locales: ['ka', 'ru', 'en'],
	defaultLocale: 'ka',
	pathnames: {
		'/': '/',
		'/menu': '/menu',
		'/gallery': '/gallery',
		'/menu/[slug]': '/menu/[slug]',
		'/about': '/about',
		'/contacts': '/contacts',
	},
})
