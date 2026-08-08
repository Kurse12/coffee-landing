import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Color } from 'three'

/*
  Fondo del hero: la superficie de un cafe recien revuelto, visto desde arriba.

  Reemplaza al componente Silk heredado de React Bits. La seda se veia bien pero
  no decia nada: era un shader generico teñido de rojo, y podia estar en la
  landing de cualquier cosa. Esta version dibuja algo que solo tiene sentido
  detras de una taza.

  Dos decisiones hacen la diferencia entre "ruido girando" y "cafe revuelto":

  1. Rotacion diferencial. El angulo de giro cae con el radio, asi que el centro
     gira mas rapido que el borde. Un liquido revuelto hace exactamente eso; una
     textura que gira entera se lee como calcomania sobre un plato giratorio.
  2. Domain warping en dos pasos. El primer fbm deforma las coordenadas y el
     segundo arrastra esa deformacion. Es lo que estira la crema en brazos y
     espirales en vez de dejar manchas sueltas.

  El resto es control de valor: esto vive detras de un titular rojo y de una
  taza blanca, y no puede competir con ninguno de los dos.
*/

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uAspect;
  uniform vec3  uEspresso;
  uniform vec3  uColor;
  uniform vec3  uCrema;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Cada octava entra rotada: sin eso las octavas se alinean y aparece un
  // enrejado horizontal-vertical que delata el ruido.
  const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = ROT * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    /*
      Dos sistemas de coordenadas, y la separacion importa:

      base esta en unidades de pantalla y manda la composicion: donde cae el
      centro, cuanto gira cada radio, donde arranca la viñeta. No depende de
      uScale.

      p es base multiplicada por uScale y solo alimenta al ruido, o sea el
      detalle. Antes las dos cosas eran la misma coordenada, asi que bajar el
      detalle tambien encogia el cuadro: con uScale por debajo de 1 el dominio
      del fBm no llegaba a cubrir una celda del lattice y la octava dominante
      quedaba en un solo degradado. En pantallas anchas eso se veia como un
      fondo plano.
    */
    vec2 base = (vUv - 0.5) * vec2(uAspect, 1.0);
    float rv = length(base);
    float t = uTime * uSpeed;

    // Rotacion diferencial: mas rapida cuanto mas cerca del centro.
    float ang = t * 0.10 / (0.18 + rv * rv);
    float s = sin(ang);
    float c = cos(ang);
    vec2 p = mat2(c, -s, s, c) * base * uScale;

    // Domain warping: deformar, despues arrastrar la deformacion.
    vec2 q = vec2(
      fbm(p + vec2(0.0, t * 0.05)),
      fbm(p + vec2(4.3, 1.7))
    );
    vec2 w = vec2(
      fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.035),
      fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.025)
    );
    float patron = fbm(p + 3.2 * w);

    // Brazos en espiral. Es lo que convierte una mancha girando en cafe
    // revuelto: la fase depende del angulo Y del radio, asi que las bandas se
    // enroscan hacia el centro en vez de quedar como rayos. El patron entra en
    // la fase para que los brazos se deformen con la crema y no se lean como
    // una espiral dibujada con regla.
    // La fase depende del angulo Y del radio de pantalla, asi que las bandas se
    // enroscan hacia el centro en vez de quedar como rayos.
    float a = atan(base.y, base.x);
    float espiral = sin(a * 2.0 + rv * 9.0 - t * 0.30 + patron * 5.0) * 0.5 + 0.5;
    patron = mix(patron, patron * 0.5 + espiral * 0.5, 0.55);

    /*
      Estrias: el rastro fino que deja la cuchara en la microespuma. Van a alta
      frecuencia pero sobre la MISMA fase que los brazos, y con el patron metido
      adentro, asi que se curvan con la crema en vez de leerse como rayado
      encima. Sin esto todo el shader es baja frecuencia y el fondo se lee como
      atmosfera calida, no como liquido.
    */
    float estrias = sin(a * 9.0 + rv * 26.0 - t * 0.22 + patron * 9.0) * 0.5 + 0.5;
    patron = mix(patron, patron * 0.72 + estrias * 0.28, 0.35);

    // Microespuma: grano que rompe el degrade y le da superficie liquida.
    float micro = fbm(p * 6.0 + w * 3.0) - 0.5;

    /*
      Rampa angosta a proposito. Con una rampa ancha cada transicion se estira
      sobre media pantalla y todo queda difuso; acotarla es lo que hace que los
      canales oscuros entre brazos de crema tengan borde.
    */
    vec3 col = mix(uEspresso, uColor, smoothstep(0.20, 0.60, patron + micro * 0.26));

    // La crema entra solo en el extremo alto: es el punto mas claro que va a
    // existir en pantalla, y arriba lleva un titular rojo.
    float brillo = smoothstep(0.46, 0.74, patron + micro * 0.14);
    col = mix(col, uCrema, pow(brillo, 1.7) * 0.7);

    // Borde de taza: hunde las esquinas para que el centro sea el unico foco.
    // Va contra el radio de pantalla, asi que se comporta igual en 1440 que en
    // un monitor ancho.
    col *= 1.0 - smoothstep(0.55, 1.30, rv) * 0.5;

    gl_FragColor = vec4(col, 1.0);
  }
`

function CremaPlane({ uniforms }) {
  const malla = useRef(null)
  const { viewport, size } = useThree()

  useLayoutEffect(() => {
    if (!malla.current) return
    malla.current.scale.set(viewport.width, viewport.height, 1)
    uniforms.uAspect.value = size.width / size.height
  }, [viewport, size, uniforms])

  useFrame((_, delta) => {
    // Acotado: al volver de otra pestaña delta llega enorme y el giro pega un
    // salto que se ve como un tiron.
    uniforms.uTime.value += Math.min(delta, 0.05)
  })

  return (
    <mesh ref={malla}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

/*
  Los tonos salen de los tokens del CSS y no de literales aca: son los mismos
  que usa el halo del hero, y tenerlos en dos archivos garantiza que en algun
  momento dejen de coincidir.
*/
const token = (nombre, respaldo) => {
  if (typeof document === 'undefined') return respaldo
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  return v || respaldo
}

export default function Crema({
  espresso = token('--color-espresso', '#0f0906'),
  color = token('--color-tueste', '#6b3a1c'),
  crema = token('--color-crema', '#c8813c'),
  speed = 1,
  scale = 1,
  dpr = [1, 1.5],
}) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uAspect: { value: 1 },
      uEspresso: { value: new Color(espresso) },
      uColor: { value: new Color(color) },
      uCrema: { value: new Color(crema) },
    }),
    [espresso, color, crema, speed, scale],
  )

  return (
    <Canvas dpr={dpr} frameloop="always">
      <CremaPlane uniforms={uniforms} />
    </Canvas>
  )
}
