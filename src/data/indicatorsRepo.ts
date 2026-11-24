import type { IndicatorRecord } from '@/domain/indicators'
import type { CategoryId, StatusId } from '@/domain/types'
import { getSupabase, unwrap } from '@/lib/supabaseClient'

export interface IndicatorSource {
  records: IndicatorRecord[]
  registeredResidents: number
  isSample: boolean
}

interface IndicatorRow {
  created_at: string
  status: StatusId
  category_id: CategoryId
  neighborhood: string
  has_photo: boolean
  has_description: boolean
  confirmations: number
}

export const indicatorsRepo = {
  async load(): Promise<IndicatorSource> {
    const supabase = getSupabase()
    const [rows, residents] = await Promise.all([
      supabase.from('indicator_records').select('*'),
      supabase.rpc('registered_residents'),
    ])
    return {
      records: (unwrap(rows) as IndicatorRow[]).map((row) => ({
        createdAt: row.created_at,
        status: row.status,
        categoryId: row.category_id,
        neighborhood: row.neighborhood,
        hasPhoto: row.has_photo,
        hasDescription: row.has_description,
        confirmations: row.confirmations,
      })),
      registeredResidents: unwrap(residents) as number,
      isSample: false,
    }
  },
}
