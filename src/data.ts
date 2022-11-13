import { Complex } from './fourier'

const scaleX = 10
const scaleY = 100

export function func(time: number): Complex {
  return {
    real: Math.sin(time) * scaleY,
    imagine: time * scaleX,
  }
}

export const data = [...new Array(document.body.clientWidth).keys()]
  .map(x => x / scaleX)
  .map(func)