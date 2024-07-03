// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        [
            "@pinia/nuxt",
            {
                autoImports: ["defineStore", "acceptHMRUpdate"],
            },
        ]
    ],
    imports: {
        dirs: ["stores"],
    },
    // components: true,
    components: [
        { path: '~/components'},
        { path: '~/components/ui'}
    ],
    autoImports: {
        dirs: [
            'composables',
            'utils',
            'utils/types'
        ],
    },
    css: ['~/theme.css'],
    plugins: [
        '~/plugins/fontawesome.ts'
    ],
    vite: {
        vue: {
            template: {
                preprocessOptions: {
                    pug: require('pug'),
                }
            }
        }
    },
    router: {
        options: {
            linkActiveClass: 'active',
            linkExactActiveClass: 'active'
        },
        middleware: ['auth', 'main', 'queryRules']
    },
    app: {
        head: {
            link: [
                {rel: "icon", type: "image/x-icon", href: "/lamotte.png"}
            ],
            meta: [
                {
                    name: "Online Store",
                    content: "Lamotte store, 2004 - 2024",
                    'http-equiv': "X-UA-Compatible"
                },
            ],
            title: "Online Store",
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1, maximum-scale=1",
        }
    },
    routeRules: {
        "/dashboard": {ssr: false},
        "/product-id": {ssr: true},
        "/signin": {ssr: false},
        "/signup": {ssr: false},
        "/forgot-password": {ssr: false},
        "/about": {ssr: true, prerender: true},
        "/help": {ssr: true, prerender: true},
    },

})
