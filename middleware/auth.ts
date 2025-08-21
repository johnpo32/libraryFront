export default defineNuxtRouteMiddleware((to, from) => {
    const token = localStorage.getItem("auth_token")

    if (!token && to.path !== '/login') {
        return navigateTo('/login')
    }

    if (token && to.path === '/login') {
        return navigateTo('/')
    }
})
