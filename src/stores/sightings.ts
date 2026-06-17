import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import birdsData from '@/mock/birds.json'
import type { Bird, Sighting, SightingForm, BirdSpeciesStats } from '@/types'

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

    /**
     * 目击记录总条数
     */
    totalSightingsCount(state): number {
      return state.sightings.length
    },

    /**
     * 累计观测鸟只数量
     */
    totalBirdsCount(state): number {
      return state.sightings.reduce((sum, s) => sum + s.count, 0)
    },

    /**
     * 已观测到的不同鸟种数量
     */
    uniqueSpeciesCount(state): number {
      const birdIds = new Set(state.sightings.map((s) => s.birdId))
      return birdIds.size
    },

    /**
     * 各鸟种出现次数统计，按出现次数从高到低排列
     */
    speciesStats(state): BirdSpeciesStats[] {
      const statsMap = new Map<string, { count: number; sightingCount: number }>()

      for (const sighting of state.sightings) {
        const existing = statsMap.get(sighting.birdId)
        if (existing) {
          existing.count += sighting.count
          existing.sightingCount += 1
        } else {
          statsMap.set(sighting.birdId, {
            count: sighting.count,
            sightingCount: 1,
          })
        }
      }

      const result: BirdSpeciesStats[] = []
      for (const [birdId, stats] of statsMap.entries()) {
        const bird = state.birds.find((b) => b.id === birdId)
        if (bird) {
          result.push({
            birdId,
            name: bird.name,
            scientificName: bird.scientificName,
            imageUrl: bird.imageUrl,
            count: stats.count,
            sightingCount: stats.sightingCount,
          })
        }
      }

      return result.sort((a, b) => b.sightingCount - a.sightingCount)
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
