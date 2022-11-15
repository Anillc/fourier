import { Complex, dft, Pixel } from './algorithm'
import { loadData } from './data'
import { loadImage } from './utils'

const size = 1600
let image: Pixel[][]

const canvas: HTMLCanvasElement = document.querySelector('#main')
const g = canvas.getContext('2d')

let circles: [number, number, number][]
let timeout: number = null

let fs: Complex[]
function resize() {
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight
  circles = fs.flatMap((f, i) => {
    const v = 2 * Math.PI * i / fs.length
    return [
      [f.real    / fs.length, v, 0],
      [f.imagine / fs.length, v, Math.PI / 2],
    ]
  })
  circles.sort((x, y) => Math.abs(y[0]) - Math.abs(x[0]))
  start()
}

;(async () => {
  image = await loadImage('1.jpg')
  const data = loadData(image)
  const resized = []
  const step = data.length / size
  for (let i = 0; i < size; i++) {
    resized.push(data[Math.floor(step * i)])
  }
  fs = dft(resized)
  window.onresize = resize
  resize()
})()

function start() {
  const points = []
  let time = 0
  if (timeout) clearTimeout(timeout)
  requestAnimationFrame(async function anime() {
    g.clearRect(0, 0, 1500, 1500)
    const last = circles.reduce(({ real: x, imagine: y }, [r, v, cos]) => {
      const angle = cos + v * time
      const nextX = x + r * Math.cos(angle)
      const nextY = y + r * Math.sin(angle)
      g.strokeStyle = '#1D1D1D'
      g.beginPath()
      g.arc(x, y, Math.abs(r), 0, 2 * Math.PI)
      g.stroke()
      return { real: nextX, imagine: nextY }
    }, { real: Math.abs((document.body.clientWidth - image[0].length) / 2), imagine: 0 })
    points.push(last)
    g.strokeStyle = '#FFFF33'
    points.reduce((last, p) => {
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(last.real, last.imagine)
      g.lineTo(p.real, p.imagine)
      g.stroke()
      return p
    })

    time++
    if (time < size) {
      timeout = setTimeout(anime, 1000 / 120)
    }
  })
}