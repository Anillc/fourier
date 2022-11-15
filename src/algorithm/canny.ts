import { Complex, Pixel } from '.'

export function gray(input: Pixel[][]): number[][] {
  return input.map(row =>
    row.map(({ red, green, blue }) => blue * 0.0722 + green * 0.7152 + red * 0.2126))
}

export function gussian(input: number[][], size: number, sigma: number): number[][] {
  let kernel: number[][] = []
  let sum = 0
  const left = -Math.floor(size / 2)
  for (let i = 0; i < size; i++) {
    const line: number[] = []
    for (let j = 0; j < size; j++) {
      const value = Math.exp(-((i + left) ** 2) + ((j + left) ** 2) / (2 * sigma ** 2)) / (2 * Math.PI * sigma ** 2)
      line.push(value)
      sum += value
    }
    kernel.push(line)
  }
  kernel = kernel.map(line => line.map(value => value / sum))

  return input.map((row, y) => {
    return row.map((_, x) => {
      let result = 0
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const neighbor = input[y + i + left]?.[x + j + left]
          if (!neighbor) continue
          result += neighbor * kernel[i][j]
        }
      }
      return result
    })
  })
}

export function sobel(input: number[][]): [number, number][][] {
  const left = -1
  const size = 3
  const gx = [
    [-1,  0, 1],
    [-2,  0, 2],
    [-1,  0, 1],
  ]
  const gy = [
    [-1, -2, -1],
    [ 0,  0,  0],
    [ 1,  2,  1],
  ]
  return input.map((row, y) => {
    return row.map((_, x) => {
      let resultX = 0
      let resultY = 0
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const neighbor = input[y + i + left]?.[x + j + left]
          if (!neighbor) continue
          resultX += neighbor * gx[i][j]
          resultY += neighbor * gy[i][j]
        }
      }
      return [resultX, resultY] as [number, number]
    })
  })
}

export function nonMaxSuppression(input: number[][]) {
  const gxys = sobel(input)
  return sobel(input).map((row, y) => {
    return row.map(([gx, gy], x) => {
      const self  = Math.sqrt(gy ** 2 + gx ** 2)
      let angle = Math.atan2(gy, gx)
      // if (angle < -Math.PI / 8) angle += Math.PI
      // angle *= 2
      let x1: number, y1: number, x2: number, y2: number, t: number
      if (angle > 0 && angle <= Math.PI / 4) {
        t = Math.abs(gy / gx)
        x1 =  1, y1 = 0, x2 =  1, y2 = 1
      } else if (angle > Math.PI / 4 && angle <= Math.PI / 2) {
        t = Math.abs(gx / gy)
        x1 =  1, y1 = 1, x2 =  0, y2 = 1
      } else if (angle > Math.PI / 2 && angle <= Math.PI / 4 * 3) {
        t = Math.abs(gy / gx)
        x1 =  0, y1 = 1, x2 = -1, y2 = 1
      } else if (angle > Math.PI / 4 * 3 && angle <= Math.PI) {
        t = Math.abs(gx / gy)
        x1 = -1, y1 = 1, x2 = -1, y2 = 0
      } else {
        return 0
      }
      const [aX, aY] = gxys[y + y1]?.[x + x1] || [0, 0]
      const [bX, bY] = gxys[y + y2]?.[x + x2] || [0, 0]
      const [cX, cY] = gxys[y - y1]?.[x - x1] || [0, 0]
      const [dX, dY] = gxys[y - y2]?.[x - x2] || [0, 0]
      const gup   = t * Math.sqrt(aX ** 2 + aY ** 2) + (1 - t) * Math.sqrt(bX ** 2 + bY ** 2)
      const gdown = t * Math.sqrt(cX ** 2 + cY ** 2) + (1 - t) * Math.sqrt(dX ** 2 + dY ** 2)
      if (gup > self || gdown > self) {
        return 0
      }
      return self > 255 ? 255 : self
    })
  })
}

export function canny(input: Pixel[][], high = 100, low = 10, size = 3, sigma = 1.6): boolean[][] {
  const edge = nonMaxSuppression(gussian(gray(input), size, sigma))
  return edge.map((row, y) => {
    return row.map((pixel, x) => {
      if (pixel >= high) return true
      if (pixel <= low) return false

      for (let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
          const neighbor = edge[y + j]?.[x + i]
          if (neighbor && neighbor >= high) return true
        }
      }
      return false
    })
  })
}