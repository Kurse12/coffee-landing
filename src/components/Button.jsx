/*
  Dos variantes, un solo sistema de forma: todo lo interactivo es pill.
  Los labels van en una sola linea (whitespace-nowrap) para que ningun CTA
  se parta en dos renglones en desktop.
*/
const base =
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full ' +
  'font-semibold uppercase tracking-wide ' +
  'transition-[transform,background-color,border-color] duration-200 ease-[var(--ease-out-expo)] ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-60'

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-deep',
  ghost:
    'border border-hairline bg-void/40 text-ink backdrop-blur-sm hover:border-ink-soft hover:bg-surface-2',
}

/*
  El tamaño sale del componente y no de un className suelto: pisar el padding
  desde afuera depende del orden en que Tailwind emita las clases, y eso no
  esta garantizado. `sm` existe para la barra de navegacion, que mide 68 px y
  no le entra el tamaño normal.
*/
const sizes = {
  md: 'px-7 py-3.5 text-sm',
  sm: 'px-5 py-2.5 text-[13px]',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
