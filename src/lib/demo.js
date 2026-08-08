import { createContext, useContext } from 'react'

/*
  Contexto de la hoja explicativa de los CTA ficticios. Vive aca y no en el
  componente para que HojaDemo.jsx exporte solo componentes: mezclar hooks y
  componentes en un archivo apaga el fast refresh de ese modulo.
*/
export const DemoContext = createContext(null)

/** `abrir('whatsapp' | 'redes')` desde cualquier CTA ficticio. */
export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo necesita <DemoProvider> arriba en el arbol')
  return ctx
}
