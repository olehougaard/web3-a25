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

const dragons = _.filter((pet: Pet) => pet.type === 'dragon')    
const ages = _.map((pet: Pet) => pet.age)

const sumOfAgeOfDragons = (pets: Pet[]) => _.flow([
    dragons,
    ages,
    _.sum
  ])(pets)

function isType(type: Pet['type'], pet: Pet) {
  return pet.type === type
}

const sumOfAgeOfDragons2 = _.flow([
    _.filter(_.partial(isType, ['dragon'])),
    _.map((pet: Pet) => pet.age),
    _.sum
  ])

function isType2(pet: Pet, type: Pet['type']) {
  return pet.type === type
}

const sumOfAgeOfDragons3 = _.flow([
    _.filter(_.partial(isType2, [_.placeholder, 'dragon'])),
    _.map((pet: Pet) => pet.age),
    _.sum
  ])
