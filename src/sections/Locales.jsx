import { lazy, Suspense, useState } from 'react'
import { ArrowUpRight, Clock, MapPin } from '@phosphor-icons/react'
import Reveal from '../components/Reveal'
import { LOCALES } from '../lib/locales'

const Mapa = lazy(() => import('./Mapa'))

/*
  El mapa es la funcionalidad de la seccion, no una decoracion: elegir un local
  mueve la camara, y clickear un pin selecciona la ficha. Carga diferida, con un
  esqueleto de la misma forma mientras tanto.

  Por eso el mapa tiene que estar a la vista cuando se elige, en los dos anchos:
  en desktop vive al lado de las fichas, y en mobile queda pegado arriba
  mientras ellas pasan por debajo.
*/
export default function Locales() {
  const [activo, setActivo] = useState(LOCALES[0].id)

  return (
    <section id="locales" className="relative border-t border-hairline py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal as="h2" className="display-xl max-w-[13ch] text-[clamp(2.4rem,6vw,4.6rem)]">
          Tres locales, <span className="text-accent">un solo tostado</span>
        </Reveal>

        {/*
          En mobile es una columna flex y no una grilla, y eso no es cosmetico:
          el mapa va pegado (sticky) arriba mientras las fichas pasan por
          debajo, y para que el sticky tenga recorrido necesita compartir
          contenedor con ellas. En una grilla de una columna cada fila es su
          propio bloque contenedor y el mapa no tendria donde pegarse.

          Antes el mapa iba ultimo: tocar "Recoleta" movia una camara que
          estaba 420 px mas abajo, o sea que en el dispositivo donde vive la
          mayor parte de la audiencia la funcionalidad de la seccion no
          existia.
        */}
        <div className="mt-14 flex flex-col gap-6 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/*
            La banda opaca no es decoracion. Sin ella las fichas se ven asomar
            por las esquinas redondeadas del mapa mientras pasan por debajo, y
            el borde de acento de la activa aparece a los costados: se lee como
            superposicion rota en vez de capa. El bg-void las tapa contra el
            borde inferior del nav, que es donde arranca el pegado.
          */}
          <div className="sticky top-[68px] z-10 order-1 bg-void py-3 lg:static lg:z-auto lg:order-2 lg:bg-transparent lg:py-0">
            <Reveal
              delay={0.1}
              className="relative h-[42vh] min-h-[260px] overflow-hidden rounded-card border border-hairline bg-surface lg:h-full lg:min-h-[560px]"
            >
              <Suspense
                fallback={
                  <div className="absolute inset-0 animate-pulse bg-surface-2" aria-hidden />
                }
              >
                <Mapa activo={activo} onSelect={setActivo} />
              </Suspense>
            </Reveal>
          </div>

          <Reveal className="order-2 flex flex-col gap-3 lg:order-1">
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
                  {/* aria-current y no aria-pressed: pressed describe un
                      interruptor que se prende y se apaga solo, y esto es una
                      seleccion unica entre tres. Con pressed el lector dice
                      "no presionado" en los otros dos locales, como si se
                      pudieran activar todos a la vez. */}
                  <button
                    onClick={() => setActivo(l.id)}
                    aria-current={on ? 'true' : undefined}
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
                    {/* El horario es el dato mas operativo de la pagina y era
                        el texto menos legible: estaba en ink-faint a 12 px,
                        3.02:1 sobre esta superficie. Se lee con el telefono al
                        sol y con una mano. */}
                    <span className="mt-4 flex items-start gap-2 text-[13px] text-ink-soft">
                      <Clock size={14} className="mt-0.5 shrink-0" />
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
        </div>
      </div>
    </section>
  )
}
