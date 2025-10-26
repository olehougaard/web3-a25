import _ from 'lodash'

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

let sumOfAgeOfDragons = (pets: Pet[]): number => _.chain(pets)
  .filter(p => p.type === 'dragon')
  .map(p => p.age)
  .reduce((sum: number, a: number) => sum + a, 0)
  .value()

console.log(sumOfAgeOfDragons(pets))
