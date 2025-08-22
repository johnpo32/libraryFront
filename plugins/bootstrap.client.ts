import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css' 

export default defineNuxtPlugin(nuxtApp => {
  // Opcional: Si necesitas acceder a Bootstrap JS en tus componentes
  nuxtApp.provide('bootstrap', {
    //Modal: typeof window !== 'undefined' ? require('bootstrap/js/dist/modal') : null,
    //Collapse: typeof window !== 'undefined' ? require('bootstrap/js/dist/collapse') : null
  })
})