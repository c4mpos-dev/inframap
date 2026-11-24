import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import type { ReportReason } from '@/domain/types'

const reasons: { value: ReportReason; label: string }[] = [
  { value: 'dados_pessoais', label: 'A foto mostra rosto, placa de carro ou dado pessoal' },
  { value: 'ofensivo', label: 'Texto ou foto ofensivo' },
  { value: 'nao_e_infraestrutura', label: 'Não é problema de infraestrutura' },
  { value: 'outro', label: 'Outro motivo' },
]

interface ReportDialogProps {
  onSubmit: (reason: ReportReason, details: string) => Promise<void>
  onClose: () => void
}

export function ReportDialog({ onSubmit, onClose }: ReportDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [reason, setReason] = useState<ReportReason | null>(null)
  const [details, setDetails] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!reason) return
    setSending(true)
    await onSubmit(reason, details.trim())
    setSending(false)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="report-title"
      onClose={onClose}
      className="m-auto w-110 max-w-[calc(100%-32px)] animate-rise rounded-card border-2 border-asfalto bg-concreto p-0 text-asfalto shadow-hard backdrop:bg-asfalto/60"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h2 id="report-title" className="text-xl font-extrabold">
            Denunciar este relato
          </h2>
          <p className="text-sm text-carvao">
            A equipe confere e tira do ar o que não pode ficar público.
          </p>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Motivo</legend>
          {reasons.map((option) => (
            <label
              key={option.value}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-control border-2 px-3.5 py-2.5 text-[15px] ${
                reason === option.value
                  ? 'border-asfalto bg-branco font-semibold'
                  : 'border-linha bg-branco'
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="size-4.5 accent-asfalto"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <label className="flex flex-col gap-2 text-sm font-bold">
          Quer contar mais? (opcional)
          <textarea
            rows={2}
            maxLength={300}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            className="resize-y rounded-[14px] border-2 border-[#CFC8B8] bg-branco p-3 text-[15px] font-normal outline-none focus:border-asfalto"
          />
        </label>
        <div className="flex gap-2.5">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="md"
            className="flex-1"
            disabled={!reason || sending}
          >
            {sending ? 'Enviando…' : 'Denunciar'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
