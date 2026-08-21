import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Coffee, Cookie, Hamburger, TeaBag } from '@phosphor-icons/react'
import Reveal from '../components/Reveal'
import { MEDIA } from '../lib/media'

/*
  Icono por categoria, mismo patron "icono + label" que ya usa el boton
  Reservar del Nav -- no es un lenguaje visual nuevo, es el que ya existia
  aplicado a un segundo lugar. Es tambien la pieza mas reconocible de un
  rail de kiosco: cada pestana de categoria (Meals, McCafe, Desserts) se
  identifica por icono antes que por texto.
*/
const CATEGORIAS = [
  { id: 'cafe', label: 'Café', icon: Coffee },
  { id: 'sin-cafeina', label: 'Sin cafeína', icon: TeaBag },
  { id: 'pasteleria', label: 'Pastelería', icon: Cookie },
  { id: 'para-picar', label: 'Para picar', icon: Hamburger },
]

/* Dieciocho productos, cuatro categorías. */
const ITEMS = [
  {
    categoria: 'cafe',
    nombre: 'Espresso doble',
    precio: '$3.400',
    desc: '18 gramos adentro, 36 afuera. Blend de la casa, tostado medio.',
    foto: MEDIA.menu.espresso,
    alt: 'Café espresso en pocillo de porcelana sobre una mesada de mármol',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'cafe',
    nombre: 'Cortado',
    precio: '$3.800',
    desc: 'Espresso con un chorrito de leche entera, en vaso corto. Como se pide en cualquier bar de Almagro.',
    foto: MEDIA.menu.cortado,
    alt: 'Vaso corto de vidrio con café cortado sobre una mesa de madera',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'cafe',
    nombre: 'Flat white',
    precio: '$4.600',
    desc: 'Leche texturada corta, sin espuma de más. El pedido que más sale.',
    foto: MEDIA.menu.flatWhite,
    alt: 'Taza blanca con arte en la leche en forma de hoja, sobre su plato',
    w: 1024,
    h: 1024,
    destacado: true,
  },
  {
    categoria: 'cafe',
    nombre: 'Latte',
    precio: '$4.900',
    desc: 'Doble de espresso con leche vaporizada larga. El que más pide el que labura desde la notebook.',
    foto: MEDIA.menu.latte,
    alt: 'Taza de café con leche vista desde arriba sobre una mesa',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'cafe',
    nombre: 'Filtrado V60',
    precio: '$5.200',
    desc: 'Grano único de Jujuy, molido al momento. Tarda cuatro minutos.',
    foto: MEDIA.menu.v60,
    alt: 'Pava de cuello de cisne vertiendo agua sobre un filtro cónico apoyado en una jarra',
    w: 736,
    h: 1104,
  },
  {
    categoria: 'cafe',
    nombre: 'Cold brew',
    precio: '$5.100',
    desc: 'Reposa doce horas en frío. Se sirve con hielo y un toque de soda si lo pedís así.',
    foto: MEDIA.menu.coldBrew,
    alt: 'Vaso alto de vidrio con café frío y hielo',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'sin-cafeina',
    nombre: 'Té verde sencha',
    precio: '$3.300',
    desc: 'Hebras japonesas, infusión corta para que no amargue. Se sirve en tetera de dos pocillos.',
    foto: MEDIA.menu.teVerde,
    alt: 'Taza de cerámica blanca con té sobre una mesa de madera',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'sin-cafeina',
    nombre: 'Chai latte',
    precio: '$4.700',
    desc: 'Especias molidas acá: canela, cardamomo, jengibre. Con leche vaporizada, sin jarabe industrial.',
    foto: MEDIA.menu.chaiLatte,
    alt: 'Taza de chai latte con canela y anís estrella espolvoreados encima',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'sin-cafeina',
    nombre: 'Matcha latte',
    precio: '$5.300',
    desc: 'Matcha ceremonial batido a mano con bombilla de bambú. Leche de avena sin cargo.',
    foto: MEDIA.menu.matchaLatte,
    alt: 'Vaso de matcha latte helado sobre una mesa de madera',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'sin-cafeina',
    nombre: 'Manzanilla',
    precio: '$2.900',
    desc: 'Flor entera, no en saquitos. La pide la mesa de al lado del ventanal casi siempre.',
    foto: MEDIA.menu.manzanilla,
    alt: 'Taza de infusión de manzanilla sobre una mesa blanca',
    w: 1200,
    h: 1500,
    destacado: true,
  },
  {
    categoria: 'pasteleria',
    nombre: 'Medialuna de manteca',
    precio: '$1.800',
    desc: 'Amasada al lado. Se termina temprano casi todos los días.',
    foto: MEDIA.menu.medialuna,
    alt: 'Medialunas de manteca glaseadas, apiladas en una sartén de hierro',
    w: 736,
    h: 937,
    destacado: true,
  },
  {
    categoria: 'pasteleria',
    nombre: 'Cookie de chocolate',
    precio: '$3.900',
    desc: 'Horneada a las siete. Blanda en el centro, chocolate en trozos.',
    foto: MEDIA.menu.cookie,
    alt: 'Cookies de chocolate recién horneadas, con trozos derretidos y sal gruesa arriba',
    w: 680,
    h: 680,
  },
  {
    categoria: 'pasteleria',
    nombre: 'Scón de manteca',
    precio: '$3.400',
    desc: 'Se hornean en tandas de a doce, a la mañana. Con manteca y mermelada casera de ciruela.',
    foto: MEDIA.menu.scon,
    alt: 'Scón dorado recién horneado con pan de manteca al lado',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'pasteleria',
    nombre: 'Budín de limón',
    precio: '$3.700',
    desc: 'Ralladura de limón y almíbar por encima. Dura los tres días que tarda en irse.',
    foto: MEDIA.menu.budinLimon,
    alt: 'Budín de limón entero apoyado sobre papel manteca',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'pasteleria',
    nombre: 'Alfajor de maicena',
    precio: '$2.600',
    desc: 'Dulce de leche repostero entre dos tapas de maicena, coco alrededor. Receta de la abuela del dueño.',
    foto: MEDIA.menu.alfajor,
    alt: 'Alfajores de maicena apilados en un plato de cerámica',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'para-picar',
    nombre: 'Tostado de jamón y queso',
    precio: '$5.800',
    desc: 'Jamón cocido, queso cremoso, pan de campo tostado en plancha. El clásico de las cuatro de la tarde.',
    foto: MEDIA.menu.tostado,
    alt: 'Sándwich tostado de jamón y queso cortado por la mitad',
    w: 1200,
    h: 1500,
    destacado: true,
  },
  {
    categoria: 'para-picar',
    nombre: 'Bagel de palta y huevo',
    precio: '$6.400',
    desc: 'Bagel de sésamo, palta pisada con limón, huevo pochado. Se arma al momento, no antes.',
    foto: MEDIA.menu.bagel,
    alt: 'Bagel relleno con palta y huevo servido en un plato',
    w: 1200,
    h: 1500,
  },
  {
    categoria: 'para-picar',
    nombre: 'Tabla de quesos',
    precio: '$9.200',
    desc: 'Tres quesos de la zona con membrillo y nueces. Para compartir, aunque casi nadie lo hace.',
    foto: MEDIA.menu.tablaQuesos,
    alt: 'Tabla de madera con distintos quesos y fiambre',
    w: 1200,
    h: 1500,
  },
]

