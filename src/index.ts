import { Complex, dft } from './fourier'

function func(time: number): Complex {
  return {
    real: Math.sin(time) * 10 + time * 10,
    imagine: Math.cos(time) * 200,
  }
}

const range = [...new Array(1000).keys()].map(x => (x) / 10)
const values = range.map(func)
const fs = dft(values)

const circles: [number, number, number][] = fs.flatMap((f, i) => {
  const v = 2 * Math.PI * i / fs.length
  return [
    [f.real / fs.length, v, -Math.PI / 2],
    [f.imagine / fs.length, v, 0],
  ]
})

circles.sort((x, y) => y[0] - x[0])

const canvas: HTMLCanvasElement = document.querySelector('#main')
const g = canvas.getContext('2d')

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
    g.strokeStyle = '#00000055'
    g.beginPath()
    g.arc(x, y, Math.abs(r), 0, 2 * Math.PI)
    g.stroke()
    return { real: nextX, imagine: nextY }
  }, { real: 300, imagine: 500 })
  points.push(last)
  time++
  setTimeout(() => requestAnimationFrame(anime), 10)
})