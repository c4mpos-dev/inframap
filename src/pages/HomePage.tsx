import { SiteFooter } from '@/components/layout/SiteFooter'
import { EncountersSection } from '@/features/home/components/EncountersSection'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import { HomeHero } from '@/features/home/components/HomeHero'
import { HowItWorks } from '@/features/home/components/HowItWorks'
import { TeamSection } from '@/features/home/components/TeamSection'
import { WhatItIs } from '@/features/home/components/WhatItIs'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-concreto">
      <div data-surface="dark" className="bg-asfalto text-concreto">
        <HomeHeader />
      </div>
      <main>
        <HomeHero />
        <HowItWorks />
        <WhatItIs />
        <EncountersSection />
        <TeamSection />
      </main>
      <SiteFooter />
    </div>
  )
}
