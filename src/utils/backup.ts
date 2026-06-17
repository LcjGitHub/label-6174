import type { Sighting } from '@/types'

export function exportSightingsToFile(sightings: Sighting[]): void {
  const content = JSON.stringify(sightings, null, 2)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `sightings-backup-${new Date().toISOString().slice(0, 10)}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function parseSightingsFromFile(file: File): Promise<Sighting[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text)
        if (!Array.isArray(data)) {
          reject(new Error('文件格式错误：内容不是数组'))
          return
        }
        const valid = data.every(
          (item) =>
            typeof item.id === 'string' &&
            typeof item.birdId === 'string' &&
            typeof item.date === 'string' &&
            typeof item.location === 'string' &&
            typeof item.count === 'number' &&
            typeof item.note === 'string' &&
            typeof item.createdAt === 'string'
        )
        if (!valid) {
          reject(new Error('文件格式错误：记录字段不完整'))
          return
        }
        resolve(data as Sighting[])
      } catch {
        reject(new Error('文件解析失败：无法识别的JSON格式'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}
