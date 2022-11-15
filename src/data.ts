import { canny, prim, Complex, Pixel } from './algorithm'

export function loadData(input: Pixel[][]): Complex[] {
  const image = canny(input)
  const pixels: Complex[] = image.map((row, imagine) => row.map((pixel, real) => {
    return pixel ? [{ real, imagine }] : []
  })).flat(2)
  const treeMap = prim(pixels.map(a => pixels.map(b => {
    return Math.sqrt((a.real - b.real) ** 2 + (a.imagine - b.imagine) ** 2)
  })))
  const points: Complex[] = []
  ;(function next(map: boolean[]) {
    map.forEach((node, i) => {
      const pixel = pixels[i]
      if (node && !points.includes(pixel)) {
        points.push(pixel)
        next(treeMap[i])
      }
    })
  })(treeMap[0])
  return points
}