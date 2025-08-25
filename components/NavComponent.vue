<template>
  <!-- Acciones de usuario -->
  <div>
    <NuxtLink to="/" class="btn-ver-detalle  botonInicio">
      Inicio
    </NuxtLink>
    <div>
      <NuxtLink to="/biblioteca" class="btn-ver-detalle botonBiblioteca">Biblioteca</NuxtLink>
      <span class="btn-ver-detalle  botonSalir " @click="salir">Salir</span>
    </div>
  </div>
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
</script>

<style lang="scss">
.botonInicio {
  position: fixed;
  right: 220px;
  width: auto;
  padding: .5em;
}

.botonSalir {
  position: fixed;
  right: 20px;
  width: auto;
  padding: .5em;
}

.botonBiblioteca {
  position: fixed;
  right: 100px;
  width: auto;
  padding: .5em;
}
</style>