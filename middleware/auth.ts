
import router from "#app/plugins/router";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const AuthStore = useAuthStore()
    await AuthStore.prepareToken()
    let authorized = AuthStore.getToken
    if (authorized) {
        return navigateTo({name: 'index'})
    }
})