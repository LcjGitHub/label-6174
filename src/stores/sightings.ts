import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import birdsData from '@/mock/birds.json'
import type { Bird, Sighting, SightingForm } from '@/types'

export const useSightingsStore = defineStore('sightings', {
  state: () => ({
    sightings: [] as Sighting[],
    birds: birdsData as Bird[],
  }),

  getters: {
    getBirdById: (state) => (id: string): Bird | undefined => {
      return state.birds.find((bird) => bird.id === id)
    },

    getSightingById: (state) => (id: string): Sighting | undefined => {
      return state.sightings.find((s) => s.id === id)
    },
  },

  actions: {
    addSighting(form: SightingForm): void {
      if (!form.birdId || form.date === null) return

      const sighting: Sighting = {
        id: crypto.randomUUID(),
        birdId: form.birdId,
        date: dayjs(form.date).format('YYYY-MM-DD'),
        location: form.location.trim(),
        count: form.count,
        note: form.note.trim(),
        createdAt: dayjs().toISOString(),
      }

      this.sightings.push(sighting)
    },

    updateSighting(id: string, form: SightingForm): void {
      if (!form.birdId || form.date === null) return

      const index = this.sightings.findIndex((s) => s.id === id)
      if (index === -1) return

      this.sightings[index] = {
        ...this.sightings[index],
        birdId: form.birdId,
        date: dayjs(form.date).format('YYYY-MM-DD'),
        location: form.location.trim(),
        count: form.count,
        note: form.note.trim(),
      }
    },

    removeSighting(id: string): void {
      this.sightings = this.sightings.filter((s) => s.id !== id)
    },

    mergeSightings(incoming: Sighting[]): number {
      const existingIds = new Set(this.sightings.map((s) => s.id))
      const newRecords = incoming.filter((s) => !existingIds.has(s.id))
      this.sightings.push(...newRecords)
      return newRecords.length
    },
  },

  persist: {
    paths: ['sightings'],
  },
})
