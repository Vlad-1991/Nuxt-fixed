import type {NavigationGuardNext, RouteLocationNormalized} from "vue-router";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const router = useRouter()
    router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {

        const AuthStore = useAuthStore()

        /* routes with query params not available except Catalog, if route has query params - redirect to this route without params */
        if (to.name !== 'catalog' && Object.keys(to.query).length > 0) {
            const { name, params, hash } = to;

            if (typeof name === 'string') {
                next({
                    name,
                    params,
                    hash,
                    replace: true
                })
                return
            }
            /* all routes on Auth Layout redirect to Home page, if user already authorized */
        }else if(AuthStore.isAuthentificated && (to.name === 'signin' || to.name === 'signup' || to.name === 'forgotpassword')){
            next('/')
            return
        }

        next()
    })
})
