<template>
  <div class="book-card">

    <!-- Imagen -->
    <div class="book-image">
      <NuxtLink :to="`/libros/${libro.key}`">
        <img 
          :src="libro.cover || libro.coverImage || '/images/sin-imagen.png'" 
          :alt="libro.title" 
          loading="lazy" 
        />
      </NuxtLink>
    </div>

    <div class="book-content">
      <!-- Titulo -->
      <h3 class="book-title">
        {{ libro.title }}
      </h3>

      <!-- verifico si vengo de la biblioteca-->
      <div v-if="libro.coverImage">

        <div class="seccion-libro">
          <span class="libro-item">
            <strong>Autor:</strong> {{ libro.author || '-' }}
          </span>
          <span class="libro-item">
            <strong>Año:</strong> {{ libro.publishYear || '-' }}
          </span>
          <span class="libro-item">
            <strong>Calificación:</strong> {{ libro.rating ? libro.rating + '/5' : '-' }}
          </span>
        </div>

        <!-- Reseña -->
        <div class="libro-review">
          <strong>Reseña:</strong> {{ libro.review || 'Sin reseña disponible.' }}
        </div>
      </div>

      <!-- Botón de acción -->
      <div class="book-actions">
        <NuxtLink :to="`/libros/${libro.key}`" class="btn-ver-detalle">
          Ver detalles
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  libro: {
    type: Object as PropType<any>,
    required: false
  }
})
</script>

<style scoped lang="scss">

.book-card {
  background: $background-color;
  border-radius: $border-radius;
  box-shadow: $color-shadow;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-image {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f8f9fa;
  object-fit: contain;
}

.book-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: $text-color;
  margin: 0;
  line-height: 1.3;
  
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.seccion-libro {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.libro-item {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;

  strong {
    color: $text-color;
    font-weight: 500;
  }
}

.libro-review {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
    overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  
  strong {
    color: $text-color;
    font-weight: 500;
  }
}

.book-actions {
  margin-top: auto;
  padding-top: 0.5rem;
}

.btn-ver-detalle {
  display: block;
  width: 90%;
  padding: 0.75rem;
  background: transparent;
  color: $principalcolor;
  border: 2px solid $principalcolor;
  border-radius: $border-radius;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: $principalcolor;
    color: white;
    text-decoration: none;
  }
}

</style>