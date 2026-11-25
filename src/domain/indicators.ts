import { categories } from './categories'
import { statuses } from './statuses'
import type { CategoryId, Occurrence, StatusId } from './types'

export type IndicatorPeriod = '4s' | 'tudo'

export interface IndicatorRecord {
  createdAt: string
  status: StatusId
  categoryId: CategoryId
  neighborhood: string
  hasPhoto: boolean
  hasDescription: boolean
  confirmations: number
}

export interface IndicatorFilters {
  period: IndicatorPeriod
  neighborhood: string | null
  categoryId: CategoryId | null
}

export interface CountItem {
  label: string
  value: number
  share: number
}

export interface WeekBucket {
  label: string
  start: string
  value: number
}

export interface Indicators {
  total: number
  withPhotoAndDescription: number
  withPhotoAndDescriptionShare: number
  confirmationsPerReport: number
  byStatus: (CountItem & { id: StatusId })[]
  byCategory: (CountItem & { id: CategoryId })[]
  byNeighborhood: CountItem[]
  weeks: WeekBucket[]
}

const DAY_MS = 24 * 60 * 60 * 1000
const RECENT_WEEKS = 4
const TOP_NEIGHBORHOODS = 6

export function toIndicatorRecord(occurrence: Occurrence): IndicatorRecord {
  return {
    createdAt: occurrence.createdAt,
    status: occurrence.status,
    categoryId: occurrence.categoryId,
    neighborhood: occurrence.neighborhood,
    hasPhoto: occurrence.photoUrl !== null,
    hasDescription: occurrence.description.trim().length > 0,
    confirmations: occurrence.confirmations,
  }
}

function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - weekday)
  return start
}

function inPeriod(record: IndicatorRecord, period: IndicatorPeriod, now: Date): boolean {
  if (period === 'tudo') return true
  const firstWeek = startOfWeek(now).getTime() - (RECENT_WEEKS - 1) * 7 * DAY_MS
  return new Date(record.createdAt).getTime() >= firstWeek
}

export function filterRecords(
  records: IndicatorRecord[],
  filters: IndicatorFilters,
  now: Date = new Date(),
): IndicatorRecord[] {
  return records.filter(
    (record) =>
      inPeriod(record, filters.period, now) &&
      (!filters.neighborhood || record.neighborhood === filters.neighborhood) &&
      (!filters.categoryId || record.categoryId === filters.categoryId),
  )
}

function share(value: number, total: number): number {
  return total === 0 ? 0 : value / total
}

function buildWeeks(records: IndicatorRecord[], period: IndicatorPeriod, now: Date): WeekBucket[] {
  if (records.length === 0) return []
  const lastWeek = startOfWeek(now)
  const firstRecordWeek = startOfWeek(
    new Date(Math.min(...records.map((record) => new Date(record.createdAt).getTime()))),
  )
  const firstWeek =
    period === '4s'
      ? new Date(lastWeek.getTime() - (RECENT_WEEKS - 1) * 7 * DAY_MS)
      : firstRecordWeek

  const buckets: WeekBucket[] = []
  for (let week = new Date(firstWeek); week <= lastWeek; week.setDate(week.getDate() + 7)) {
    const start = week.getTime()
    const end = start + 7 * DAY_MS
    buckets.push({
      start: week.toISOString(),
      label: `${String(week.getDate()).padStart(2, '0')}/${String(week.getMonth() + 1).padStart(2, '0')}`,
      value: records.filter((record) => {
        const time = new Date(record.createdAt).getTime()
        return time >= start && time < end
      }).length,
    })
  }
  return buckets
}

export function computeIndicators(
  records: IndicatorRecord[],
  filters: IndicatorFilters,
  now: Date = new Date(),
): Indicators {
  const visible = filterRecords(records, filters, now)
  const total = visible.length
  const complete = visible.filter((record) => record.hasPhoto && record.hasDescription).length
  const confirmations = visible.reduce((sum, record) => sum + record.confirmations, 0)

  const countBy = <K extends string>(key: (record: IndicatorRecord) => K) => {
    const counts = new Map<K, number>()
    for (const record of visible) counts.set(key(record), (counts.get(key(record)) ?? 0) + 1)
    return counts
  }
  const statusCounts = countBy((record) => record.status)
  const categoryCounts = countBy((record) => record.categoryId)
  const neighborhoodCounts = countBy((record) => record.neighborhood)

  return {
    total,
    withPhotoAndDescription: complete,
    withPhotoAndDescriptionShare: share(complete, total),
    confirmationsPerReport: total === 0 ? 0 : confirmations / total,
    byStatus: statuses.map((status) => {
      const value = statusCounts.get(status.id) ?? 0
      return { id: status.id, label: status.pluralLabel, value, share: share(value, total) }
    }),
    byCategory: categories
      .map((category) => {
        const value = categoryCounts.get(category.id) ?? 0
        return { id: category.id, label: category.label, value, share: share(value, total) }
      })
      .sort((a, b) => b.value - a.value),
    byNeighborhood: [...neighborhoodCounts.entries()]
      .map(([label, value]) => ({ label, value, share: share(value, total) }))
      .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
      .slice(0, TOP_NEIGHBORHOODS),
    weeks: buildWeeks(visible, filters.period, now),
  }
}
