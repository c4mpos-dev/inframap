export function MapUnavailable() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-mapa-fundo p-6">
      <div className="flex max-w-xs flex-col gap-2 rounded-card border-2 border-asfalto bg-branco p-5 shadow-hard">
        <strong className="text-lg font-extrabold">O mapa não carregou</strong>
        <p className="text-sm text-carvao">
          Falta configurar o token do Mapbox (<code className="font-mono">VITE_MAPBOX_TOKEN</code>).
          A lista de relatos continua funcionando.
        </p>
      </div>
    </div>
  )
}
