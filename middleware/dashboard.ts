export default defineNuxtRouteMiddleware(async (to, from) => {
    const AuthStore = useAuthStore();
    await AuthStore.prepareToken();
    const authorized = AuthStore.getToken;

    if (!authorized) {
        return navigateTo('/signin');
    }
});