/*
  Grid estático con filtro por categoría: dieciocho productos no entran en un
  pin horizontal sin volverse tedioso. Es la carta unica de la pagina, para
  leer y decidir.

  Motion, no GSAP: el cambio de categoria es una reaccion a un click, no algo
  ligado al scroll, asi que cae del lado de Motion en la arquitectura de
  movimiento del sitio.

  Una sola grilla por categoria, sin cortar en sub-grupos: la pantalla de
  categoria de un kiosco nunca muestra un producto solo, es una grilla de
  2-3 columnas por 3 filas (6-9 tiles a la vez) que se lee como un bloque
  continuo, con scroll si hay mas. Partir el grid en sub-grupos con
  subtitulo en el medio (como hacia antes con Cafe y Pasteleria) rompe esa
  lectura en dos pantallas chicas en vez de una sola.
*/

export default function CartaCompleta() {
  const [activa, setActiva] = useState(CATEGORIAS[0].id)
  const reduce = useReducedMotion()
  /*
    El destacado va primero en su categoria, como en un kiosco -- el tile
    "mas pedido" siempre ocupa el primer lugar de la grilla, no uno al azar
    segun el orden en que se cargo el dato. Array.prototype.sort es estable
    en los motores modernos, asi que el resto de los items no cambia de
    orden entre si.
  */
  const items = ITEMS.filter((item) => item.categoria === activa).sort(
    (a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)
  )

  return (
    <section id="carta" className="relative border-t border-hairline py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal as="h2" className="display-xl max-w-[18ch] text-[clamp(2.4rem,6vw,4.6rem)]">
          La <span className="text-accent">carta</span>
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-[46ch] leading-relaxed text-ink-soft">
          Todo lo que sale de la barra y del horno, con precio y sin sorpresas.
        </Reveal>

        {/*
          Pegado bajo el nav (68px, ver Nav.jsx) al estilo del rail de
          categorias de un kiosco: queda siempre a mano mientras se scrollea
          el grid, en vez de perderse arriba como una etiqueta que solo se
          lee una vez. bg-void solido (no /90) por el mismo motivo que en
          Locales.jsx -- tiene que tapar el grid que pasa por detras, no
          transparentarse sobre el.
        */}
        <div className="sticky top-[68px] z-10 -mx-5 mt-10 border-b border-hairline bg-void px-5 py-4 lg:-mx-10 lg:px-10">
          <Reveal
            delay={0.14}
            role="group"
            aria-label="Categorías de la carta"
            className="flex flex-wrap gap-2.5"
          >
            {CATEGORIAS.map((c) => {
              const isActive = c.id === activa
              const Icon = c.icon
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiva(c.id)}
                  /* aria-current y no aria-pressed: mismo motivo que en
                     Locales.jsx -- esto es una seleccion unica entre cuatro,
                     no un interruptor independiente por boton. Con pressed el
                     lector dice "no presionado" en los otros tres a la vez. */
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-wide uppercase transition-colors duration-200 ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'border border-hairline bg-void/40 text-ink-soft hover:border-ink-soft hover:text-ink'
                  }`}
                >
                  <Icon size={16} weight="fill" />
                  {c.label}
                </button>
              )
            })}
          </Reveal>
        </div>

        {/*
          La categoría activa se lee como un título de capítulo, no como una
          etiqueta chica: ahora esta es la única carta de la página, así que
          el nombre de lo que se está mirando tiene que pesar tanto como
          cualquier otro título del sitio. Va adentro del mismo bloque
          animado que el grid para que capítulo y productos entren y salgan
          juntos al cambiar de tab.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activa}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 lg:mt-16"
          >
            <h3 className="display-xl text-[clamp(2.2rem,5.5vw,4rem)] text-accent-soft uppercase">
              {CATEGORIAS.find((c) => c.id === activa)?.label}
            </h3>

            {/*
              Dos columnas desde mobile, no una: con grid-cols-1 cada
              tarjeta ocupa el ancho completo y se lee como "de a uno" aunque
              se pueda scrollear -- nunca hay dos tiles lado a lado, que es
              justo lo que el kiosco evita. gap-4 en vez de gap-6 en mobile
              porque a ~160px de columna el espacio de gap-6 le come mas
              proporcion a la tarjeta que en desktop.
            */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-7">
              {items.map((item) => (
                <article
                  key={item.nombre}
                  className="overflow-hidden rounded-card border border-hairline bg-surface transition-colors duration-200 hover:bg-surface-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={item.foto.src}
                      srcSet={item.foto.srcSet}
                      sizes={
                        item.foto.srcSet
                          ? '(min-width: 1024px) 420px, (min-width: 640px) calc(50vw - 32px), calc(100vw - 40px)'
                          : undefined
                      }
                      alt={item.alt}
                      loading="lazy"
                      className="photo-treat size-full object-cover"
                      width={item.w}
                      height={item.h}
                    />
                    {/* Insignia de precio sobre la foto en vez de texto
                        al lado del nombre -- el precio se lee de un
                        vistazo, como en la tarjeta de un kiosco, sin
                        competir en peso con el titulo del producto. */}
                    <span className="absolute top-3 right-3 rounded-full bg-void/85 px-3 py-1 font-display text-base leading-none text-ink backdrop-blur-sm">
                      {item.precio}
                    </span>
                    {/* Abajo, no arriba junto al precio: en columna de mobile
                        (~160px) los dos pills lado a lado no entran y se
                        superponen -- separados en esquinas opuestas siempre
                        entran, sea cual sea el ancho de la tarjeta. */}
                    {item.destacado && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-void/85 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-accent-soft uppercase backdrop-blur-sm">
                        Más pedido
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-display text-xl leading-[0.95] tracking-tight uppercase">
                      {item.nombre}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
