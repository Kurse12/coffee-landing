import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import BordeDeError from './BordeDeError'

// three y R3F pesan unos 250 kB comprimidos: van en su propio chunk para no
// demorar el primer render.
const Silk = lazy(() => import('./Silk'))

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
  Fondo de seda animado para el hero.

  El color es #99201d, que es el token accent-deep de la paleta. Vale la pena
  entender por que ese y no el rojo pleno: el shader devuelve color * patron,
  con el patron entre 0.2 y 1.0, asi que el tono elegido es el punto MAS claro
  que va a aparecer en pantalla. Con el accent normal (#cc2a26) los brillos de
  la seda competirian con los botones y con el titular rojo, que son los dos
  lugares donde ese rojo tiene que significar algo.

  Tres cosas que resuelve el envoltorio, ademas de dibujar:

  1. Contraste. El titular tiene una linea en rojo, y rojo sobre rojo no llega a
     ratio legible. El velo de arriba deja la seda a la vista del lado de la
     foto y lleva la columna de texto casi a negro puro.
  2. Costo. Es un shader a pantalla completa corriendo siempre. Se monta solo
     mientras el hero esta en pantalla y se desmonta al salir, asi el resto de
     la pagina no paga nada. En pantallas tactiles ademas baja a dpr 1.
  3. Degradacion. Sin WebGL, con el canvas caido, o con menos movimiento pedido,
     no se dibuja nada y el hero se queda con su halo de siempre.
*/
export default function FondoSilk() {
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
              Al 30% y no al 70%. La seda es textura de fondo, no un campo de
              color: por encima de ese valor el hero se vuelve un lavado rojo de
              tono medio y la taza blanca y el titular rojo pierden separacion,
              porque quedan sobre algo del mismo valor que ellos.
            */}
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${
                visible ? 'opacity-30' : 'opacity-0'
              }`}
            >
              <Silk
                color="#99201d"
                speed={2.4}
                scale={1.15}
                noiseIntensity={1.1}
                rotation={0.35}
                dpr={tactil ? 1 : [1, 1.5]}
              />
            </div>
          </Suspense>
        </BordeDeError>
      )}

      {/* Velo de legibilidad, ahora mas liviano porque la seda ya viene baja.
          En movil el texto ocupa todo el ancho, asi que va parejo; en desktop
          se abre del lado de la foto y cierra sobre la columna de texto. */}
      <div className="absolute inset-0 bg-void/45 lg:bg-transparent lg:bg-linear-to-r lg:from-void/10 lg:via-void/45 lg:to-void/85" />

      {/* Corta la seda contra la banda que sigue, para que no quede un filo. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-void" />
    </div>
  )
}
