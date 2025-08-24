import { defineStore } from 'pinia'

export const useMyBibliotecaStore = defineStore('biblioteca', {
  state: () => ({
    biblioteca: [] as any[]
  }),
  actions: {
    setBiblioteca(libros: any[]) {
      this.biblioteca = libros
    },
    obtenerKey(key: string) {
      return this.biblioteca.find(b => b.key === key)
    }
  }
})
