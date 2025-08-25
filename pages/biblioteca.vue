<template>
  <NavComponent />
  <div class="books-container">
    <!-- Filtros y búsqueda -->
    <div class="search-section">
      <div class="search-form">

        <input class="search-input" v-model="searchTerm" placeholder="Buscar por título o autor" />
        <button @click="buscarTexto" class="boton-generico">Buscar</button>
      </div>

      <select class="boton-generico" v-model="filter.ordenCalificacion">
        <option value="">Ordenar por calificación</option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>

      <label>
        <input type="checkbox" v-model="filter.excluirSinReview" />
        Excluir libros sin review
      </label>
    </div>

    <!-- Lista de libros -->

    <div v-if="loading" class="results-section">
      Cargando...
    </div>

    <div v-else class="grilla">
      <div v-for="book in bookBiblioteca.biblioteca" :key="book.key">
        <CardComponent :libro="book" />
      </div>
    </div>

    <!-- Mensaje si no hay libros -->
    <div v-if="bookBiblioteca.biblioteca.length === 0" class="sin-libros">
      No se encontraron libros en tu biblioteca
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

/* Store */
import { useMyBibliotecaStore } from '~/stores/biblioteca'
const bookBiblioteca = useMyBibliotecaStore()

const searchTerm = ref('')
const loading = ref(false)
const toast = useToast()
const filter = ref({
  search: '',
  ordenCalificacion: '',
  excluirSinReview: false
})

//Plugins
const { $api } = useNuxtApp()

// Cargar libros al iniciar
onMounted(async () => {
  await filtrarLibros()
})

const filtrarLibros = async () => {
  try {

    loading.value = true

    const params = {
      excluirSinReview: filter.value.excluirSinReview,
      ordenCalificacion: filter.value.ordenCalificacion,
      search: filter.value.search
    }

    const cleanFilters = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    );

    const data = await $api(`/api/books/my-library`, {
      method: "GET",
      params: cleanFilters
    })

    if (Array.isArray(data) && data.length > 0) {
      bookBiblioteca.setBiblioteca(data)
    } else {
      bookBiblioteca.setBiblioteca([])
    }

  } catch (error) {
    toast.error({ title: 'Error!', message: 'Error al filtrar' })
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 300);
  }
}

const buscarTexto = () => {
  if (searchTerm.value == '') {
    toast.warning({ title: 'Warning!', message: 'Digite el nombre del libro' })
  }
  filter.value.search = searchTerm.value
}

watch(
  filter.value,
  () => {
    filtrarLibros()
  }
)

</script>
<style>
.acciones {
  padding: 0.5em;
}
</style>