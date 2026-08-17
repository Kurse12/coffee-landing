# Cafetería · landing demo

Landing de una cafetería genérica (sin marca real detrás), pensada como demo de
scroll cinematográfico. React + Vite + Tailwind v4, con GSAP ScrollTrigger,
Motion y Lenis, más un mapa Leaflet con los locales entre Palermo y Recoleta.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Cómo está armado el movimiento

Las tres librerías hacen cosas distintas y no se pisan:

| Librería | Para qué | Dónde |
|---|---|---|
| **Lenis** | Suavizado del scroll de toda la página | `src/lib/useSmoothScroll.js` |
| **GSAP + ScrollTrigger** | Pin, scrub y timelines de entrada | Hero, Marquee, Origen, Carta, Ritual, Cierre |
| **Motion** | Entradas al viewport, menú mobile y hoja de demo | `Reveal`, Nav, `HojaDemo`, Locales, Voces |
| **Three.js + R3F** | Shader del fondo del hero | `Crema`, `FondoCrema` |

Lenis y ScrollTrigger están casados en `useSmoothScroll`: Lenis pasa a ser la
fuente de verdad del scroll y GSAP recalcula sus triggers en el mismo tick. Sin
ese puente, las secciones con pin quedan desfasadas del scroll suavizado.

GSAP y Motion nunca conviven en el mismo componente, para que no se peleen por
los mismos frames.

Todo lo que se mueve pasa por `useReducedMotion()`. Con
`prefers-reduced-motion: reduce` no se monta Lenis, no corre ningún
ScrollTrigger, el scroll-stack deja de apilarse y el mapa salta al local elegido
en vez de volar.

En la carta ese fallback no es cosmético sino obligatorio: la sección se clava a
pantalla completa con el track recortado, así que sin pin el contenido quedaría
inalcanzable. Bajo reduced-motion pasa a ser un carrusel nativo con snap.

El riel de avance de la carta funciona en los dos modos, y no es decoración: con
el pin puesto la página deja de bajar y el recorrido se va de costado, así que
sin una señal no se distingue de algo roto. Con pin lo alimenta el `onUpdate` del
mismo ScrollTrigger que mueve el track; bajo reduced-motion, el `scroll` del
carrusel nativo, que además lleva la barra oculta.

## Secciones

1. **Hero** · imagen grande y titular en dos tiempos, con entrada enmascarada y parallax al salir
2. **Marquee** · banda cinética a velocidad constante, independiente del scroll
3. **Origen** · foto fija (sticky) con el relato corriendo al lado y anillo de texto que gira
4. **Carta** · recorrido horizontal con pin en todos los anchos, mobile incluido,
   con un riel de avance abajo a la izquierda
5. **Ritual** · scroll-stack a sangre, tres tarjetas a pantalla completa que se apilan
6. **Locales** · lista + mapa Leaflet, se seleccionan entre sí
7. **Voces** · testimonios sin caja, con anchos y desfases distintos
8. **Cierre** · CTA a sangre con zoom lento, footer con form de avisos, y la franja de autoría

## Los CTA ficticios y la franja de autoría

La cafetería no existe, así que su WhatsApp y sus redes no pueden llevar a
ningún lado. Antes apuntaban a `wa.me/5491100000000` y a las home deslogueadas
de Instagram y TikTok. El problema no era que faltara un número real, sino que
un `wa.me` inválido **no se lee como marcador de posición sino como link roto**,
y quien mira esto está evaluando justamente si el autor termina las cosas.

Ahora esos botones abren `HojaDemo`, que explica qué haría ese control en el
sitio del cliente y ofrece el contacto real. El punto más débil pasa a ser el
momento de venta, y ocurre justo cuando el visitante quiso actuar.

**Todo lo real vive en `src/lib/autor.js`** — nombre, WhatsApp y mail — y de ahí
leen la hoja, la franja de autoría y cualquier CTA que se agregue. Mientras esos
campos estén vacíos la página muestra el marcador en crudo en vez de inventar
datos, y avisa por consola en desarrollo.

La franja de autoría, al final de `Cierre.jsx`, es el único lugar donde la
página rompe personaje. Va del lado de afuera del footer ficticio, en superficie
propia y en `text-ink`, para que se lea como otra voz.

## El fondo del hero

