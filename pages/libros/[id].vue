<template>
  <NavComponent />
  <div v-if="book" class="login-container">
    <div class="card-section">

      <!-- Información del libro -->
      <div class="book-layout">
        <img :src="book.cover || book.coverImage || '/images/sin-imagen.png'" />

        <div>
          <h1>{{ book.title }}</h1>
          <p><strong>Autor:</strong> {{ book.author }}</p>
          <p><strong>Año de publicación:</strong> {{ book.publishYear }}</p>
        </div>
      </div>

      <!-- Sección de reseña y calificación -->
      <div class="review-section">
        <h2>Deja tu reseña</h2>

        <!-- Calificación con estrellas -->
        <div class="rating">
          <p>Califica este libro:</p>
          <div class="stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= book.rating }"
              @click="setRating(star)">
              ★
            </span>
          </div>
        </div>

        <!-- Textarea para reseña -->
        <div class="review-form">
          <label for="review">Tu reseña (máximo 500 caracteres):</label>
          <textarea id="review" v-model="book.review" placeholder="Comparte tu opinión sobre este libro..."
            maxlength="500" rows="6"></textarea>
          <div class="char-counter">{{ book.review ? book.review.length : 0 }}/500 caracteres</div>
        </div>

        <div v-if="book.coverImage" class="btn-acciones">
          <!-- Botón de Actualizar -->
          <button class="boton-generico boton-local" @click="guardarEdicion">
            <span v-if="loading">
              Actualizando...
            </span>
            <span v-else>
              Actualizar
            </span>
          </button>

          <!-- Eliminar -->
          <button class="btn-ver-detalle boton-local" @click="eliminarLibro">
            <span v-if="loading">
              Eliminando...
            </span>
            <span v-else>
              Eliminar
            </span>
          </button>
        </div>

        <!-- Boton de guardar -->
        <button v-else class="boton-generico boton-local" @click="submitReview">
          <span v-if="loading">
            Guardando...
          </span>
          <span v-else>
            Guardar
          </span>
        </button>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Libro no encontrado.</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

import { useRoute } from "vue-router";
import { useBooksStore } from "~/stores/books";
import { useMyBibliotecaStore } from "~/stores/biblioteca";
import { ref, computed } from 'vue';

const route = useRoute();
const booksStore = useBooksStore();
const bibliotecaStore = useMyBibliotecaStore();
const { convertir } = useImagenToBase64();
const { $api } = useNuxtApp()
const { $swal } = useNuxtApp();

const toast = useToast()
const loading = ref(false)

// Obtenemos el libro según el store
const book = computed(() => {
  return (
    bibliotecaStore.obtenerKey(route.params.id) ||
    booksStore.obtenerKey(route.params.id)
  )
})

// Establecer calificación
const setRating = (stars) => {
  book.value.rating = stars;
};

// Enviar reseña
const submitReview = async () => {
  try {
    loading.value = true

    // Transformo documento
    const resultadoImagen = await convertir(book.value.cover);
    console.log('Base64:', resultadoImagen);

    const data = await $api(`/api/books/my-library`, {
      method: "POST",
      body: JSON.stringify({
        title: book.value.title,
        author: book.value.author,
        key: book.value.key,
        publishYear: book.value.publishYear,
        coverImage: resultadoImagen,
        rating: book.value.rating,
        review: book.value.review
      })
    })

    $swal.fire("", "Se guardaron los datos", "success")
    navigateTo('/biblioteca')

  } catch (error) {
    toast.error({ title: 'Warning!', message: 'Revisa en tu biblioteca, es posible que ya exista el libro' })
  } finally {
    loading.value = false
  }
};

/* Actualizacion */
const guardarEdicion = async () => {
  try {

    await $api(`/api/books/my-library/${book.value._id}`, {
      method: 'PUT',
      body: {
        review: book.value.review,
        rating: book.value.rating
      }
    })
    $swal.fire("", "Se actualizó el libro", "success")
    navigateTo('/biblioteca')

  } catch (error) {
    $swal.fire("", "Error editando libro: " + error, "error")
    console.error('Error editando libro:', error)
  }
}

/* Eliminar */
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

    await $api(`/api/books/my-library/${book.value._id}`, {
      method: 'DELETE'
    })

    $swal.fire("", "Se eliminó el libro", "success")
    navigateTo('/biblioteca')

  } catch (error) {
    $swal.fire("", "Error eliminando libro: " + error, "error")

  }
}

</script>

<style scoped lang="scss">
.book-layout {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.card-section {
  background: white;
  padding: 2rem;
  border-radius: $border-radius;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 50%;
}

.review-section {
  flex: 1;
  background: $background-color;
  padding: $spacing;
  border-radius: $border-radius;
  box-shadow: 0 2px 4px $color-shadow;

  h2 {
    margin-top: 0;
    color: $text-color;
    border-bottom: 1px solid darken($background-color, 5%);
    padding-bottom: 0.5rem;
  }
}

.rating {
  margin-bottom: 1.5rem;

  p {
    margin: 0.5rem 0;
    color: #555;
  }
}

.stars {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.star {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;

  &.filled {
    color: #ffc107;
  }

  &.hover {
    color: #ffc107;
  }

}

.review-form {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;

    &.focus {
      outline: none;
      border-color: #4361ee;
      box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    }
  }
}

.char-counter {
  text-align: right;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.btn-acciones {
  gap: 2;
  display: flex;
  gap: 0.5rem;
}

.boton-local {
  padding: .5em;
  width: auto;
}

</style>