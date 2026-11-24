import { describe, expect, it } from 'vitest'
import { makeOccurrence } from '@/test/makeOccurrence'
import { buildTimeline } from './buildTimeline'

const states = (steps: ReturnType<typeof buildTimeline>) =>
  Object.fromEntries(steps.map((step) => [step.key, step.state]))

describe('buildTimeline', () => {
  it('relato novo: só a etapa registrada está feita', () => {
    const steps = buildTimeline(makeOccurrence({ confirmations: 2 }))
    expect(states(steps)).toEqual({
      registrada: 'done',
      confirmada: 'pending',
      andamento: 'pending',
      resolvida: 'pending',
    })
    expect(steps[1]?.detail).toBe('Faltam 3 confirmações para a vizinhança assinar embaixo')
  })

  it('usa o singular quando falta uma confirmação', () => {
    const steps = buildTimeline(makeOccurrence({ confirmations: 4 }))
    expect(steps[1]?.detail).toBe('Falta 1 confirmação para a vizinhança assinar embaixo')
  })

  it('cinco confirmações marcam a vizinhança como feita', () => {
    const steps = buildTimeline(makeOccurrence({ confirmations: 5 }))
    expect(steps[1]?.state).toBe('done')
    expect(steps[1]?.detail).toBe('Passou de 5 confirmações')
  })

  it('em andamento sem confirmações pula a etapa da vizinhança', () => {
    const steps = buildTimeline(
      makeOccurrence({
        status: 'andamento',
        events: [{ kind: 'andamento', at: '2026-11-12T10:00:00.000Z', note: 'Repassado.' }],
      }),
    )
    expect(states(steps)).toEqual({
      registrada: 'done',
      confirmada: 'skipped',
      andamento: 'current',
      resolvida: 'pending',
    })
    expect(steps[2]?.detail).toBe('Repassado.')
  })

  it('usa o órgão encaminhado quando o andamento não tem nota', () => {
    const steps = buildTimeline(
      makeOccurrence({ status: 'andamento', forwardedTo: 'Prefeitura · Obras' }),
    )
    expect(steps[2]?.detail).toBe('Repassada para Prefeitura · Obras')
  })

  it('resolvida deixa todas as etapas feitas, sem nenhuma atual', () => {
    const steps = buildTimeline(
      makeOccurrence({
        status: 'resolvida',
        confirmations: 6,
        events: [{ kind: 'resolvida', at: '2026-11-20T10:00:00.000Z', note: 'Tapado.' }],
      }),
    )
    expect(steps.map((step) => step.state)).toEqual(['done', 'done', 'done', 'done'])
    expect(steps[3]?.detail).toBe('Tapado.')
  })

  it('usa o evento mais recente quando há repetidos', () => {
    const steps = buildTimeline(
      makeOccurrence({
        status: 'andamento',
        events: [
          { kind: 'andamento', at: '2026-11-11T10:00:00.000Z', note: 'Primeiro.' },
          { kind: 'andamento', at: '2026-11-13T10:00:00.000Z', note: 'Segundo.' },
        ],
      }),
    )
    expect(steps[2]?.detail).toBe('Segundo.')
  })
})
