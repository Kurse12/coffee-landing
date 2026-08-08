import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import BordeDeError from './BordeDeError'

// three y R3F pesan unos 250 kB comprimidos: van en su propio chunk para no
// demorar el primer render.
const Crema = lazy(() => import('./Crema'))

const hayWebGL = () => {
  try {
    const ctx = document.createElement('canvas').getContext('webgl2')
    // El contexto de prueba se suelta enseguida: el navegador permite unos
    // pocos simultaneos y dejarlo colgado le roba uno al canvas de verdad.
    ctx?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!ctx
  } catch {
    return false
  }
}

/*
  Fondo animado del hero: la superficie de un cafe revuelto. El shader vive en
  Crema.jsx; aca esta todo lo que hace falta para que conviva con la pagina.

  El fondo NO lleva el acento rojo, y es a proposito. Lo llevaba por herencia
  del shader de seda anterior, que se tiño con el acento porque la paleta es
  negro mas un rojo. Pero el rojo tiene que significar algo en los botones y en
  la linea roja del titular: si tambien pinta el fondo, aparece en todos lados y
  por eso significa menos. Ahora el fondo va en tonos de cafe (espresso, tueste,
  crema) y el acento queda solo donde decide algo.

  Los tres tonos salen de la foto de la taza, o sea que la pagina ya los venia
  mostrando sin nombrarlos, y viven como tokens en index.css porque el halo de
  atras de la taza usa el mismo.

  Tres cosas que resuelve el envoltorio, ademas de dibujar:

  1. Contraste. El titular tiene una linea en rojo, y rojo sobre rojo no llega a
     ratio legible. El velo de arriba deja el fondo a la vista del lado de la
     foto y lleva la columna de texto casi a negro puro.
  2. Costo. Es un shader a pantalla completa corriendo siempre. Se monta solo
     mientras el hero esta en pantalla y se desmonta al salir, asi el resto de
     la pagina no paga nada. En pantallas tactiles ademas baja a dpr 1.
  3. Degradacion. Sin WebGL, con el canvas caido, o con menos movimiento pedido,
     no se dibuja nada y el hero se queda con su halo de siempre.
*/
export default function FondoCrema() {
  const caja = useRef(null)
  const reduce = useReducedMotion()

  const [aLaVista, setALaVista] = useState(false)
  const [caido, setCaido] = useState(false)
  const [visible, setVisible] = useState(false)
  const [permitido] = useState(hayWebGL)
  const [tactil] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  const activo = !reduce && permitido && !caido

  useEffect(() => {
    if (!activo || !caja.current) return

    const io = new IntersectionObserver(
      ([entrada]) => setALaVista(entrada.isIntersecting),
      { rootMargin: '120px' },
    )
    io.observe(caja.current)

    return () => io.disconnect()
  }, [activo])

  // Aparece con una fundida en vez de aparecer de golpe cuando resuelve el chunk.
  useEffect(() => {
    if (!aLaVista) return
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [aLaVista])

  return (
    <div ref={caja} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {activo && aLaVista && (
        <BordeDeError onError={() => setCaido(true)}>
          <Suspense fallback={null}>
            {/*
              Dial principal. La crema es textura de fondo, no un campo de
              color: pasado cierto valor el hero se vuelve un lavado rojo de
              tono medio y la taza blanca y el titular rojo pierden separacion,
              porque quedan sobre algo del mismo valor que ellos.

              Va bastante mas alto que el 30% que llevaba la seda por dos
              razones: este shader es mas oscuro de por si (tiene viñeta propia
              y el patron pasa la mayor parte del tiempo en la mitad baja del
              rango), y los tonos de cafe son menos saturados que el rojo que
              habia antes, asi que al mismo valor se leen mas apagados.

              El techo no lo pone el gusto sino el titular rojo. Por eso el velo
              de abajo cierra mas fuerte sobre la columna de texto: el lado de
              la foto puede aguantar mucho mas que el lado donde hay que leer.
            */}
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${
                visible ? 'opacity-75' : 'opacity-0'
              }`}
            >
              {/* Los tonos vienen de los tokens --color-espresso / -tueste /
                  -crema, que Crema lee por su cuenta. */}
              <Crema speed={1.15} scale={2.6} dpr={tactil ? 1 : [1, 1.5]} />
            </div>
          </Suspense>
        </BordeDeError>
      )}

      {/*
        Velo de legibilidad. En movil el texto ocupa todo el ancho, asi que va
        parejo; en desktop se abre del lado de la foto y cierra sobre la columna
        de texto.

        Sube un poco respecto de lo que llevaba con la seda porque el fondo de
        cafe es mas claro en su extremo alto. Ojo con creer que este velo
        gobierna todo el contraste del hero: el halo de atras de la taza se
        pinta por encima, asi que no pasa por aca. Ese se controla en Hero.jsx.
      */}
      <div className="absolute inset-0 bg-void/66 lg:bg-transparent lg:bg-linear-to-r lg:from-void/5 lg:via-void/76 lg:to-void/94" />

      {/* Corta el fondo contra la banda que sigue, para que no quede un filo. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-void" />
    </div>
  )
}
