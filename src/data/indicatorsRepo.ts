import { toIndicatorRecord, type IndicatorRecord } from '@/domain/indicators'
import { buildIndicatorSample, SAMPLE_REGISTERED_RESIDENTS } from './mock/indicatorSample'
import { occurrencesRepo } from './occurrencesRepo'

export interface IndicatorSource {
  records: IndicatorRecord[]
  registeredResidents: number
  isSample: boolean
}

export const indicatorsRepo = {
  async load(): Promise<IndicatorSource> {
    const occurrences = await occurrencesRepo.list()
    return {
      records: [...occurrences.map(toIndicatorRecord), ...buildIndicatorSample()],
      registeredResidents: SAMPLE_REGISTERED_RESIDENTS,
      isSample: true,
    }
  },
}
