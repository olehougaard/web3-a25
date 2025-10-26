import * as _ from 'lodash/fp'

type Pet = {
  type: string,
  name: string,
  age: number
}

const pets: Pet[] = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

const agesOfPets = _.map(p => p.age, pets)
console.log(agesOfPets)

console.log(_.filter(p => p.type === 'dragon', pets))

function sumOfAgeOfDragons(pets: Pet[]) {
  const dragons = _.filter(p => p.type === 'dragon', pets)
  const AgesOfDragons = _.map((p: Pet) => p.age, dragons)
  return _.sum(AgesOfDragons)
}
console.log(sumOfAgeOfDragons(pets))
