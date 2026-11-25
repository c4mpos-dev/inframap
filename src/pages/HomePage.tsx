import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { MAIN_CONTENT_ID } from '@/components/layout/mainContent'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Reveal } from '@/components/ui/Reveal'
import { EncountersSection } from '@/features/home/components/EncountersSection'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import { HomeHero } from '@/features/home/components/HomeHero'
import { HowItWorks } from '@/features/home/components/HowItWorks'
import { TeamSection } from '@/features/home/components/TeamSection'
import { WhatItIs } from '@/features/home/components/WhatItIs'

export default function HomePage() {
  const { hash } = useLocation()

  // Links like /#encontros arrive before the section exists; scroll once it renders.
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash])

  return (
    <div className="min-h-dvh bg-concreto">
      <div data-surface="dark" className="bg-asfalto text-concreto">
        <HomeHeader />
      </div>
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
        <HomeHero />
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <WhatItIs />
        </Reveal>
        <Reveal>
          <EncountersSection />
        </Reveal>
        <Reveal>
          <TeamSection />
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  )
}
