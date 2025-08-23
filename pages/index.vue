<template>
  <NavComponent />

  <div class="books-container">
    <!-- Buscador centrado -->
    <div class="search-section">
      <h1>Buscador de Libros</h1>
      <div class="search-form">
        <input v-model="nombreLibro" type="text" placeholder="Escribe el nombre de un Libro para continuar"
          class="search-input" />
      </div>
      <!-- Boton de buscar -->
      <button @click="buscarLibro" class="boton-generico">
        <span v-if="loading">
          <span class="spinner-border spinner-border-sm" role="status"></span>
          Buscando...
        </span>
        <span v-else>
          Buscar
        </span>
      </button>

    </div>

    <!-- Últimas 5 búsquedas -->
    <div v-if="busquedasRecientes.length > 0" class="recent-searches">
      <h2>Últimas búsquedas</h2>
      <ul>
        <li v-for="(search, index) in busquedasRecientes" :key="index">
          {{ search.query }}
        </li>
      </ul>
    </div>

    <!-- Resultados de búsqueda -->
    <div v-if="booksStore.searchResults.length > 0" class="results-section">
      <h2>Resultados de búsqueda ({{ booksStore.searchResults.length }})</h2>
      <div class="books-grid">
        <div v-for="book in booksStore.searchResults" :key="book.key" class="book-card">
          <NuxtLink :to="`/libros/${book.key}`">
            <div class="book-cover">
              <img :src="book.cover" :alt="book.title" />
            </div>
            <h3 class="book-title">{{ book.title }}</h3>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <div v-if="booksStore.searchResults.length === 0" class="no-results">
      <p>No encontramos libros con el título ingresado</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

import { useBooksStore } from '~/stores/books'

const booksStore = useBooksStore()
const nombreLibro = ref('')
const busquedasRecientes = ref([])
const loading = ref(false)

const { $swal } = useNuxtApp();
const { $api } = useNuxtApp()

/* Cargo las busquedas recientes */
onMounted(async () => {
  librosRecientes()
})

const librosRecientes = async () => {
  try {
    const data = await $api(`/api/books/last-search`, {
      method: "GET",
    })

    if (Array.isArray(data) && data.length > 0) {
      busquedasRecientes.value = data
    } else {
      busquedasRecientes.value = []
    }
    
  } catch (error) {
    notificar("error", error)
  }
}

const buscarLibro = async () => {
  try {

    const searchTerm = nombreLibro.value.trim()
    if (!searchTerm) {
      notificar("warning", "Por favor, digite el nombre del libro")
      return
    }

    loading.value = true

    const searchUrl = `/api/books/search?query=${encodeURIComponent(searchTerm)}`

    const data = await $api(searchUrl, { method: "GET" })

    if (Array.isArray(data) && data.length > 0) {
      booksStore.setResults(data)
      librosRecientes()
    } else {
      booksStore.setResults([])
      notificar("warning", "No se encontraron libros con ese nombre")
    }

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Error en la búsqueda'
    notificar("error", errorMessage)

    booksStore.setResults([])
  } finally {
    loading.value = false
  }
}

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

<style lang="scss"></style>