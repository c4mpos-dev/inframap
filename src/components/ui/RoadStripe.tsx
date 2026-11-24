interface RoadStripeProps {
  className?: string
}

export function RoadStripe({ className = '' }: RoadStripeProps) {
  return (
    <div aria-hidden="true" className={`relative h-12 bg-asfalto-2 ${className}`}>
      <div className="absolute inset-x-0 top-[21px] h-1.5 road-stripe-x" />
    </div>
  )
}
