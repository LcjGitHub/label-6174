/**
 * 鸟种信息
 */
export interface Bird {
  id: string
  name: string
  scientificName: string
  /** 占位图 URL */
  imageUrl: string
  /** 鸟种简要介绍 */
  description: string
}

/**
 * 目击记录
 */
export interface Sighting {
  id: string
  birdId: string
  date: string
  location: string
  count: number
  note: string
  createdAt: string
}

/**
 * 新建目击记录表单
 */
export interface SightingForm {
  birdId: string | null
  date: number | null
  location: string
  count: number
  note: string
}
