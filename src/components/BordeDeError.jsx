import { Component } from 'react'

/*
  Los limites de error tienen que ser clases, React no da equivalente en hooks.
  Se usa alrededor del canvas WebGL: si el equipo no puede crear contexto o el
  shader falla, la pagina no se cae, simplemente no aparece el fondo.
*/
export default class BordeDeError extends Component {
  state = { falló: false }

  static getDerivedStateFromError() {
    return { falló: true }
  }

  componentDidCatch(error) {
    this.props.onError?.(error)
    if (import.meta.env.DEV) console.warn('[webgl] se cayo, sigue sin fondo:', error)
  }

  render() {
    return this.state.falló ? null : this.props.children
  }
}
