import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { CAR, PAINTS, RIMS, VIEWS, type Mode, type Paint, type Rim } from '../data'

export function Loader() {
  const { progress, active } = useProgress()
  const [gone, setGone] = useState(false)
  const done = !active && progress >= 100
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setGone(true), 900)
    return () => clearTimeout(t)
  }, [done])
  if (gone) return null
  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-bg transition-opacity duration-700 ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-56 text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-muted uppercase">Preparando o showroom</p>
        <div className="mt-4 h-px w-full overflow-hidden bg-line">
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 font-mono text-xs text-fg tabular-nums">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  )
}

export function PrimaryButton({ children, href = '#test-drive', className = '' }: { children: React.ReactNode; href?: string; className?: string }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-[0_8px_30px_-8px] shadow-accent/60 transition hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
    </a>
  )
}

export function Nav({ mode, onToggleMode }: { mode: Mode; onToggleMode: () => void }) {
  const links = [
    ['Modelo', '#top'],
    ['Detalhes', '#detalhes'],
    ['Ficha técnica', '#ficha'],
    ['Test drive', '#test-drive'],
  ]
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full py-2 pr-2 pl-5">
        <a href="#top" className="display text-xs font-extrabold tracking-tight whitespace-nowrap uppercase sm:text-sm">
          {CAR.brand}
          <span className="text-accent">.</span>
        </a>
        <ul className="hidden items-center gap-7 text-[13px] text-muted lg:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="transition-colors hover:text-fg">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMode}
            className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
            aria-label={mode === 'night' ? 'Mudar para iluminação de estúdio' : 'Mudar para iluminação noturna'}
            title={mode === 'night' ? 'Estúdio' : 'Noite'}
          >
            {mode === 'night' ? <SunIcon /> : <MoonIcon />}
          </button>
          <PrimaryButton className="!px-4 !py-2 text-[13px] whitespace-nowrap">
            <span className="hidden sm:inline">Agendar test drive</span>
            <span className="sm:hidden">Agendar</span>
          </PrimaryButton>
        </div>
      </nav>
    </header>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2.5 font-mono text-[10px] tracking-[0.22em] text-muted uppercase">{children}</p>
}

type Tab = 'paint' | 'rim' | 'camera'
const TABS: [Tab, string][] = [
  ['paint', 'Pintura'],
  ['rim', 'Rodas'],
  ['camera', 'Câmera'],
]

export function Configurator(props: {
  paint: Paint
  rim: Rim
  viewId: string | null
  autoRotate: boolean
  onPaint: (p: Paint) => void
  onRim: (r: Rim) => void
  onView: (id: string) => void
  onAutoRotate: (v: boolean) => void
}) {
  // On small screens only one group shows at a time so the car stays visible.
  const [tab, setTab] = useState<Tab>('paint')
  const show = (t: Tab) => (tab === t ? 'block' : 'hidden lg:block')

  return (
    <aside className="glass rise w-full rounded-3xl p-3 sm:p-5 lg:w-[320px]" style={{ animationDelay: '0.5s' }} aria-label="Configurador">
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-full border border-line p-1 lg:hidden" role="tablist">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full py-1.5 text-[11px] transition ${tab === id ? 'bg-fg text-bg' : 'text-muted'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={show('paint')}>
        <div className="flex items-baseline justify-between">
          <Label>Pintura</Label>
          <span className="text-xs text-fg">{props.paint.name}</span>
        </div>
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1.5" role="radiogroup" aria-label="Cor da pintura">
          {PAINTS.map((p) => {
            const on = p.id === props.paint.id
            return (
              <button
                key={p.id}
                role="radio"
                aria-checked={on}
                aria-label={p.name}
                title={p.name}
                onClick={() => props.onPaint(p)}
                className={`relative size-8 shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${on ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : 'ring-1 ring-line hover:scale-105'}`}
                style={{
                  background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${p.hex} 55%, white) 0%, ${p.hex} 45%, color-mix(in oklab, ${p.hex} 70%, black) 100%)`,
                }}
              />
            )
          })}
        </div>
      </div>

      <div className={`${show('rim')} lg:mt-5`}>
        <div className="flex items-baseline justify-between">
          <Label>Rodas 20"</Label>
          <span className="text-xs text-fg">{props.rim.name}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Acabamento das rodas">
          {RIMS.map((r) => {
            const on = r.id === props.rim.id
            return (
              <button
                key={r.id}
                role="radio"
                aria-checked={on}
                onClick={() => props.onRim(r)}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[11px] transition focus-visible:outline-2 focus-visible:outline-accent ${on ? 'border-accent bg-accent/10 text-fg' : 'border-line text-muted hover:text-fg'}`}
              >
                <span className="size-3 shrink-0 rounded-full ring-1 ring-line" style={{ background: r.hex }} />
                <span className="truncate">{r.name.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={`${show('camera')} lg:mt-5`}>
        <div className="flex items-baseline justify-between">
          <Label>Câmera</Label>
          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-muted">
            Girar
            <input
              type="checkbox"
              className="peer sr-only"
              checked={props.autoRotate}
              onChange={(e) => props.onAutoRotate(e.target.checked)}
            />
            <span className="relative h-4 w-7 rounded-full bg-line transition peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent after:absolute after:top-0.5 after:left-0.5 after:size-3 after:rounded-full after:bg-fg after:transition peer-checked:after:translate-x-3" />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {VIEWS.map((v) => {
            const on = v.id === props.viewId
            return (
              <button
                key={v.id}
                onClick={() => props.onView(v.id)}
                aria-pressed={on}
                className={`rounded-xl border px-2 py-2 text-[11px] transition focus-visible:outline-2 focus-visible:outline-accent ${on ? 'border-accent bg-accent/10 text-fg' : 'border-line text-muted hover:border-fg/30 hover:text-fg'}`}
              >
                {v.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 hidden items-end justify-between border-t border-line pt-4 lg:flex">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">A partir de</p>
          <p className="display mt-1 text-lg font-bold">{CAR.price}</p>
        </div>
        <PrimaryButton className="!px-4 !py-2 text-[12px]">Reservar</PrimaryButton>
      </div>
    </aside>
  )
}

export function StickyCta({ visible, paint, rim }: { visible: boolean; paint: Paint; rim: Rim }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
      inert={!visible}
    >
      <div className="glass flex w-full max-w-xl items-center gap-3 rounded-full py-2 pr-2 pl-3 shadow-2xl shadow-black/30">
        <span className="size-7 shrink-0 rounded-full ring-1 ring-line" style={{ background: paint.hex }} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-medium">
            {CAR.brand} {CAR.model}
          </p>
          <p className="truncate text-[11px] text-muted">
            {paint.name} · {rim.name} · {CAR.price}
          </p>
        </div>
        <PrimaryButton className="shrink-0 !px-4 !py-2 text-[13px]" >
          <span className="hidden sm:inline">Agendar test drive</span>
          <span className="sm:hidden">Agendar</span>
        </PrimaryButton>
      </div>
    </div>
  )
}
