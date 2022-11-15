export interface Complex {
  real: number
  imagine: number
}

export interface Pixel {
  red: number
  green: number
  blue: number
}

export * from './fourier'
export * from './canny'
export * from './prim'