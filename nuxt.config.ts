// https://nuxt.com/docs/api/configuration/nuxt-config
import compression from "compression";

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            appUrl: process.env.APP_URL || 'http://localhost:3000',
        }
    },
    devtools: {enabled: true},
    css: ['~/assets/css/main.css', '~/theme.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        }
    },
    modules: [
        [
            "@pinia/nuxt",
            {
                autoImports: ["defineStore", "acceptHMRUpdate"],
            },
        ],
        "@vite-pwa/nuxt",
        "@nuxt/image"
    ],
    imports: {
        dirs: ["stores"],
    },
    components: [
        {path: '~/components'},
        {path: '~/components/ui'}
    ],
    autoImports: {
        dirs: [
            'composables',
            'utils',
            'utils/types'
        ],
    },
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
            htmlAttrs: {
                lang: "en",
            },
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
            viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
            script: [
                {
                    hid: 'facebook-sdk',
                    innerHTML: `
            window.fbAsyncInit = function() {
              FB.init({
                appId      : '839171601660576',
                cookie     : true,
                xfbml      : true,
                version    : 'v20.0'
              });
              
              FB.AppEvents.logPageView();   
            };

            (function(d, s, id){
               var js, fjs = d.getElementsByTagName(s)[0];
               if (d.getElementById(id)) {return;}
               js = d.createElement(s); js.id = id;
               js.src = "https://connect.facebook.net/en_US/sdk.js";
               fjs.parentNode.insertBefore(js, fjs);
             }(document, 'script', 'facebook-jssdk'));
          `,
                    type: 'text/javascript',
                    charset: 'utf-8'
                }
            ],
            __dangerouslyDisableSanitizersByTagID: {
                'facebook-sdk': ['innerHTML']
            }
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
            orientation: "landscape",
            scope: "/",
            icons: [
                {
                    src: "/lamotte_company_logo-64.png",
                    sizes: "64x64",
                    type: "image/png",
                    purpose: "any"
                },
                {
                    src: "/lamotte_company_logo-128.png",
                    sizes: "128x128",
                    type: "image/png",
                    purpose: "any"
                },
                {
                    src: "/lamotte_company_logo-144.png",
                    sizes: "144x144",
                    type: "image/png",
                    purpose: "any"
                },
                {
                    src: "/lamotte_company_logo-512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any"
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
            importScripts: ['service-worker.js']
        },
        devOptions: {
            enabled: true,
            type: 'module',
        }
    },
    serverMiddleware: [
        compression()
    ],
    build: {
        terser: {
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
        },
    },
    image: {}
})