`src/components/Crema.jsx` es un shader propio: la superficie de un café recién
revuelto, visto desde arriba. Antes acá vivía el componente Silk de
[React Bits](https://reactbits.dev), que se veía bien pero no decía nada — era
una seda abstracta teñida de rojo que podía estar en la landing de cualquier
cosa. Siendo el elemento técnicamente más caro de la página, era también el
menos propio.

Dos decisiones hacen la diferencia entre "ruido girando" y "café revuelto":

1. **Rotación diferencial.** El ángulo de giro cae con el radio, así que el
   centro gira más rápido que el borde. Un líquido revuelto hace exactamente
   eso; una textura que gira entera se lee como calcomanía sobre un plato
   giratorio.
2. **Domain warping en dos pasos.** El primer fBm deforma las coordenadas y el
   segundo arrastra esa deformación. Es lo que estira la crema en brazos en vez
   de dejar manchas sueltas. Encima va un término en espiral cuya fase depende
   del ángulo **y** del radio, para que las bandas se enrosquen hacia el centro
   en vez de quedar como rayos.
3. **Definición.** Los dos puntos anteriores son baja frecuencia, y solos dan
   una atmósfera cálida, no un líquido. Lo que lo cierra son las estrías —alta
   frecuencia sobre la misma fase que los brazos, con el patrón metido adentro
   para que se curven con la crema en vez de leerse como rayado encima— más una
   rampa de color angosta. Con la rampa ancha cada transición se estira sobre
   media pantalla y todo queda difuso; acotarla es lo que le da borde a los
   canales oscuros entre brazos.

Dentro del shader hay **dos sistemas de coordenadas**, y la separación importa.
`base` está en unidades de pantalla y manda la composición: dónde cae el centro,
cuánto gira cada radio, dónde arranca la viñeta. `p` es `base` multiplicada por
`uScale` y sólo alimenta al ruido, o sea el detalle.

Al principio eran la misma coordenada, y eso tenía dos consecuencias malas: bajar
el detalle también encogía el cuadro, y con `uScale` por debajo de 1 el dominio
del fBm no llegaba a cubrir una celda del lattice, así que la octava dominante
quedaba en un solo degradado. **En monitores anchos se veía como un fondo plano.**
Separadas, el encuadre se comporta igual en 1440, en 1817 y en un teléfono.

`src/components/FondoCrema.jsx` es el envoltorio, y es donde está todo lo que
hace falta para que el shader conviva con la página.

**El fondo no lleva el acento rojo, y es a propósito.** Lo llevaba por herencia
del shader de seda, que se tiñó con el acento porque la paleta es negro más un
rojo. Pero el rojo tiene que **significar algo** en los botones y en la línea
roja del titular: si además pinta el fondo, aparece en todos lados y por eso
significa menos. Ahora el fondo va en tonos de café —`--color-espresso`,
`--color-tueste`, `--color-crema`, definidos en `index.css`— y el acento queda
sólo donde decide algo. Los tres salen de la foto de la taza, así que la página
ya los venía mostrando sin nombrarlos.

**Contraste, medido y no estimado.** El titular tiene una línea en rojo sobre un
fondo animado, debajo de un velo en degradado, debajo de la opacidad del
envoltorio: ese número no se calcula a mano. Se mide escondiendo el titular,
capturando, y buscando el píxel más claro dentro de su caja a lo largo de varios
momentos del giro. Peor caso: **3,13:1 en 1817 px, 3,10:1 en 1440 y 3,25:1 en
mobile**, sobre el piso de 3:1 para texto grande. Cada vez que se toque el
shader, el halo o el velo hay que volver a medir: el margen es de décimas.

**El techo de presencia lo pone el titular, no el gusto.** Los tonos de café son
menos saturados que el rojo que reemplazaron, así que al mismo valor se leen más
apagados, y la primera versión quedó tan oscura que el cambio de color casi no se
notaba. La salida es que el velo no es parejo: el lado de la foto va al 5% y el
de la columna de texto al 70%. Ahí hay headroom para empujar el café donde se
mira sin tocar donde se lee. Medido contra la versión roja en una franja del
fondo sin la taza —incluir la taza arruina la medición: es blanca, constante y
brillante, y tapa justo el cambio que se quiere ver—: tono **358° → 17°**,
saturación **48% → 43%**.

**El halo no pasa por el velo.** Es la trampa de este hero: el foco que va detrás
de la taza (`hero-halo`, en `Hero.jsx`) se pinta **encima** del velo de
legibilidad, así que el velo no lo atenúa, y con 800 px de ancho más 120 de blur
invade la columna del titular. Al pasarlo de rojo a crema, que tiene casi el
doble de luminancia, el titular cayó a 2,93:1 — y subir el velo no lo arreglaba,
porque el problema no estaba abajo del velo. Se arregla bajando la opacidad del
halo. Si en el futuro el titular pierde contraste, **mirar el halo antes que el
velo**.

**Costo.** Es un shader a pantalla completa corriendo siempre. Se monta solo
mientras el hero está en pantalla, vía IntersectionObserver, y se desmonta al
salir, así el resto de la página no paga nada. En pantallas táctiles baja a
`dpr 1`, y en el resto a `[1, 1.5]`.

**Degradación.** Sin WebGL, con el canvas caído (hay un límite de error
alrededor) o con `prefers-reduced-motion`, no se dibuja nada y el hero se queda
con su halo de siempre.

**Dial principal.** La opacidad del canvas, hoy en `opacity-75`. Es lo que hay
que mover si la crema se ve muy fuerte o muy tímida. Va más alto que el 30% que
llevaba la seda porque este shader es bastante más oscuro de por sí: tiene
viñeta propia y el patrón pasa la mayor parte del tiempo en la mitad baja del
rango.

## Mapa

Tiles oscuros de CARTO sobre datos de OpenStreetMap. No hace falta API key ni
token; la atribución de ambos ya está en el control del mapa y es obligatorio
mantenerla. Va en `ink-soft` a 11 px y no en el gris de Leaflet: si es
obligatoria, tiene que poder leerse.

En mobile el mapa queda **pegado arriba** mientras las fichas pasan por debajo.
No es un efecto: iba último, así que elegir un local movía una cámara que estaba
420 px más abajo, fuera de pantalla. La banda opaca detrás del mapa existe para
que las fichas no asomen por sus esquinas redondeadas al pasar.

Los tres locales viven en `src/lib/locales.js` (barrio, calle, horario,
coordenadas). Editar ahí alcanza: la lista, los pines, el link a Google Maps y
la línea de direcciones del footer salen todos de ese archivo.

El chunk de Leaflet se carga con `lazy()` porque pesa 156 kB y está muy por
debajo del pliegue.

## Fotos

Los archivos viven en `src/media/` y se mapean a la página desde
`src/lib/media.js`. La excepción es la foto del hero, que está en `public/`
porque es el elemento LCP y necesita una ruta estable para el `preload` de
`index.html`.

| Clave | Archivo | Dónde aparece |
|---|---|---|
| `hero` | `public/hero-cafe.jpg` | Panel izquierdo del hero (copia de `filtrado_v60`) |
| `origen` | `interior.jpg` | Círculo de la sección Nosotros |
| `carta[0..4]` | `espresso_doble` · `flat_white` · `filtrado_v60` · `cookie_choco` · `medialuna` | Recorrido horizontal de la carta |
| `stack.*` | `tostamos_martes` · `descanso_72hs` · `filtrado_pedido` | Una por tarjeta del scroll-stack, en ese orden |
| `cierre` | `int_horizontal.jpg` | Banda de cierre, a sangre |
| — | `public/og-cafeteria.jpg` | Preview del link en WhatsApp. Es una captura del hero real, 2400 x 1260 (la proporción 1,91:1 que piden las tarjetas); regenerarla si cambia el hero |

`cookies2.jpg` y `vaso.jpg` quedaron sin uso al recortar el ritual de cinco
tarjetas a tres. Siguen en `src/media/` por si vuelven.

La utilidad `.photo-treat` (en `src/index.css`) les aplica un ajuste mínimo de
brillo y contraste para que no floten demasiado claras contra el negro. No
desatura: la comida pierde.

### Pendientes de fotografía

- **`public/hero-cafe.jpg` es una copia de `filtrado_v60.jpg`, no una toma
  propia del hero.** Sirve porque es la única foto del banco con el mood de la
  referencia (mano sirviendo, vapor, tonos cálidos), pero repite la imagen que
  ya usa `carta[2]`. El pendiente es una toma horizontal exclusiva para el
  hero, a 1600 px de ancho como mínimo.
- **`int_horizontal.jpg`** mide 735 x 490, y en la banda de cierre va a sangre
  sobre todo el ancho de pantalla. En un monitor grande se amplía casi al doble.
  El velo oscuro y el zoom corto lo disimulan, pero la misma toma en 2400 px de
  ancho quedaría bastante mejor.
- **Las fotos del stack son verticales.** A pantalla completa y a lo ancho, el
  recorte por altura es agresivo: el sujeto se sostiene porque está centrado. Si
  se cambia alguna, mantener el sujeto al centro.

## Accesibilidad

No hay un estándar declarado, pero sí un piso que no se baja:

- **Sobre foto, el rojo de texto es `accent-soft`, nunca `accent`.** `accent`
  tiene luminancia 0,146: sobre negro llega a 3,68:1 y aguanta, pero una foto
  atenuada por un velo cae justo en el medio del rango y el contraste se
  desploma — 2,21:1 sobre la arpillera del ritual, 1,82:1 contra el plato
  blanco, 2,0:1 sobre las paredes del salón del cierre. `accent-soft` da 3,87:1
  en el mismo punto y 6,44:1 sobre negro, así que sirve en los dos fondos. El
  titular del hero sigue en `accent` porque ahí el velo deja el fondo casi en
  negro y está medido en 3,10-3,25:1.
- **Los tres pesos de tinta tienen contratos distintos** (`src/index.css`).
  `ink-faint` mide 3,46:1 sobre el fondo, así que no lleva texto: es para bordes,
  íconos inactivos y glifos decorativos. Si algo con información quedó en
  `ink-faint`, es un error y va en `ink-soft`.
- **Link de salto** al `<main>` como primer elemento enfocable. Antes del
  contenido hay ocho cosas enfocables en la barra, y con teclado había que pasar
  por todas en cada visita.
- **La hoja de demo atrapa el foco** mientras está abierta y lo devuelve al botón
  que la abrió al cerrarse.
- **El estado del formulario del footer vive en una región viva**: el éxito
  reemplaza al formulario, así que sin eso un lector de pantalla se queda con el
  foco en un botón que ya no existe. El mensaje repite el mail confirmado, que es
  la única forma de ver si quedó bien escrito.
- **Las fichas de local usan `aria-current`**, no `aria-pressed`: es una
  selección única entre tres, no tres interruptores independientes.
- **El `alt` describe la foto, no el producto.** El nombre ya lo dice el título
  de al lado y repetirlo hace que se lea dos veces.

## Contenido

Precios, horarios, testimonios y direcciones son ficticios. El formulario de
avisos del footer no tiene backend: simula la llamada en `Cierre.jsx` y ahí va
el POST real al proveedor de mails. La rama de error de red ya está escrita y hoy
no se dispara nunca: existe para que el día que entre el POST real, un 500 diga
algo en vez de verse igual que no haber apretado el botón.

Lo único real de la página es `src/lib/autor.js`: el nombre y el contacto de
quien la hizo. Es lo que cierra la métrica de éxito de la pieza, que es que el
prospecto escriba.

## Antes de publicar

**Una línea:** poner el dominio real en `VITE_SITE_URL`, dentro de `.env`, sin
barra al final.

```bash
VITE_SITE_URL=https://cafeteria-demo.vercel.app
```

Vite reemplaza `%VITE_SITE_URL%` en `index.html` al compilar, así que de ahí
salen `og:url` y `og:image` ya absolutas. Los scrapers de WhatsApp y Telegram
leen el HTML crudo desde su propio servidor, sin contexto de dominio: con una
ruta relativa no pueden resolver la imagen y el link llega pelado. Como el
modelo de entrega es "URL suelto mandado por chat", la primera impresión no es
el hero sino la tarjeta de preview.

Se verifica mirando el HTML compilado, no el código fuente:

```bash
npm run build
grep og: dist/index.html
```

Si la página va a colgar de un subdirectorio (típico en GitHub Pages,
`usuario.github.io/repo/`), además hay que poner `base: '/repo/'` en
`vite.config.js`, o los assets salen con rutas que no existen.

WhatsApp cachea el preview por URL durante horas. Si mandaste el link antes de
que las tags estuvieran bien, probá con `?v=2` pegado al final para forzar una
lectura nueva.

`src/lib/autor.js` ya está completo. Si se clona esto para otra demo, ese es el
primer archivo a tocar: mientras esté vacío, la franja de autoría muestra el
recuadro punteado de pendiente en vez de los botones de contacto, y avisa por
consola en desarrollo.
