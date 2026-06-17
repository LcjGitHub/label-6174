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
     * 根据 ID 获取目击记录
     */
    getSightingById: (state) => (id: string): Sighting | undefined => {
      return state.sightings.find((s) => s.id === id)
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
     * 根据鸟种 ID 获取该鸟种的全部目击记录，按日期倒序排列
     */
    getSightingsByBirdId: (state) => (birdId: string): Sighting[] => {
      return state.sightings
        .filter((s) => s.birdId === birdId)
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    },

    /**
     * 根据鸟种和地点关键词筛选目击记录，按日期倒序排列
     * @param birdId 鸟种ID，为空字符串则不筛选鸟种
     * @param locationKeyword 地点关键词，为空字符串则不筛选地点
     */
    getFilteredSightings: (state) => (birdId: string, locationKeyword: string): Sighting[] => {
      let result = [...state.sightings]

      if (birdId) {
        result = result.filter((s) => s.birdId === birdId)
      }

      if (locationKeyword.trim()) {
        const keyword = locationKeyword.trim().toLowerCase()
        result = result.filter((s) => s.location.toLowerCase().includes(keyword))
      }

      return result.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
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

    /**
     * 最近使用的地点列表，从已有目击记录中提取、去重，按最近使用排序，最多10条
     */
    recentLocations(state): string[] {
      const sorted = [...state.sightings].sort(
        (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
      )
      const seen = new Set<string>()
      const result: string[] = []

      for (const sighting of sorted) {
        const location = sighting.location.trim()
        if (location && !seen.has(location)) {
          seen.add(location)
          result.push(location)
          if (result.length >= 10) break
        }
      }

      return result
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
     * 更新目击记录
     */
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

    /**
     * 删除目击记录
     */
    removeSighting(id: string): void {
      this.sightings = this.sightings.filter((s) => s.id !== id)
    },

    /**
     * 批量合并目击记录
     * 与现有数据合并，自动跳过重复编号的记录
     * @param incoming 待导入的目击记录数组
     * @returns 实际新增的记录条数
     */
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
