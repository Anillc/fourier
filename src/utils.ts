import { Pixel } from './algorithm'

export function loadImage(url: string): Promise<Pixel[][]> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = reject
    image.onload = () => {
      const { width, height } = image
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      context.drawImage(image, 0, 0)
      const { data } = context.getImageData(0, 0, width, height)
      const y: Pixel[][] = []
      for (let i = 0; i < height; i++) {
        const x: Pixel[] = []
        for (let j = 0; j < width; j++) {
          x.push({
            red  : data[(i * width + j )* 4 + 0],
            green: data[(i * width + j )* 4 + 1],
            blue : data[(i * width + j )* 4 + 2],
          })
        }
        y.push(x)
      }
      resolve(y)
    }
    image.src = url
  })
}