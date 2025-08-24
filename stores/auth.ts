import { defineStore } from 'pinia'
import type { AuthResponse } from '~/types/auth';
import type { User } from '~/types/auth';

const config = useRuntimeConfig();
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | User,
    token: null as string | null,
    loading: false,
    error: null as string | null
  }),
  actions: {
    async login(username: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const { data } = await useFetch<AuthResponse>('/api/auth/login', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: { username, password }
        })

        if (!data.value || !data.value.token) throw new Error('Respuesta inválida del servidor')

        console.log('obtengo mi token ' + data.value.token)

        this.token = data.value.token
        this.user = data.value.user

        // Guardar en localStorage
        if (process.client) {
          localStorage.setItem('auth_token', this.token || '')
          localStorage.setItem('auth_user', JSON.stringify(this.user))
        }

        return { success: true, message: 'Login exitoso' }

      } catch (err: any) {
        this.error = err.message || 'Error en login'
        return { success: false, message: this.error }

      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      navigateTo('/login')
    },
  }
})
