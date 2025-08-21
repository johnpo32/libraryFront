export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()   

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest: ({ options }) => {
            const headers = new Headers(options.headers)
            const token = localStorage.getItem("auth_token")
            
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
