import {useAuthStore} from "@/stores/AuthStore";
export default defineNuxtRouteMiddleware((to, from) => {
    const AuthStore = useAuthStore()
    if (AuthStore.isAuthentificated) {
        return navigateTo({ name: "index" })
    }
})