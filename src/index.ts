import { Complex, dft } from './fourier'
import { data } from './data'

const canvas: HTMLCanvasElement = document.querySelector('#main')
const g = canvas.getContext('2d')

let circles: [number, number, number][]
function resize() {
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight
  const fs = dft(data)
  circles = fs.flatMap((f, i) => {
    const v = 2 * Math.PI * i / fs.length
    return [
      [f.real    / fs.length, v, -Math.PI / 2],
      [f.imagine / fs.length, v, 0],
    ]
  })
  circles.sort((x, y) => Math.abs(y[0]) - Math.abs(x[0]))
}
window.onresize = resize
resize()

let time = 0
const points: Complex[] = []
requestAnimationFrame(function anime() {
  g.clearRect(0, 0, 1500, 1500)
  g.strokeStyle = '#000000'
  if (points.length) {
    points.reduce((last, p) => {
      g.beginPath()
      g.moveTo(last.real, last.imagine)
      g.lineTo(p.real, p.imagine)
      g.stroke()
      return p
    })
  }
  const last = circles.reduce(({ real: x, imagine: y }, [r, v, cos]) => {
    const angle = cos + v * time
    const nextX = x + r * Math.cos(angle)
    const nextY = y + r * Math.sin(angle)
    g.strokeStyle = '#00000033'
    g.beginPath()
    g.arc(x, y, Math.abs(r), 0, 2 * Math.PI)
    g.stroke()
    return { real: nextX, imagine: nextY }
  }, { real: 0, imagine: document.body.clientHeight / 2 })
  points.push(last)
  time++
  setTimeout(() => requestAnimationFrame(anime), 1000 / 120)
})
