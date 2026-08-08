import { useEffect } from 'react'
import { IconContext } from '@phosphor-icons/react'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import Origen from './sections/Origen'
import Carta from './sections/Carta'
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
      <div className="grain relative">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Origen />
          <Carta />
          <Ritual />
          <Locales />
          <Voces />
        </main>
        <Cierre />
      </div>
    </IconContext.Provider>
  )
}
