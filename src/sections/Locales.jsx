import { lazy, Suspense, useState } from 'react'
import { ArrowUpRight, Clock, MapPin } from '@phosphor-icons/react'
import Reveal from '../components/Reveal'
import { LOCALES } from '../lib/locales'

const Mapa = lazy(() => import('./Mapa'))

/*
  El mapa es la funcionalidad de la seccion, no una decoracion: elegir un local
  a la izquierda mueve la camara a la derecha, y clickear un pin selecciona la
  ficha. Carga diferida, con un esqueleto de la misma forma mientras tanto.
*/
export default function Locales() {
  const [activo, setActivo] = useState(LOCALES[0].id)

  return (
    <section id="locales" className="relative border-t border-hairline py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal as="h2" className="display-xl max-w-[13ch] text-[clamp(2.4rem,6vw,4.6rem)]">
          Tres locales, <span className="text-accent">un solo tostado</span>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <Reveal className="flex flex-col gap-3">
            {/*
              La ficha no es un <button> entero: el link a Maps quedaria anidado
              dentro y eso es HTML invalido, ademas de dar taps erraticos en
              touch. Selecciona el bloque de arriba; el link vive afuera.
            */}
            {LOCALES.map((l) => {
              const on = l.id === activo
              return (
                <div
                  key={l.id}
                  className={`rounded-card border p-6 transition-colors duration-300 ${
                    on
                      ? 'border-accent bg-surface-2'
                      : 'border-hairline bg-surface hover:border-ink-faint'
                  }`}
                >
                  <button
                    onClick={() => setActivo(l.id)}
                    aria-pressed={on}
                    className="w-full text-left"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="font-display text-2xl leading-none tracking-tight uppercase">
                        {l.barrio}
                      </span>
                      <MapPin
                        size={20}
                        weight={on ? 'fill' : 'regular'}
                        className={`shrink-0 ${on ? 'text-accent-soft' : 'text-ink-faint'}`}
                      />
                    </span>

                    <span className="mt-2 block text-sm text-ink-soft">{l.calle}</span>
                    <span className="mt-4 flex items-start gap-2 text-xs text-ink-faint">
                      <Clock size={14} className="mt-px shrink-0" />
                      {l.horario}
                    </span>
                  </button>

                  {on && (
                    <>
                      <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-ink-soft">
                        {l.nota}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${l.coords[0]},${l.coords[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2.5 text-xs font-semibold tracking-wide text-ink uppercase transition-colors hover:border-accent"
                      >
                        Abrir en Maps
                        <ArrowUpRight size={14} weight="bold" />
                      </a>
                    </>
                  )}
                </div>
              )
            })}
          </Reveal>

          <Reveal
            delay={0.1}
            className="relative min-h-[420px] overflow-hidden rounded-card border border-hairline bg-surface lg:min-h-[560px]"
          >
            <Suspense
              fallback={<div className="absolute inset-0 animate-pulse bg-surface-2" aria-hidden />}
            >
              <Mapa activo={activo} onSelect={setActivo} />
            </Suspense>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
