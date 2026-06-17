import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import birdsData from '@/mock/birds.json'
import type { Bird, Sighting, SightingForm } from '@/types'

/**
 * 观鸟目击记录状态管理
 */
export const useSightingsStore = defineStore('sightings', {
  state: () => ({
    sightings: [] as Sighting[],
    birds: birdsData as Bird[],
  }),

  getters: {
    /**
     * 按日期倒序排列的目击记录
     */
    sortedSightings(state): Sighting[] {
      return [...state.sightings].sort((a, b) =>
        dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
      )
    },

    /**
     * 根据 ID 获取鸟种
     */
    getBirdById: (state) => (id: string): Bird | undefined => {
      return state.birds.find((bird) => bird.id === id)
    },
  },

  actions: {
    /**
     * 添加目击记录
     */
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

    /**
     * 删除目击记录
     */
    removeSighting(id: string): void {
      this.sightings = this.sightings.filter((s) => s.id !== id)
    },
  },

  persist: {
    paths: ['sightings'],
  },
})
