import { describe, expect, it } from 'vitest'
import { distanceInMeters, formatCoordinates } from './geo'
import { formatProtocol } from './protocol'
import { formatDistance, formatElapsed, formatRelativeDay } from './relativeTime'

describe('formatProtocol', () => {
  it('completa com zeros', () => {
    expect(formatProtocol(139)).toBe('#RES-0139')
    expect(formatProtocol(12345)).toBe('#RES-12345')
  })
})

describe('distanceInMeters', () => {
  it('é zero no mesmo ponto', () => {
    expect(distanceInMeters({ lat: -22.47, lng: -44.46 }, { lat: -22.47, lng: -44.46 })).toBe(0)
  })

  it('mede cerca de 111 m por milésimo de grau de latitude', () => {
    const meters = distanceInMeters({ lat: -22.47, lng: -44.46 }, { lat: -22.471, lng: -44.46 })
    expect(meters).toBeGreaterThan(110)
    expect(meters).toBeLessThan(112)
  })
})

describe('formatCoordinates', () => {
  it('usa 4 casas e o sinal de menos tipográfico', () => {
    expect(formatCoordinates({ lat: -22.47051, lng: -44.4635 })).toBe('−22.4705, −44.4635')
  })
})

describe('formatDistance', () => {
  it('arredonda metros de 10 em 10 e passa para km', () => {
    expect(formatDistance(3)).toBe('1 m')
    expect(formatDistance(44)).toBe('40 m')
    expect(formatDistance(1530)).toBe('1,5 km')
  })
})

describe('formatRelativeDay', () => {
  const now = new Date(2026, 10, 24, 15, 0)
  const at = (month: number, day: number, hour = 9) =>
    new Date(2026, month, day, hour).toISOString()

  it('fala hoje, ontem, dias, semanas e meses', () => {
    expect(formatRelativeDay(at(10, 24, 1), now)).toBe('hoje')
    expect(formatRelativeDay(at(10, 23, 23), now)).toBe('ontem')
    expect(formatRelativeDay(at(10, 20), now)).toBe('há 4 dias')
    expect(formatRelativeDay(at(10, 17), now)).toBe('há 1 semana')
    expect(formatRelativeDay(at(10, 3), now)).toBe('há 3 semanas')
    expect(formatRelativeDay(at(9, 20), now)).toBe('há 1 mês')
  })
})

describe('formatElapsed', () => {
  const now = new Date('2026-11-24T15:00:00.000Z')
  const ago = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString()

  it('usa a unidade certa', () => {
    expect(formatElapsed(ago(0), now)).toBe('1 min')
    expect(formatElapsed(ago(59), now)).toBe('59 min')
    expect(formatElapsed(ago(120), now)).toBe('2 h')
    expect(formatElapsed(ago(60 * 24), now)).toBe('1 dia')
    expect(formatElapsed(ago(60 * 24 * 15), now)).toBe('2 sem')
  })
})
