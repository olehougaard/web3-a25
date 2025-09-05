type Point = {x: number, y: number}

const distanceFromOrigin = (p: Point) => Math.sqrt(p.x * p.x + p.y * p.y)

const dfo = ({x, y}: Point) => Math.sqrt(x * x + y * y)

const p = {
  x: 20,
  y: 35,
  unit: 'px'
}

const dist = distanceFromOrigin(p)

const p2 = { x: 20 }
console.log(distanceFromOrigin(p2))