<template>
  <div class="card moto-card h-100 shadow-sm border-0">

    <!-- Imagen principal -->
    <div class="image-container">
      <NuxtLink :to="`/libros/${libro.key}`" class="text-decoration-none">
        <img :src="libro.cover || libro.coverImage || '/images/sin-imagen.png'" class="moto-image"
          :alt="`${libro.title}`" loading="lazy" />
      </NuxtLink>
    </div>

    <div class="card-body d-flex flex-column">
      <!-- Titulo -->
      <h3 class="h5 card-title text-truncate">
        {{ libro.title }}
      </h3>

      <!-- Seccion solo para la biblioteca -->
      <div v-if="libro.coverImage" class="card-body">
  <!-- Metadatos -->
  <ul class="list-unstyled d-flex flex-wrap gap-3 mb-2">
    <li><small class="text-muted"><strong>Autor:</strong> {{ libro.author || '-' }}</small></li>
    <li><small class="text-muted"><strong>Año:</strong> {{ libro.publishYear || '-' }}</small></li>
    <li>
      <small class="text-muted">
        <strong>Calificación:</strong> {{ libro.rating ? libro.rating + '/5' : '-' }}
      </small>
    </li>
  </ul>

  <!-- Reseña -->
  <div class="review text-muted">
    <small><strong>Reseña:</strong> {{ libro.review || 'Sin reseña disponible.' }}</small>
  </div>
</div>

      <!-- Botón de acción -->
      <div class="card-footer bg-transparent border-0 pt-0">
        <NuxtLink :to="`/libros/${libro.key}`" class="btn btn-outline-primary w-100">
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

<style>
.image-container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  /* centra verticalmente */
  justify-content: center;
  /* centra horizontalmente */
  overflow: hidden;
  position: relative;
}

.review {
  max-height: 100px;  
  overflow: hidden; 
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4; 
  -webkit-box-orient: vertical;
}
</style>