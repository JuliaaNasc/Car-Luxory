import { useEffect, useRef, useState } from 'react'
import { CAR, PAINTS, RIMS, SPECS, VIEWS, type Mode } from './data'
import { Scene } from './components/Scene'
import { Configurator, Loader, Nav, StickyCta } from './components/Ui'
import { Details, Footer, Specs, TestDrive } from './components/Sections'

export default function App() {
  const [mode, setMode] = useState<Mode>(() =>
    new URLSearchParams(window.location.search).get('mode') === 'studio' ? 'studio' : 'night',
  )
  const [paint, setPaint] = useState(PAINTS[0])
  const [rim, setRim] = useState(RIMS[0])
  const [view, setView] = useState({ v: VIEWS[0], n: 0 })
  const [activeView, setActiveView] = useState<string | null>(VIEWS[0].id)
  const [autoRotate, setAutoRotate] = useState(true)
  const [heroVisible, setHeroVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const hero = useRef<HTMLElement>(null)

  useEffect(() => {
    document.documentElement.dataset.mode = mode
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'night' ? '#08080a' : '#e8e6e2')
  }, [mode])

  useEffect(() => {
    const el = hero.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.35)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const goTo = (id: string) => {
    const v = VIEWS.find((x) => x.id === id)!
    setView((s) => ({ v, n: s.n + 1 }))
    setActiveView(id)
    if (id !== 'hero') setAutoRotate(false)
  }

  return (
    <>
      <Loader />
      <Nav mode={mode} onToggleMode={() => setMode((m) => (m === 'night' ? 'studio' : 'night'))} />

      <main id="top">
        <section ref={hero} className="relative h-[100svh] min-h-[640px] overflow-hidden" aria-label="Showroom 3D">
          <div className="absolute inset-0">
            <Scene
              mode={mode}
              paint={paint}
              rim={rim}
              view={view}
              autoRotate={autoRotate}
              active={heroVisible}
              onUserInteract={() => setActiveView(null)}
            />
          </div>

          {/* Cinematic vignette + fade into the page */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_55%,var(--bg)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />

          <div className="pointer-events-none relative mx-auto flex h-full max-w-7xl flex-col justify-between px-4 pt-28 pb-6 sm:px-6 lg:pb-10">
            <div className="rise">
              <p className="font-mono text-[11px] tracking-[0.3em] text-muted uppercase">
                Coleção {CAR.year} · Nº 07
              </p>
              <h1 className="display text-gradient mt-3 w-fit text-[clamp(2.4rem,10.5vw,6.25rem)] leading-[0.9] font-extrabold uppercase">
                Car
                <br />
                Luxury
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                {CAR.brand} {CAR.model}. Configure em tempo real, gire o carro com o mouse ou o dedo e aproxime cada detalhe.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <dl className="rise hidden gap-8 lg:flex" style={{ animationDelay: '0.3s' }}>
                {SPECS.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{s.label}</dt>
                    <dd className="display mt-1 text-2xl font-bold tabular-nums">
                      {s.value}
                      <span className="ml-1 font-sans text-xs font-normal text-muted">{s.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="pointer-events-auto">
                <Configurator
                  paint={paint}
                  rim={rim}
                  viewId={activeView}
                  autoRotate={autoRotate}
                  onPaint={setPaint}
                  onRim={setRim}
                  onView={goTo}
                  onAutoRotate={setAutoRotate}
                />
              </div>
            </div>
          </div>

          <p className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-muted uppercase lg:block">
            Arraste para girar · Role para explorar
          </p>
        </section>

        <Details />
        <Specs />
        <TestDrive paint={paint} rim={rim} />
      </main>

      <Footer />
      <StickyCta visible={scrolled} paint={paint} rim={rim} />
    </>
  )
}
