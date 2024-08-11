import {useAuthStore} from "~/stores/AuthStore";

export default defineNuxtRouteMiddleware((to, from) => {

    const AuthStore = useAuthStore()

    const {name, params, hash} = to;

    if (Object.keys(to.query).length > 0) {
        if (typeof name === 'string') {
            return navigateTo({
                name,
                params,
                hash,
                replace: true
            });
        }
    }
})