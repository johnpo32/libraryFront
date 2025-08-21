<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">{{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}</h1>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="input-group">
          <label for="email">Nombre de usuario</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="Mi nombre de usuario"
          >
        </div>
        
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            minlength="6"
          >
        </div>
        
        <button type="submit" class="submit-btn">
          {{ isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </button>
      </form>
      
      <p class="toggle-mode">
        {{ isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <a href="#" @click.prevent="toggleMode">
          {{ isLoginMode ? 'Regístrate aquí' : 'Inicia sesión aquí' }}
        </a>
      </p>
      
    </div>
  </div>
</template>

<script setup>
const toast = useToast()
const username = ref('')
const password = ref('')
const isLoginMode = ref(true)
const message = ref('')

import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  message.value = ''
}

const handleSubmit = () => {
  if (isLoginMode.value) {
    loginUser()
  } else {
    registrarUsuario()
  }
}

const loginUser = async () => {
  const consulta = await auth.login(username.value, password.value)
  
  if (consulta.success){
    toast.success({ title: 'Success!', message: consulta.message })
    navigateTo('/')
  } else {
    toast.error({ title: 'Error!', message: consulta.message})
  }
}

const registrarUsuario = async () => {
  
}
</script>

<style lang="scss">
.toggle-mode {
  text-align: center;
  color: $text-color;

  a {
    color: $principalcolor;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>