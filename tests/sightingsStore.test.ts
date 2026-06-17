import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSightingsStore } from '@/stores/sightings'
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

describe('useSightingsStore - 状态仓库', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('mergeSightings - 批量合并记录', () => {
    it('空数据场景：仓库为空，导入空数组，应保持空并返回0', () => {
      const store = useSightingsStore()
      const importedCount = store.mergeSightings([])
      expect(importedCount).toBe(0)
      expect(store.sightings).toHaveLength(0)
    })

    it('仓库为空，导入单条记录场景：应成功导入并返回1', () => {
      const store = useSightingsStore()
      const newRecord = createSighting(
        'import-001',
        'bird-001',
        '2024-01-15',
        '导入地点',
        5,
        '导入备注'
      )
      const importedCount = store.mergeSightings([newRecord])
      expect(importedCount).toBe(1)
      expect(store.sightings).toHaveLength(1)
      expect(store.sightings[0].id).toBe('import-001')
      expect(store.sightings[0].birdId).toBe('bird-001')
      expect(store.sightings[0].count).toBe(5)
    })

    it('仓库为空，导入多条不同鸟种记录场景：应全部导入', () => {
      const store = useSightingsStore()
      const records = [
        createSighting('imp-1', 'bird-001', '2024-01-10', '公园', 3),
        createSighting('imp-2', 'bird-002', '2024-01-11', '湖边', 2),
        createSighting('imp-3', 'bird-003', '2024-01-12', '林地', 1),
      ]
      const importedCount = store.mergeSightings(records)
      expect(importedCount).toBe(3)
      expect(store.sightings).toHaveLength(3)
    })

    it('仓库已有记录，导入全部为全新记录场景：应全部合并', () => {
      const store = useSightingsStore()
      store.sightings = [
        createSighting('exist-1', 'bird-001', '2024-01-01', '旧地点1', 2),
        createSighting('exist-2', 'bird-002', '2024-01-02', '旧地点2', 1),
      ]
      const newRecords = [
        createSighting('new-1', 'bird-003', '2024-01-10', '新地点1', 5),
        createSighting('new-2', 'bird-004', '2024-01-11', '新地点2', 3),
      ]
      const importedCount = store.mergeSightings(newRecords)
      expect(importedCount).toBe(2)
      expect(store.sightings).toHaveLength(4)
      const ids = store.sightings.map((s) => s.id)
      expect(ids).toContain('exist-1')
      expect(ids).toContain('exist-2')
      expect(ids).toContain('new-1')
      expect(ids).toContain('new-2')
    })

    it('导入含重复编号记录场景：重复的应跳过，新的应导入', () => {
      const store = useSightingsStore()
      store.sightings = [
        createSighting('dup-1', 'bird-001', '2024-01-01', '原地A', 2, '原备注A'),
        createSighting('dup-2', 'bird-002', '2024-01-02', '原地B', 1, '原备注B'),
      ]
      const importRecords = [
        createSighting('dup-1', 'bird-999', '2099-12-31', '被覆盖地点', 999, '被覆盖备注'),
        createSighting('dup-2', 'bird-888', '2099-12-30', '被覆盖地点2', 888, '被覆盖备注2'),
        createSighting('new-1', 'bird-003', '2024-01-10', '新地点', 4, '新备注'),
      ]
      const importedCount = store.mergeSightings(importRecords)

      expect(importedCount).toBe(1)
      expect(store.sightings).toHaveLength(3)

      const dup1 = store.sightings.find((s) => s.id === 'dup-1')
      expect(dup1).toBeDefined()
      expect(dup1!.birdId).toBe('bird-001')
      expect(dup1!.count).toBe(2)
      expect(dup1!.location).toBe('原地A')
      expect(dup1!.note).toBe('原备注A')

      const dup2 = store.sightings.find((s) => s.id === 'dup-2')
      expect(dup2).toBeDefined()
      expect(dup2!.birdId).toBe('bird-002')
      expect(dup2!.count).toBe(1)
      expect(dup2!.location).toBe('原地B')

      const new1 = store.sightings.find((s) => s.id === 'new-1')
      expect(new1).toBeDefined()
      expect(new1!.birdId).toBe('bird-003')
      expect(new1!.count).toBe(4)
    })

    it('导入含多条同鸟种记录场景：同鸟种不同ID的记录应全部保留', () => {
      const store = useSightingsStore()
      store.sightings = [
        createSighting('e-1', 'bird-005', '2024-01-01', '湿地1', 10),
      ]
      const importRecords = [
        createSighting('i-1', 'bird-005', '2024-01-05', '湿地2', 8),
        createSighting('i-2', 'bird-005', '2024-01-08', '湿地3', 12),
        createSighting('i-3', 'bird-005', '2024-01-10', '湿地1', 15),
      ]
      const importedCount = store.mergeSightings(importRecords)

      expect(importedCount).toBe(3)
      expect(store.sightings).toHaveLength(4)
      const allBird005 = store.sightings.filter((s) => s.birdId === 'bird-005')
      expect(allBird005).toHaveLength(4)
      const totalCount = allBird005.reduce((sum, s) => sum + s.count, 0)
      expect(totalCount).toBe(45)
    })

    it('导入全部为重复编号记录场景：应全部跳过，返回0', () => {
      const store = useSightingsStore()
      store.sightings = [
        createSighting('all-dup-1', 'bird-001', '2024-01-01', '地点A', 1),
        createSighting('all-dup-2', 'bird-002', '2024-01-02', '地点B', 2),
      ]
      const importRecords = [
        createSighting('all-dup-1', 'bird-999', '2099-01-01', 'X', 100),
        createSighting('all-dup-2', 'bird-888', '2099-01-02', 'Y', 200),
      ]
      const importedCount = store.mergeSightings(importRecords)
      expect(importedCount).toBe(0)
      expect(store.sightings).toHaveLength(2)
    })

    it('大量记录合并场景：应正确处理并返回正确数量', () => {
      const store = useSightingsStore()
      const existingRecords: Sighting[] = []
      for (let i = 1; i <= 50; i++) {
        existingRecords.push(
          createSighting(`exist-${i}`, `bird-${String(i % 5).padStart(3, '0')}`, `2024-01-${String(i).padStart(2, '0')}`, `地点${i}`, i)
        )
      }
      store.sightings = existingRecords

      const importRecords: Sighting[] = []
      for (let i = 1; i <= 30; i++) {
        if (i <= 10) {
          importRecords.push(
            createSighting(`exist-${i}`, 'bird-999', '2099-01-01', '重复', 999)
          )
        } else {
          importRecords.push(
            createSighting(`new-${i}`, `bird-${String(i % 3).padStart(3, '0')}`, `2024-02-${String(i).padStart(2, '0')}`, `新地点${i}`, i * 2)
          )
        }
      }

      const importedCount = store.mergeSightings(importRecords)
      expect(importedCount).toBe(20)
      expect(store.sightings).toHaveLength(70)
    })

    it('返回值验证：返回值应等于实际新增的记录数', () => {
      const store = useSightingsStore()
      store.sightings = [
        createSighting('r1', 'bird-001', '2024-01-01', 'A', 1),
        createSighting('r2', 'bird-002', '2024-01-02', 'B', 2),
        createSighting('r3', 'bird-003', '2024-01-03', 'C', 3),
      ]
      const imports = [
        createSighting('r2', 'bird-X', '2099-01-01', 'X', 999),
        createSighting('r4', 'bird-004', '2024-01-04', 'D', 4),
        createSighting('r1', 'bird-Y', '2099-01-01', 'Y', 999),
        createSighting('r5', 'bird-005', '2024-01-05', 'E', 5),
        createSighting('r3', 'bird-Z', '2099-01-01', 'Z', 999),
        createSighting('r6', 'bird-006', '2024-01-06', 'F', 6),
      ]
      const importedCount = store.mergeSightings(imports)
      expect(importedCount).toBe(3)
    })
  })
})
