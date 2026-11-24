export function formatProtocol(sequence: number): string {
  return `#RES-${String(sequence).padStart(4, '0')}`
}
