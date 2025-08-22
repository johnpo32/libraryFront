<template>
  <NavComponent />
  <div class="books-container">
    <!-- Filtros y búsqueda -->
    <div class="search-section">
      <div class="search-form">

        <input class="search-input" v-model="searchTerm" placeholder="Buscar por título o autor"
          @input="filtrarLibros" />
        <button @click="handleSubmit" class="boton-generico">Buscar</button>
      </div>

      <select class="boton-generico" v-model="ordenCalificacion" @change="filtrarLibros">
        <option value="">Ordenar por calificación</option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>

      <label>
        <input type="checkbox" v-model="excluirSinReview" @change="filtrarLibros" />
        Excluir libros sin review
      </label>
    </div>

    <!-- Lista de libros -->
    <div class="results-section">
      <div v-for="libro in librosFiltrados" :key="libro.title" class="libro-card">
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
          <button @click="editarLibro(libro)">Editar</button>
          <button @click="eliminarLibro(libro)">Eliminar</button>
        </div>
      </div>

      <!-- Mensaje si no hay libros -->
      <div v-if="librosFiltrados.length === 0" class="sin-libros">
        No se encontraron libros en tu biblioteca
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="libroEditando" class="modal-edicion">
    <div class="modal-contenido">
      <h3>Editar {{ libroEditando.title }}</h3>

      <textarea 
        v-model="reviewEditado" 
        placeholder="Escribe tu review" 
        class="textarea-edicion"
        maxlength="500" rows="6"
      />

      <label>puntaje</label>
      <input 
        type="number" 
        v-model="ratingEditado" 
        min="1" 
        max="5" 
        placeholder="Calificación (1-5)" 
        class="input-rating"
      />

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
const ordenCalificacion = ref('')
const excluirSinReview = ref(false)
const libroEditando = ref(null)
const reviewEditado = ref('')
const ratingEditado = ref(0)
const toast = useToast()
const { $api } = useNuxtApp()

// Cargar libros al iniciar
onMounted(async () => {
  await cargarLibros()
})

const cargarLibros = async () => {
  try {
    const data = await $api(`/api/books/my-library`, {
      method: "GET",
    })

    librosFiltrados.value = data
  } catch (error) {
    toast.error({ title: 'Error!', message: error })
  }
}

const filtrarLibros = () => {
  let filtered = [...libros.value]

  // Filtrar por búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(libro =>
      libro.title.toLowerCase().includes(term) ||
      libro.author.toLowerCase().includes(term)
    )
  }

  // Excluir sin review
  if (excluirSinReview.value) {
    filtered = filtered.filter(libro => libro.review && libro.review.trim() !== '')
  }

  // Ordenar por calificación
  if (ordenCalificacion.value === 'asc') {
    filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0))
  } else if (ordenCalificacion.value === 'desc') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  librosFiltrados.value = filtered
}

const editarLibro = (libro) => {
  libroEditando.value = libro
  reviewEditado.value = libro.review || ''
  ratingEditado.value = libro.rating || 0
}

const guardarEdicion = async () => {
  try {
    if (reviewEditado.value === '' || ratingEditado.value === 0){
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

const irAInicio = () => {
  // Navegar al inicio
  // router.push('/')
}

const salir = () => {
  // Lógica de logout
  // auth.logout()
}
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
</style>