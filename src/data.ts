import { canny, Complex } from './algorithm'
import { loadImage } from './utils'

const scaleX = 10
const scaleY = 100

// TODO: remove
export function func(time: number): Complex {
  return {
    real: Math.sin(time) * scaleY,
    imagine: time * scaleX,
  }
}

export const data = [...new Array(document.body.clientWidth).keys()]
  .map(x => x / scaleX)
  .map(func)

export async function loadData() {
  const image = await loadImage('l6.png')
  const data: Complex[] = []
  canny(image).forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel) {
        data.push({
          real: x,
          imagine: y,
        })
      }
    })
  })
  return data
}