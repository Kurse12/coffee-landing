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
| **GSAP + ScrollTrigger** | Pin, scrub y timelines de entrada | Hero, Marquee, Origen, Carta, Cierre |
| **Motion** | Entradas al viewport y menú mobile | `Reveal`, Nav, Ritual, Locales, Voces |

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

## Secciones

1. **Hero** · split asimétrico, entrada enmascarada del titular y parallax al salir
2. **Marquee** · banda cinética cuya velocidad y dirección modula el scroll
3. **Origen** · foto fija (sticky) con el relato corriendo al lado y anillo de texto que gira
4. **Carta** · recorrido horizontal con pin en todos los anchos, mobile incluido
5. **Ritual** · scroll-stack a sangre, cinco tarjetas a pantalla completa que se apilan
6. **Locales** · lista + mapa Leaflet, se seleccionan entre sí
7. **Voces** · testimonios sin caja, con anchos y desfases distintos
8. **Cierre** · CTA a sangre con zoom lento, más footer con form de avisos

## Mapa

Tiles oscuros de CARTO sobre datos de OpenStreetMap. No hace falta API key ni
token; la atribución de ambos ya está en el control del mapa y es obligatorio
mantenerla.

Los tres locales viven en `src/lib/locales.js` (barrio, calle, horario,
coordenadas). Editar ahí alcanza: la lista, los pines, el link a Google Maps y
la línea de direcciones del footer salen todos de ese archivo.

El chunk de Leaflet se carga con `lazy()` porque pesa 156 kB y está muy por
debajo del pliegue.

## Fotos

Los archivos viven en `src/media/` y se mapean a la página desde
`src/lib/media.js`. La excepción es la taza del hero, que está en `public/`
porque es el elemento LCP y necesita una ruta estable para el `preload` de
`index.html`.

| Clave | Archivo | Dónde aparece |
|---|---|---|
| `taza` | `public/taza-hero.png` | Hero (recorte PNG animado) y esquina del cierre |
| `origen` | `interior.jpg` | Círculo de la sección Nosotros |
| `carta[0..4]` | `espresso_doble` · `flat_white` · `filtrado_v60` · `cookie_choco` · `medialuna` | Recorrido horizontal de la carta |
| `stack.*` | `tostamos_martes` · `descanso_72hs` · `filtrado_pedido` · `cookies2` · `vaso` | Una por tarjeta del scroll-stack, en ese orden |
| `cierre` | `int_horizontal.jpg` | Banda de cierre, a sangre |

La utilidad `.photo-treat` (en `src/index.css`) les aplica un ajuste mínimo de
brillo y contraste para que no floten demasiado claras contra el negro. No
desatura: la comida pierde.

### Pendientes de fotografía

- **`int_horizontal.jpg`** mide 735 x 490, y en la banda de cierre va a sangre
  sobre todo el ancho de pantalla. En un monitor grande se amplía casi al doble.
  El velo oscuro y el zoom corto lo disimulan, pero la misma toma en 2400 px de
  ancho quedaría bastante mejor.
- **Las fotos del stack son verticales** (salvo `cookies2`). A pantalla completa
  y a lo ancho, el recorte por altura es agresivo: el sujeto se sostiene porque
  está centrado. Si se cambia alguna, mantener el sujeto al centro.

### Un problema en `espresso_doble.jpg`

La foto tiene la marca de agua `www.CBstore.eu` impresa sobre la taza, y además
muestra leche vertiéndose, no un espresso. Hay que reemplazarla antes de
mostrarle esto a nadie.

## Contenido

Precios, horarios, testimonios y direcciones son ficticios. El formulario de
avisos del footer no tiene backend: simula la llamada en `Cierre.jsx` y ahí va
el POST real al proveedor de mails.
