<template>
  <div>
    <button class="botonSalir" @click="salir">Salir</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const toast = useToast()

const salir = () => {
  toast.info({ title: 'Info', message: 'Adiosito!!' })
  auth.logout()
}
</script>

<style lang="scss">
.botonSalir {
  padding: .5em .8em;
  position: fixed;
  color: $colorSecundario !important;
}
</style>