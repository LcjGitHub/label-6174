import dayjs from 'dayjs'
import type { Bird, Sighting, BirdSpeciesStats } from '@/types'

export function getSortedSightings(sightings: Sighting[]): Sighting[] {
  return [...sightings].sort((a, b) =>
    dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  )
}

export function getTotalSightingsCount(sightings: Sighting[]): number {
  return sightings.length
}

export function getTotalBirdsCount(sightings: Sighting[]): number {
  return sightings.reduce((sum, s) => sum + s.count, 0)
}

export function getUniqueSpeciesCount(sightings: Sighting[]): number {
  const birdIds = new Set(sightings.map((s) => s.birdId))
  return birdIds.size
}

export function getSummaryStats(sightings: Sighting[]): {
  totalSightings: number
  totalBirds: number
  uniqueSpecies: number
} {
  const birdIds = new Set(sightings.map((s) => s.birdId))
  const totalBirds = sightings.reduce((sum, s) => sum + s.count, 0)
  return {
    totalSightings: sightings.length,
    totalBirds,
    uniqueSpecies: birdIds.size,
  }
}

export function getSightingsByBirdId(
  sightings: Sighting[],
  birdId: string
): Sighting[] {
  return sightings
    .filter((s) => s.birdId === birdId)
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
}

export function getFilteredSightings(
  sightings: Sighting[],
  birdId: string,
  locationKeyword: string
): Sighting[] {
  let result = [...sightings]

  if (birdId) {
    result = result.filter((s) => s.birdId === birdId)
  }

  if (locationKeyword.trim()) {
    const keyword = locationKeyword.trim().toLowerCase()
    result = result.filter((s) => s.location.toLowerCase().includes(keyword))
  }

  return result.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
}

export function getSpeciesStats(
  sightings: Sighting[],
  birds: Bird[]
): BirdSpeciesStats[] {
  const statsMap = new Map<string, { count: number; sightingCount: number }>()

  for (const sighting of sightings) {
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
    const bird = birds.find((b) => b.id === birdId)
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
}

export function getRecentLocations(sightings: Sighting[]): string[] {
  const sorted = [...sightings].sort((a, b) => {
    const createdDiff = dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    if (createdDiff !== 0) return createdDiff
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  })
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
}
