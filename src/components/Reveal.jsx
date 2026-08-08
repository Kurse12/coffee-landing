import { motion, useReducedMotion } from 'motion/react'

/*
  Entrada al viewport para bloques que solo necesitan aparecer en orden.
  Motion alcanza y sobra aca: GSAP queda reservado para pin y scrub reales.
  Bajo prefers-reduced-motion no hay desplazamiento, el contenido ya esta puesto.
*/
export default function Reveal({
  as = 'div',
  delay = 0,
  y = 28,
  className = '',
  children,
  ...props
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Tag>
  )
}
