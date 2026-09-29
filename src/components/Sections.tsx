import { useState } from 'react'
import { CAR, SPEC_TABLE, SPECS, type Paint, type Rim } from '../data'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] tracking-[0.3em] text-accent uppercase">{children}</p>
}

const DETAILS = [
  {
    n: '01',
    title: 'Aerodinâmica ativa',
    body: 'Flaps traseiros e difusor ajustam a pressão aerodinâmica em milissegundos, de acordo com velocidade, esterço e frenagem.',
  },
  {
    n: '02',
    title: 'V8 central-traseiro',
    body: 'Aspirado, com corte a 9.000 rpm e resposta imediata. Cárter seco para baixar o centro de gravidade em 15 mm.',
  },
  {
    n: '03',
    title: 'Cabine de piloto',
    body: 'Volante com todos os comandos principais, bancos em concha de carbono e couro costurado à mão cinza chumbo.',
  },
]

export function Details() {
  return (
    <section id="detalhes" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <Eyebrow>Detalhes</Eyebrow>
          <h2 className="display mt-4 text-3xl leading-[1.05] font-bold sm:text-4xl">
            Feito para
            <br />a estrada certa.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Cada peça foi desenhada em torno do motorista. Nada é decorativo: se está ali, trabalha.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {DETAILS.map((d) => (
            <article
              key={d.n}
              className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:opacity-100 sm:opacity-60" />
              <p className="font-mono text-xs text-muted">{d.n}</p>
              <h3 className="display mt-10 text-lg font-semibold">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{d.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Specs() {
  return (
    <section id="ficha" className="scroll-mt-24 border-y border-line">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <Eyebrow>Ficha técnica</Eyebrow>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
          {SPECS.map((s) => (
            <div key={s.label} className="bg-bg p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{s.label}</p>
              <p className="display mt-3 text-4xl font-bold tabular-nums sm:text-5xl">
                {s.value}
                <span className="ml-1.5 font-sans text-sm font-normal text-muted">{s.unit}</span>
              </p>
            </div>
          ))}
        </div>
        <dl className="mt-12 grid gap-x-12 sm:grid-cols-2">
          {SPEC_TABLE.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-4 text-sm">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

type Status = 'idle' | 'sending' | 'sent'

const inputCls =
  'w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 user-invalid:border-red-500/70 disabled:opacity-50'

export function TestDrive({ paint, rim }: { paint: Paint; rim: Rim }) {
  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState('')

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1100)
  }

  return (
    <section id="test-drive" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-32">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(60% 80% at 100% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%), radial-gradient(50% 60% at 0% 100%, color-mix(in oklab, ' +
              paint.hex +
              ' 30%, transparent), transparent 70%)',
          }}
        />
        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <Eyebrow>Test drive</Eyebrow>
            <h2 className="display mt-4 text-3xl leading-[1.05] font-bold sm:text-5xl">
              Sinta antes
              <br />
              de decidir.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Reserve uma sessão privada de 90 minutos com um especialista. Levamos a sua configuração para o showroom.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-line bg-bg/50 px-4 py-3">
              <span className="size-8 rounded-full ring-1 ring-line" style={{ background: paint.hex }} />
              <div className="text-xs leading-tight">
                <p className="text-fg">
                  {CAR.brand} {CAR.model}
                </p>
                <p className="mt-0.5 text-muted">
                  {paint.name} · {rim.name}
                </p>
              </div>
            </div>
          </div>

          {status === 'sent' ? (
            <div className="rise flex flex-col justify-center rounded-3xl border border-accent/40 bg-bg/60 p-8" role="status">
              <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-fg">✓</span>
              <h3 className="display mt-5 text-2xl font-bold">Pedido recebido{name ? `, ${name.split(' ')[0]}` : ''}.</h3>
              <p className="mt-3 text-sm text-muted">Um especialista entra em contato em até 24 horas para confirmar o horário.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 self-start text-sm text-accent underline-offset-4 hover:underline"
              >
                Fazer outro agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-xs text-muted">Nome completo</span>
                <input
                  required
                  minLength={3}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  placeholder="Como devemos chamar você"
                  disabled={status === 'sending'}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs text-muted">E-mail</span>
                <input required type="email" autoComplete="email" className={inputCls} placeholder="voce@email.com" disabled={status === 'sending'} />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs text-muted">Telefone</span>
                <input required type="tel" autoComplete="tel" pattern="[0-9()+\s-]{10,}" className={inputCls} placeholder="(11) 90000-0000" disabled={status === 'sending'} />
              </label>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-fg transition hover:brightness-110 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-80 sm:col-span-2"
              >
                {status === 'sending' ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-accent-fg/30 border-t-accent-fg" />
                    Enviando…
                  </>
                ) : (
                  'Confirmar agendamento'
                )}
              </button>
              <p className="text-[11px] text-muted sm:col-span-2">Sem compromisso.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pt-6 pb-28 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>
        © {new Date().getFullYear()} {CAR.brand}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
