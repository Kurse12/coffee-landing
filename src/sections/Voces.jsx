import Reveal from '../components/Reveal'

const VOCES = [
  {
    texto: 'Vengo desde que tenían dos mesas. Cambió el local, no cambió el café.',
    nombre: 'Malena Iriarte',
    rol: 'Viene al de Soho',
    ancho: 'lg:w-[92%]',
    offset: '',
  },
  {
    texto:
      'Pedí un filtrado a las ocho de la mañana y me preguntaron con qué método lo quería. No pasa en ningún lado.',
    nombre: 'Tomás Bustos',
    rol: 'Vecino de Recoleta',
    ancho: 'lg:w-full',
    offset: 'lg:mt-16 lg:ml-auto',
  },
  {
    texto: 'Las cookies se terminan antes del mediodía. Es un problema mío, no de ellos.',
    nombre: 'Sofía Etchegaray',
    rol: 'Trabaja en el de Hollywood',
    ancho: 'lg:w-[86%]',
    offset: 'lg:-mt-6',
  },
]

/*
  Testimonios sin caja: hairline arriba y aire alrededor. Los anchos y los
  desfases verticales cambian entre columnas para que no lean como tres tarjetas
  iguales en fila. En mobile todo colapsa a una columna sin offsets.
*/
export default function Voces() {
  return (
    <section id="voces" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal as="h2" className="display-xl max-w-[12ch] text-[clamp(2.4rem,6vw,4.6rem)]">
          Y la gente <span className="text-accent">vuelve</span>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-3">
          {VOCES.map((v, i) => (
            <Reveal
              key={v.nombre}
              delay={i * 0.08}
              className={`border-t border-hairline pt-7 ${v.ancho} ${v.offset}`}
            >
              <blockquote className="text-xl leading-snug text-ink lg:text-[1.4rem]">
                &ldquo;{v.texto}&rdquo;
              </blockquote>
              <footer className="mt-6">
                <p className="font-display text-lg uppercase leading-none tracking-tight">
                  {v.nombre}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.16em] text-ink-faint">
                  {v.rol}
                </p>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
