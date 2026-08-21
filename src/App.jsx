import { useEffect } from 'react'
import { IconContext } from '@phosphor-icons/react'
import Nav from './components/Nav'
import { DemoProvider } from './components/HojaDemo'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import Origen from './sections/Origen'
import CartaCompleta from './sections/CartaCompleta'
import Ritual from './sections/Ritual'
import Locales from './sections/Locales'
import Voces from './sections/Voces'
import Cierre from './sections/Cierre'
import { ScrollTrigger } from './lib/gsap'
import { useSmoothScroll } from './lib/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  // Las fotos entran despues del primer layout y corren las medidas de las
  // secciones con pin. Sin este refresh, el recorrido horizontal termina antes
  // o despues de donde deberia.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 600)
    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t)
    }
  }, [])

  return (
    <IconContext.Provider value={{ weight: 'regular', size: 20 }}>
      <DemoProvider>
        <div className="grain relative">
          {/*
            Antes de la barra hay ocho cosas enfocables. Con teclado, llegar al
            contenido pedia pasar por todas ellas en cada visita. El link vive
            fuera de pantalla hasta que recibe foco, que es cuando importa.
          */}
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
          >
            Ir al contenido
          </a>
          <Nav />
          {/* tabIndex -1: sin esto el salto mueve la vista pero no el foco, y
              el siguiente Tab vuelve al principio de la barra. Sin contorno,
              porque el foco cae en un contenedor de once pantallas y el anillo
              seria un rectangulo rojo alrededor de toda la pagina. */}
          <main id="contenido" tabIndex={-1} className="focus-visible:outline-none">
            <Hero />
            <Marquee />
            <Origen />
            <CartaCompleta />
            <Ritual />
            <Locales />
            <Voces />
          </main>
          <Cierre />
        </div>
      </DemoProvider>
    </IconContext.Provider>
  )
}
