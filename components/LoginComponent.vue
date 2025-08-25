<template>
  <!-- Loading -->
  <span class="login-container" v-if="loading">
    Cargando...
  </span>

  <!-- resto del contenido -->
  <div v-else class="login-container">
    <div class="login-card">
      <h1 class="login-title">{{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}</h1>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="input-group">
          <label for="email">Nombre de usuario</label>
          <input id="username" v-model="username" type="text" required placeholder="Mi nombre de usuario">
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" required placeholder="••••••••" minlength="6">
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
/* Store */
import { useAuthStore } from '~/stores/auth'
import { useBooksStore } from '~/stores/books'

const message = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)
const isLoginMode = ref(true)
const { $register } = useNuxtApp()

/* Store */
const auth = useAuthStore()
const booksStore = useBooksStore()

/* Plugins */
const { $swal } = useNuxtApp();

/* puedo inciar sesion o registrar */
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  message.value = ''
}

/* Aqui manejo el evento de registrar o login */
const handleSubmit = () => {
  if (isLoginMode.value) {
    loginUser()
  } else {
    registrarUsuario()
  }
}

/* login */
const loginUser = async () => {
  loading.value = true
  const consulta = await auth.login(username.value, password.value)

  if (consulta.success) {
    notificar("success", consulta.message)

    loading.value = false
    booksStore.setResults([])
    navigateTo('/')

  } else {
    notificar("error", consulta.message)
    loading.value = false
  }
}

/* registrar */
const registrarUsuario = async () => {
  try {
    const data = await $register(`/api/users/register`, {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      })
    })

    password.value = ''
    isLoginMode.value = true
    notificar("success", 'Se creo el usuario ' + username.value)

  } catch (error) {
    notificar("error", error)
  }
}

/* Abstraccion de notificacion */
const notificar = (tipo, text) => {
  $swal.fire({
    position: "top-end",
    icon: tipo,
    text: text,
    showConfirmButton: false,
    timer: 1500
  });
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