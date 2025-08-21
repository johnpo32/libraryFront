<template>
  <LogoutComponent />
  <div class="books-container">
    <!-- Buscador centrado -->
    <div class="search-section">
      <h1>Buscador de Libros</h1>
      <div class="search-form">
        <input v-model="nombreLibro" type="text" placeholder="Escribe el nombre de un Libro para continuar"
          class="search-input" />
      </div>
      <button @click="handleSubmit" class="boton-generico">Buscar</button>

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
    <div v-if="searchResults.length > 0" class="results-section">
      <h2>Resultados de búsqueda ({{ searchResults.length }})</h2>
      <div class="books-grid">
        <div v-for="book in searchResults" :key="book.id" class="book-card">
          <NuxtLink :to="`/libros/${book.id}`">
            <div class="book-cover">
              <img :src="book.cover" :alt="book.title" />
            </div>
            <h3 class="book-title">{{ book.title }}</h3>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <div v-if="searchResults.length === 0" class="no-results">
      <p>No encontramos libros con el título ingresado</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const searchQuery = ref('')
const nombreLibro = ref('')
const searchResults = ref([])
const busquedasRecientes = ref([])
const searched = ref(false)
const toast = useToast()
const textoBusqueda = ref('')
const { $api } = useNuxtApp()

const handleSubmit = async () => {
  try {
    if (nombreLibro.value.trim() === '') {
      return toast.warning({ title: 'Warning!', message: 'Digite el nombre del libro' })
    }
    const data = await $api(`/api/books/search?query=${nombreLibro.value}`, {
      method: "GET",
    })

    if (data && data.length > 0) {
      searchResults.value = data

    } else {
      searchResults.value = [];
    }
    console.log(searchResults.value)
  } catch (error) {
    toast.error({ title: 'Error!', message: error })
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

// Función para buscar libros
const searchBooks = async () => {
  if (!searchQuery.value.trim()) return

  // Agregar a búsquedas recientes
  addTobusquedasRecientes(searchQuery.value)

  // Simulación de búsqueda (en un caso real, aquí harías una llamada a una API)
  try {
    // Esta es una simulación - en una app real usarías una API como Google Books
    const mockResults = [
      { id: 1, title: 'El Quijote', cover: 'https://via.placeholder.com/150x200?text=El+Quijote' },
      { id: 2, title: 'Cien años de soledad', cover: 'https://via.placeholder.com/150x200?text=Cien+Años' },
      { id: 3, title: '1984', cover: 'https://via.placeholder.com/150x200?text=1984' },
      { id: 4, title: 'Don Juan Tenorio', cover: 'https://via.placeholder.com/150x200?text=Don+Juan' },
      { id: 5, title: 'La sombra del viento', cover: 'https://via.placeholder.com/150x200?text=La+Sombra' }
    ]

    // Filtrar resultados basados en la consulta (simulación)
    const filteredResults = mockResults.filter(book =>
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    ).slice(0, 10) // Máximo 10 resultados

    searchResults.value = filteredResults
    searched.value = true
  } catch (error) {
    console.error('Error buscando libros:', error)
    searchResults.value = []
  }
}

// Agregar búsqueda a recientes
const addTobusquedasRecientes = (query) => {
  // Eliminar si ya existe
  const index = busquedasRecientes.value.indexOf(query)
  if (index > -1) {
    busquedasRecientes.value.splice(index, 1)
  }

  // Agregar al inicio
  busquedasRecientes.value.unshift(query)

  // Mantener solo las últimas 5
  if (busquedasRecientes.value.length > 5) {
    busquedasRecientes.value = busquedasRecientes.value.slice(0, 5)
  }

  // Guardar en localStorage
  localStorage.setItem('recentBookSearches', JSON.stringify(busquedasRecientes.value))
}

// Repetir una búsqueda anterior
const repeatSearch = (query) => {
  searchQuery.value = query
  searchBooks()
}

</script>

<style lang="scss"></style>