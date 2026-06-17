import { describe, it, expect } from 'vitest'
import {
  getSummaryStats,
  getSightingsByBirdId,
  getFilteredSightings,
} from '@/utils/sightingStats'
import type { Sighting } from '@/types'

const createSighting = (
  id: string,
  birdId: string,
  date: string,
  location: string,
  count: number,
  note: string = ''
): Sighting => ({
  id,
  birdId,
  date,
  location,
  count,
  note,
  createdAt: new Date().toISOString(),
})

describe('sightingStats 工具函数', () => {
  describe('getSummaryStats - 汇总摘要读取', () => {
    it('空数据场景：应返回全零的汇总数据', () => {
      const result = getSummaryStats([])
      expect(result).toEqual({
        totalSightings: 0,
        totalBirds: 0,
        uniqueSpecies: 0,
      })
    })

    it('单条记录场景：应正确统计单条记录', () => {
      const sightings = [
        createSighting('s1', 'bird-001', '2024-01-15', '北京公园', 3),
      ]
      const result = getSummaryStats(sightings)
      expect(result.totalSightings).toBe(1)
      expect(result.totalBirds).toBe(3)
      expect(result.uniqueSpecies).toBe(1)
    })

    it('多条同鸟种记录场景：应正确统计同鸟种多条记录', () => {
      const sightings = [
        createSighting('s1', 'bird-001', '2024-01-15', '公园A', 2),
        createSighting('s2', 'bird-001', '2024-01-16', '公园B', 5),
        createSighting('s3', 'bird-001', '2024-01-17', '公园C', 3),
      ]
      const result = getSummaryStats(sightings)
      expect(result.totalSightings).toBe(3)
      expect(result.totalBirds).toBe(10)
      expect(result.uniqueSpecies).toBe(1)
    })

    it('多条不同鸟种记录场景：应正确统计多鸟种数据', () => {
      const sightings = [
        createSighting('s1', 'bird-001', '2024-01-15', '公园A', 2),
        createSighting('s2', 'bird-002', '2024-01-16', '公园B', 1),
        createSighting('s3', 'bird-003', '2024-01-17', '公园C', 4),
        createSighting('s4', 'bird-001', '2024-01-18', '公园D', 3),
      ]
      const result = getSummaryStats(sightings)
      expect(result.totalSightings).toBe(4)
      expect(result.totalBirds).toBe(10)
      expect(result.uniqueSpecies).toBe(3)
    })
  })

  describe('getSightingsByBirdId - 按鸟种编号筛选记录', () => {
    it('空数据场景：应返回空数组', () => {
      const result = getSightingsByBirdId([], 'bird-001')
      expect(result).toEqual([])
    })

    it('单条记录匹配场景：应返回该条记录', () => {
      const s1 = createSighting('s1', 'bird-001', '2024-01-15', '公园', 2)
      const sightings = [s1]
      const result = getSightingsByBirdId(sightings, 'bird-001')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('s1')
    })

    it('单条记录不匹配场景：应返回空数组', () => {
      const sightings = [
        createSighting('s1', 'bird-002', '2024-01-15', '公园', 2),
      ]
      const result = getSightingsByBirdId(sightings, 'bird-001')
      expect(result).toEqual([])
    })

    it('多条同鸟种记录场景：应返回全部匹配记录并按日期倒序排列', () => {
      const s1 = createSighting('s1', 'bird-001', '2024-01-15', '公园A', 2)
      const s2 = createSighting('s2', 'bird-001', '2024-01-20', '公园B', 5)
      const s3 = createSighting('s3', 'bird-001', '2024-01-10', '公园C', 3)
      const sightings = [s1, s2, s3]
      const result = getSightingsByBirdId(sightings, 'bird-001')
      expect(result).toHaveLength(3)
      expect(result[0].id).toBe('s2')
      expect(result[1].id).toBe('s1')
      expect(result[2].id).toBe('s3')
    })

    it('多鸟种混合场景：只返回指定鸟种的记录', () => {
      const s1 = createSighting('s1', 'bird-001', '2024-01-15', '公园A', 2)
      const s2 = createSighting('s2', 'bird-002', '2024-01-16', '公园B', 1)
      const s3 = createSighting('s3', 'bird-001', '2024-01-17', '公园C', 4)
      const s4 = createSighting('s4', 'bird-003', '2024-01-18', '公园D', 3)
      const sightings = [s1, s2, s3, s4]
      const result = getSightingsByBirdId(sightings, 'bird-001')
      expect(result).toHaveLength(2)
      expect(result.map((s) => s.birdId)).toEqual(['bird-001', 'bird-001'])
    })
  })

  describe('getFilteredSightings - 按条件筛选记录', () => {
    const createTestData = (): Sighting[] => [
      createSighting('s1', 'bird-001', '2024-01-20', '北京朝阳公园', 2, '早晨活动'),
      createSighting('s2', 'bird-002', '2024-01-18', '上海世纪公园', 1, '单独出现'),
      createSighting('s3', 'bird-001', '2024-01-15', '北京颐和园', 5, '群体活动'),
      createSighting('s4', 'bird-003', '2024-01-22', '广州越秀公园', 3, '树上观察'),
      createSighting('s5', 'bird-001', '2024-01-10', '北京奥林匹克公园', 4, '湖边栖息'),
      createSighting('s6', 'bird-002', '2024-01-25', '上海外滩绿化带', 2, '城区少见'),
    ]

    it('空数据场景：应返回空数组', () => {
      const result = getFilteredSightings([], '', '')
      expect(result).toEqual([])
    })

    it('无筛选条件场景：应返回全部记录并按日期倒序', () => {
      const sightings = createTestData()
      const result = getFilteredSightings(sightings, '', '')
      expect(result).toHaveLength(6)
      expect(result[0].date).toBe('2024-01-25')
      expect(result[result.length - 1].date).toBe('2024-01-10')
    })

    it('仅按鸟种编号筛选场景：只返回指定鸟种', () => {
      const sightings = createTestData()
      const result = getFilteredSightings(sightings, 'bird-001', '')
      expect(result).toHaveLength(3)
      result.forEach((s) => expect(s.birdId).toBe('bird-001'))
      expect(result[0].date).toBe('2024-01-20')
      expect(result[2].date).toBe('2024-01-10')
    })

    it('仅按地点关键词筛选场景：匹配地点含关键词的记录', () => {
      const sightings = createTestData()
      const result = getFilteredSightings(sightings, '', '北京')
      expect(result).toHaveLength(3)
      result.forEach((s) =>
        expect(s.location.toLowerCase()).toContain('北京'.toLowerCase())
      )
    })

    it('地点关键词部分匹配场景', () => {
      const sightings = createTestData()
      const result = getFilteredSightings(sightings, '', '公园')
      expect(result).toHaveLength(4)
      result.forEach((s) =>
        expect(s.location).toContain('公园')
      )
    })

    it('地点关键词含空格自动修剪场景', () => {
      const sightings = createTestData()
      const result = getFilteredSightings(sightings, '', '  广州  ')
      expect(result).toHaveLength(1)
      expect(result[0].location).toContain('广州')
    })

    it('鸟种编号和地点同时筛选场景：两个条件都满足', () => {
      const sightings = createTestData()
      const result = getFilteredSightings(sightings, 'bird-001', '北京')
      expect(result).toHaveLength(3)
      result.forEach((s) => {
        expect(s.birdId).toBe('bird-001')
        expect(s.location.toLowerCase()).toContain('北京'.toLowerCase())
      })
    })

    it('筛选条件无匹配场景：返回空数组', () => {
      const sightings = createTestData()
      const result = getFilteredSightings(sightings, 'bird-999', '')
      expect(result).toEqual([])
    })

    it('多条同鸟种记录筛选场景：正确返回所有匹配记录', () => {
      const sightings = [
        createSighting('s1', 'bird-005', '2024-01-10', '湿地A', 10),
        createSighting('s2', 'bird-005', '2024-01-12', '湿地B', 8),
        createSighting('s3', 'bird-005', '2024-01-15', '湿地A', 15),
      ]
      const result = getFilteredSightings(sightings, 'bird-005', '湿地')
      expect(result).toHaveLength(3)
      expect(result[0].date).toBe('2024-01-15')
      expect(result[result.length - 1].date).toBe('2024-01-10')
    })
  })
})
