import _ from 'lodash/fp'

function fibonacci(n: number): number {
  if (n <= 0) return 0
  if (n === 1) return 1
  return fibonacci(n - 2) + fibonacci(n - 1)
}

console.log([1, 2, 3, 4, 5 ,6, 7, 8, 9, 10].map(fibonacci))

console.log(fibonacci(42))

const fibonacciMem = _.memoize((n: number): number => {
  if (n <= 0) return 0
  if (n === 1) return 1
  return fibonacciMem(n - 2) + fibonacciMem(n - 1)
})

console.log(fibonacciMem(42))
