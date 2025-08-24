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
      <span class="spinner-border spinner-border-sm" role="status"></span>
      Cargando...
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="book in bookBiblioteca.biblioteca" :key="book.key" class="col book-card">
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
.modal-edicion {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.modal-contenido h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.acciones {
  padding: 0.5em;
}
</style>