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
    axios: {
        baseURL: process.env.VUE_APP_FB_URL || 'http://localhost:3000'
    },
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
        '~/plugins/fontawesome',
        '~/plugins/axios.ts'
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
        }
    },
    app: {
        head: {
            link: [
                {rel: "icon", type: "image/x-icon", href: "/lamotte.png"}
            ]
        }
    }

})
