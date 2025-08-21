export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const token = localStorage.getItem("auth_token")

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest: ({ options }) => {
            const headers = new Headers(options.headers)
            
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            options.headers = headers
        }
    })

    return {
        provide: { api }
    }
})
