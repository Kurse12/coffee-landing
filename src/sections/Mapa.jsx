import { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { WarningCircle } from '@phosphor-icons/react'
import { CENTRO, LOCALES } from '../lib/locales'

/*
  Chunk cargado bajo demanda: leaflet pesa y esta muy por debajo del pliegue.
  Los tiles son de CARTO en su variante oscura, para no romper el theme lock.
*/

const pin = (activo) =>
  L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<span style="
      display:block;width:22px;height:22px;border-radius:9999px;
      background:${activo ? '#cc2a26' : '#f5f2ee'};
      box-shadow:0 0 0 ${activo ? '8px rgba(204,42,38,.22)' : '5px rgba(245,242,238,.14)'};
      transition:background .2s, box-shadow .2s;"></span>`,
  })

/** Mueve la camara cuando cambia el local elegido. */
function Camara({ coords }) {
  const map = useMap()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) map.setView(coords, 15)
    else map.flyTo(coords, 15, { duration: 1.1 })
  }, [map, coords])

  return null
}

export default function Mapa({ activo, onSelect }) {
  const [tilesRotos, setTilesRotos] = useState(false)
  /*
    En pantallas tactiles el arrastre del mapa se apaga. Con el arrastre activo,
    un dedo apoyado sobre el mapa mueve el mapa y no la pagina, y el usuario
    queda atrapado sin poder seguir bajando. La funcionalidad no se pierde: los
    locales se eligen desde la lista y el link a Maps sigue ahi.
  */
  const [tactil] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const local = LOCALES.find((l) => l.id === activo) ?? LOCALES[0]

  return (
    <>
      <MapContainer
        center={CENTRO}
        zoom={13}
        scrollWheelZoom={false}
        dragging={!tactil}
        touchZoom={!tactil}
        className="absolute inset-0 size-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          eventHandlers={{ tileerror: () => setTilesRotos(true) }}
        />

        {LOCALES.map((l) => (
          <Marker
            key={l.id}
            position={l.coords}
            icon={pin(l.id === activo)}
            eventHandlers={{ click: () => onSelect(l.id) }}
          >
            <Tooltip direction="top" offset={[0, -14]} opacity={1}>
              {l.barrio}
            </Tooltip>
          </Marker>
        ))}

        <Camara coords={local.coords} />
      </MapContainer>

      {/* Alcanza con z-10 sobre el mapa: sus 400 quedan encerrados por el
          isolate del .leaflet-container. Un z-[401] aca volveria a escaparse del
          contenedor y a taparle la barra, que es lo que se arreglo. */}
      {tilesRotos && (
        <p className="absolute inset-x-4 bottom-4 z-10 flex items-start gap-2 rounded-card border border-hairline bg-void/90 p-4 text-xs leading-relaxed text-ink-soft backdrop-blur">
          <WarningCircle size={16} className="mt-px shrink-0 text-accent-soft" />
          No se pudo cargar el mapa. Las direcciones de los tres locales están en la lista
          de al lado.
        </p>
      )}
    </>
  )
}
