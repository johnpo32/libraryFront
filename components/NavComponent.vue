<template>
  <header class="sticky-top bg-white">
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light">

        <!-- Menú colapsable -->
        <div class="collapse navbar-collapse" id="navbarContent">

          <!-- Acciones de usuario -->
          <div class="d-flex gap-2">
            <NuxtLink to="/" class="botonInicio btn btn-outline-primary">
              Inicio
            </NuxtLink>
            <div class="d-flex gap-2">
              <NuxtLink to="/biblioteca" class="botonBiblioteca btn btn-outline-primary">Biblioteca</NuxtLink>
              <button class="botonSalir btn btn-outline-secondary" @click="salir">Salir</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const { $swal } = useNuxtApp();

const auth = useAuthStore()
const toast = useToast()
const router = useRouter()

const salir = () => {
  $swal.fire({
    position: "top-end",
    icon: "success",
    title: "Hasta pronto",
    showConfirmButton: false,
    timer: 1500
  });
  auth.logout()
}

const irABiblioteca = () => {
  router.push('/biblioteca')
}

const inicio = () => {
  router.push('/')
}
</script>

<style lang="scss">
.botonInicio {
  position: fixed;
  right: 220px;
}

.botonSalir {
  position: fixed;
  right: 20px;
}

.botonBiblioteca {
  position: fixed;
  right: 100px;
}
</style>