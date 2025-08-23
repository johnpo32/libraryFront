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
      Guardando...
    </div>
    <div v-else v-for="libro in librosFiltrados" :key="libro.title" class="results-section">
      <img v-if="libro.coverImage" :title="libro.coverImage" :src="libro.coverImage" :alt="libro.title" />

      <div class="books-grid">
        <h3>{{ libro.title }}</h3>
        <p><strong>Autor:</strong> {{ libro.author }}</p>
        <p v-if="libro.publishYear"><strong>Año:</strong> {{ libro.publishYear }}</p>
        <p v-if="libro.isbn"><strong>ISBN:</strong> {{ libro.isbn }}</p>

        <div v-if="libro.review">
          <strong>Review:</strong>
          <p>{{ libro.review }}</p>
        </div>

        <div v-if="libro.rating">
          <strong>Calificación:</strong>
          <span>{{ libro.rating }}/5</span>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="acciones">
        <button type="button" class="btn btn-secondary btn-sm" @click="editarLibro(libro)">Editar</button>
        <button type="button" class="btn btn-danger btn-sm" @click="eliminarLibro(libro)">Eliminar</button>

      </div>
    </div>

    <!-- Mensaje si no hay libros -->
    <div v-if="librosFiltrados.length === 0" class="sin-libros">
      No se encontraron libros en tu biblioteca
    </div>


    <!-- Modal de edición -->
    <div v-if="libroEditando" class="modal-edicion">
      <div class="modal-contenido">
        <h3>Editar {{ libroEditando.title }}</h3>

        <textarea v-model="reviewEditado" placeholder="Escribe tu review" class="textarea-edicion" maxlength="500"
          rows="6" />

        <label>puntaje</label>
        <input type="number" v-model="ratingEditado" min="1" max="5" placeholder="Calificación (1-5)"
          class="input-rating" />

        <div class="modal-acciones">
          <button @click="guardarEdicion" class="btn-guardar">Guardar</button>
          <button @click="cancelarEdicion" class="btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const libros = ref([])
const librosFiltrados = ref([])
const searchTerm = ref('')
const loading = ref(false)
const libroEditando = ref(null)
const reviewEditado = ref('')
const ratingEditado = ref(0)
const toast = useToast()
const filter = ref({
  search: '',
  ordenCalificacion: '',
  excluirSinReview: false
})

//Plugins
const { $api } = useNuxtApp()
const { $swal } = useNuxtApp();

// Cargar libros al iniciar
onMounted(async () => {
  await cargarLibros()
})

const cargarLibros = async () => {
  try {
    loading.value = true

    const data = await $api(`/api/books/my-library`, {
      method: "GET",
    })

    librosFiltrados.value = data

  } catch (error) {
    toast.error({ title: 'Error!', message: error })
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 300);
  }
}

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

    librosFiltrados.value = data

  } catch (error) {
    toast.error({ title: 'Error!', message: 'Error al filtrar' })
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 300);
  }
}

const editarLibro = (libro) => {
  libroEditando.value = libro
  reviewEditado.value = libro.review || ''
  ratingEditado.value = libro.rating || 0
}

const guardarEdicion = async () => {
  try {
    if (reviewEditado.value === '' || ratingEditado.value === 0) {
      return toast.warning({ title: 'Warning!', message: 'Complete los campos' })
    }

    await $api(`/api/books/my-library/${libroEditando.value._id}`, {
      method: 'PUT',
      body: {
        review: reviewEditado.value,
        rating: ratingEditado.value
      }
    })

    // Actualizar localmente
    await cargarLibros();
    cancelarEdicion();

  } catch (error) {
    console.error('Error editando libro:', error)
  }
}

const cancelarEdicion = () => {
  libroEditando.value = null
  reviewEditado.value = ''
  ratingEditado.value = 0
}

const eliminarLibro = async (libro) => {
  try {

    const result = $swal.fire({
      title: "¿Estás seguro de eliminar este libro?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!(await result).isConfirmed) return;

    await $api(`/api/books/my-library/${libro._id}`, {
      method: 'DELETE'
    })

    // Eliminar localmente
    await cargarLibros();
    cancelarEdicion();

  } catch (error) {
    console.error('Error eliminando libro:', error)
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