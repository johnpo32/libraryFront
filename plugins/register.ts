export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const register = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest: ({ options }) => {
            const headers = new Headers(options.headers)

            options.headers = headers
        }
    })

    return {
        provide: { register }
    }
})
