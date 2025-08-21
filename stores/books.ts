import { defineStore } from 'pinia'

export const useBooksStore = defineStore('books', {
  state: () => ({
    searchResults: [] as any[]
  }),
  actions: {
    setResults(results: any[]) {
      this.searchResults = results
    },
    obtenerPortitulo(slug: string) {
      return this.searchResults.find(b => this.normalizar(b.title) === this.normalizar(slug))
    },
    normalizar(title: string) {
      return title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }
  }
})