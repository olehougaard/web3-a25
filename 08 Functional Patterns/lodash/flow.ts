import * as _ from 'lodash/fp'

type Pet = {
  type:'dog' | 'cat' | 'dragon',
  name: string,
  age: number
}

const pets: Pet[] = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

const dragons = (pets: Pet[]) => _.filter(pet => pet.type === 'dragon', pets)    
const ages = (pets: Pet[]) => _.map(pet => pet.age, pets)

const sumOfAgeOfDragons = (pets: Pet[]) => {
  const dragonPets = dragons(pets)
  const dragonAges = ages(dragonPets)
  return _.sum(dragonAges)
}

const sumOfAgeOfDragons2 = (pets: Pet[]) => _.flow([
    dragons,
    ages,
    _.sum
  ])(pets)

const sumOfAgeOfDragons3 = _.flow([
    dragons,
    ages,
    _.sum
  ])
