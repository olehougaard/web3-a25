const numbers = [2, 3, 7, 11, 13]

const addCurry = (a: number) => (b: number) => a + b

// Good for
console.log(numbers.map(addCurry(5)))

// Bad for
console.log(addCurry(7)(11))

function add(a: number): (b: number) => number
function add(a: number, b: number): number
function add(a: number, b?: number) {
  if (b !== undefined)
    return a + b
  return (b: number) => a + b
}

// Good for
console.log(numbers.map(add(5)))
console.log(add(7, 11))

// Bigger example

type Pet = {
  type: 'dog' | 'cat' | 'dragon'
  name: string
  age: number
}

const pets: Pet[] = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

let sumOfAgeOfDragons = (pets: Pet[]) => pets
  .filter(p => p.type === 'dragon')
  .map(p => p.age)
  .reduce((sum: number, a: number) => sum + a, 0)

console.log(sumOfAgeOfDragons(pets))

const isDragon = (pet:Pet) => pet.type === 'dragon'
const age = (pet: Pet) => pet.age

let sumOfAgeOfDragons2 = (pets: Pet[]) => pets
  .filter(isDragon)
  .map(age)
  .reduce(add, 0)

function isType(type: Pet['type']): (pet: Pet) => boolean
function isType(type: Pet['type'], pet: Pet): boolean
function isType(type: Pet['type'], pet?: Pet) {
  if (pet !== undefined)
    return pet.type === type
  return (pet: Pet) => pet.type === type
}

let sumOfAgeOfDragons3 = (pets: Pet[]) => pets
  .filter(isType('dragon'))
  .map(age)
  .reduce(add, 0)
