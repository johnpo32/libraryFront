<template>
  <NavComponent />
  <div v-if="book" class="login-container">
    <div class="login-card">
      <!-- Información del libro -->
      <div>
        <img :src="book.cover" :alt="book.title" />
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
            <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= rating }"
              @click="setRating(star)">
              ★
            </span>
          </div>
        </div>

        <!-- Textarea para reseña -->
        <div class="review-form">
          <label for="review">Tu reseña (máximo 500 caracteres):</label>
          <textarea id="review" v-model="reviewText" placeholder="Comparte tu opinión sobre este libro..."
            maxlength="500" rows="6"></textarea>
          <div class="char-counter">{{ reviewText.length }}/500 caracteres</div>
        </div>

        <!-- Botón de enviar -->
        <button class="boton-generico" @click="submitReview">
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm" role="status"></span>
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
import { useRoute } from "vue-router";
import { useBooksStore } from "~/stores/books";
import { ref, computed } from 'vue';

const route = useRoute();
const booksStore = useBooksStore();
const { convertir } = useImagenToBase64();
const { $api } = useNuxtApp()
const toast = useToast()
const loading = ref(false)

// Obtenemos el libro según el slug (title normalizado)
const book = computed(() => booksStore.obtenerKey(route.params.id));

// Estado para la reseña y calificación
const reviewText = ref('');
const rating = ref(null);

// Establecer calificación
const setRating = (stars) => {
  rating.value = stars;
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
        rating: rating.value,
        review: reviewText.value
      })
    })

    toast.success({ title: 'Success!', message: 'Se guardaron los datos' })

  } catch (error) {
    toast.error({ title: 'Warning!', message: 'Revisa en tu biblioteca, es posible que ya exista el libro' })
  } finally {
    loading.value = false
  }

};
</script>

<style scoped>
.review-section {
  flex: 1;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.review-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.rating {
  margin-bottom: 1.5rem;
}

.rating p {
  margin: 0.5rem 0;
  color: #555;
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
}

.star.filled {
  color: #ffc107;
}

.star:hover {
  color: #ffc107;
}

.review-form {
  margin-bottom: 1.5rem;
}

.review-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.review-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
}

.review-form textarea:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.char-counter {
  text-align: right;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}
</style>