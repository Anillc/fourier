import { Complex } from './fourier'

export function func(time: number): Complex {
  return {
    real: Math.sin(time) * 100,
    imagine: time * 10,
  }
}

export const data = [...new Array(document.body.clientWidth).keys()].map(x => (x) / 10).map(func)