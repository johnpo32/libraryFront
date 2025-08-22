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
      <button @click="handleSubmit" class="boton-generico">
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
const toast = useToast()
const loading = ref(false)

const { $api } = useNuxtApp()

const handleSubmit = async () => {
  try {   

    if (nombreLibro.value.trim() === '') {
      return toast.warning({ title: 'Warning!', message: 'Digite el nombre del libro' })
    }

    loading.value = true

    const data = await $api(`/api/books/search?query=${nombreLibro.value}`, {
      method: "GET",
    })

    if (data && data.length > 0) {
      booksStore.setResults(data) //Guardo en store
    } else {
      booksStore.setResults([])
    }

  } catch (error) {
    toast.error({ title: 'Error!', message: error })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const data = await $api(`/api/books/last-search`, {
      method: "GET",
    })

    busquedasRecientes.value = data
  } catch (error) {
    toast.error({ title: 'Error!', message: error })
  }
})

</script>

<style lang="scss"></style>