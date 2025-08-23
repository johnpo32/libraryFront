<template>
  <div>
    <button class="botonInicio" @click="inicio">Inicio</button>
    <button class="botonBiblioteca" @click="irABiblioteca">Biblioteca</button>
    <button class="botonSalir" @click="salir">Salir</button>
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

const irABiblioteca = () => {
  router.push('/biblioteca')
}

const inicio = () => {
  router.push('/')
}
</script>

<style lang="scss">
.botonInicio{
  padding: .5em .8em;
  position: fixed;
  top: 20px;
  right: 220px;
  color: $colorSecundario !important;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid $colorSecundario;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    background: $colorSecundario;
    color: white !important;
  }
}

.botonSalir {
  padding: .5em .8em;
  position: fixed;
  top: 20px;
  right: 20px;
  color: $colorSecundario !important;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid $colorSecundario;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    background: $colorSecundario;
    color: white !important;
  }
}

.botonBiblioteca {
  padding: .5em .8em;
  position: fixed;
  top: 20px;
  right: 100px;
  color: $principalcolor !important;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid $principalcolor;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    background: $principalcolor;
    color: white !important;
  }
}
</style>