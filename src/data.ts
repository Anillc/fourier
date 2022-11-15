import { canny, prim, Complex } from './algorithm'
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

export async function points(url: string): Promise<Complex[]> {
  const image = canny(await loadImage('3.jpg'))
  const pixels: Complex[] = image.map((row, imagine) => row.map((pixel, real) => pixel ? [{
    real, imagine
  }] : [])).flat(2)
  const map = pixels.map(a => pixels.map(b => {
    return Math.sqrt((a.real - b.real) ** 2 + (a.imagine - b.imagine) ** 2)
  }))
  const treeMap = prim(map)
    
  return []
}