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
    components: {
        dirs: [
            '~/components',
            '~/components/ui'
        ]
    },
    css: ['~/theme.css'],
    plugins: [
        '~/plugins/fontawesome'
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
            ]
        }
    },
    routeRules: {
        "/dashboard": { ssr: false }
    },
})
