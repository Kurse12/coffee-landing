import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'motion/react'
import { gsap, ScrollTrigger } from './gsap'

let instance = null

/**
 * Navegacion por anclas. Usa Lenis si esta activo, si no cae al scroll nativo
 * (que es lo que pasa bajo prefers-reduced-motion).
 */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (instance) instance.scrollTo(el, { offset: -72 })
  else el.scrollIntoView({ block: 'start' })
}

/**
 * Congela el scroll mientras hay una capa encima (el menu mobile abierto).
 * Con Lenis montado alcanza con pararlo; sin Lenis (reduced-motion) se corta
 * por CSS sobre el elemento raiz, que es el que scrollea de verdad.
 */
export function lockScroll(locked) {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
    return
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/**
 * Monta Lenis una sola vez y lo casa con ScrollTrigger: Lenis pasa a ser la
 * fuente de verdad del scroll, y GSAP recalcula sus triggers en su propio tick.
 * Sin esto, cualquier seccion con pin queda desfasada del scroll suavizado.
 */
export function useSmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    /*
      Los dos numeros que definen el tacto del scroll:

      lerp: cuanto se acerca a la posicion real en cada frame. Es el suavizado.
        0.05  arrastrado, muy cinematografico
        0.18  actual: se siente rapido y todavia suaviza
        0.35  practicamente nativo, casi sin inercia
        1     desactiva el suavizado por completo

      wheelMultiplier: cuanto avanza por cada golpe de rueda, contra el nativo.
        Abajo de 1 frena, arriba de 1 acelera. En 1.2 una rueda recorre un 20%
        mas que en una pagina normal.

      Solo afecta rueda y teclado: el tactil sigue siendo nativo (syncTouch
      viene apagado por defecto y conviene dejarlo asi, sincronizarlo pelea con
      el momentum del sistema).
    */
    const lenis = new Lenis({
      lerp: 0.18,
      wheelMultiplier: 1.2,
      smoothWheel: true,
    })
    instance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      instance = null
    }
  }, [reduce])
}
