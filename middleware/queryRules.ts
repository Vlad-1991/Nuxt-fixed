export default defineNuxtRouteMiddleware((to, from) => {

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