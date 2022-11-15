import { canny, Complex, dft, gray, gussian, nonMaxSuppression, sobel } from './algorithm'
import { data, loadData } from './data'
import { loadImage } from './utils'

const canvas: HTMLCanvasElement = document.querySelector('#main')
const g = canvas.getContext('2d')

let circles: [number, number, number][]

let timeout: number = null
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
    }, { real: 0, imagine: document.body.clientHeight / 2 })
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

    // const image = canny(await loadImage('l6.png'))
    
    // g.fillStyle = '#FFFFFF'
    // image.forEach((y, j) => y.forEach((x, i) => {
    //   if (x) {
    //     g.fillRect(i / 3 + 100, j / 3 + 100, 1 / 2, 1 / 2)
    //     // g.fillRect(i, j, 1, 1)
    //   }
    // }))
    time++
    if (time < document.body.clientWidth) {
      timeout = setTimeout(anime, 1000 / 120)
    }
  })
}

let fs: Complex[]
function resize() {
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight
  circles = fs.flatMap((f, i) => {
    const v = 2 * Math.PI * i / fs.length
    return [
      [f.real    / fs.length, v, -Math.PI / 2],
      [f.imagine / fs.length, v, 0],
    ]
  })
  circles.sort((x, y) => Math.abs(y[0]) - Math.abs(x[0]))
  start()
}

;(async () => {
  fs = dft(await loadData())
  window.onresize = resize
  resize()
})()