import { Complex } from '.'

export function dft(inputs: Complex[]): Complex[] {
  const count = inputs.length
  const results: Complex[] = []
  for (let k = 0; k < count; k++) {
    const result: Complex = { real: 0, imagine: 0 }
    inputs.forEach(({ real, imagine }, i) => {
      const x = 2 * Math.PI * i * k / count
      const cosx = Math.cos(x)
      const sinx = -Math.sin(x)
      result.real    += cosx * real - sinx * imagine
      result.imagine += cosx * imagine + sinx * real
    })
    results.push(result)
  }
  return results
}

export function restore(inputs: Complex[]) {
  const count = inputs.length
  let chain = (time: number): Complex => ({ real: 0, imagine: 0 })
  inputs.forEach((complex, i) => {
    const last = chain
    chain = (time) => {
      const { real, imagine } = last(time)
      return {
        real:    real    + complex.real    * Math.cos(2 * Math.PI * i * time / count) / count,
        imagine: imagine + complex.imagine * Math.sin(2 * Math.PI * i * time / count) / count,
      }
    }
  })
  return chain
}