// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            appUrl: process.env.APP_URL || 'http://localhost:3000',
        }
    },
    devtools: {enabled: true},
    modules: [
        [
            "@pinia/nuxt",
            {
                autoImports: ["defineStore", "acceptHMRUpdate"],
            },
        ],
        "@vite-pwa/nuxt"
    ],
    imports: {
        dirs: ["stores"],
    },
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
    pwa: {
        manifest: {
            name: "Online Store PWA",
            short_name: "Lamotte PWA",
            description: "Online store - Lamotte, with industrial products",
            lang: "en",
            display: "standalone",
            start_url: "/",
            background_color: "#FFFFFF",
            theme_color: "#ADD8E6FF",
            icons: [
                {
                    src: "lamotte_company_logo-64.png",
                    sizes: "64x64",
                    type: "image/png"
                },
                {
                    src: "lamotte_company_logo-128.png",
                    sizes: "128x128",
                    type: "image/png"
                },
                {
                    src: "lamotte_company_logo-144.png",
                    sizes: "144x144",
                    type: "image/png"
                },
                {
                    src: "lamotte_company_logo-512.png",
                    sizes: "512x512",
                    type: "image/png"
                }
            ],
            screenshots: [
                {
                    src: "/screenshots/screen1.png",
                    sizes: "640x480",
                    type: "image/png",
                    form_factor: "wide"
                },
                {
                    src: "/screenshots/screen2.png",
                    sizes: "320x480",
                    type: "image/png"
                }
            ]
        },
        workbox: {
            offline: true,
            offlineAssets: [
                '/offline.html',
            ],
            runtimeCaching: [
                {
                    urlPattern: 'https://667aca84bd627f0dcc908b53.mockapi.io/.*',
                    handler: 'NetworkFirst',
                    method: 'GET',
                    strategyOptions: {
                        cacheName: 'api-cache',
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
            ]
        },
        devOptions: {
            enabled: true,
            type: 'module',
        }
    }
})
