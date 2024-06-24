import {useAuthStore} from "@/stores/AuthStore";
export default defineNuxtRouteMiddleware(async (to, from) => {
    if(process.client){
        const AuthStore = useAuthStore()
        if (AuthStore.isAuthentificated) {
            return navigateTo({ name: "index" })
        }
    }

})