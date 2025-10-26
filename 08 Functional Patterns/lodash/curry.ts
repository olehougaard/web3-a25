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

const sumOfAgeOfDragons2 = _.flow([
    _.filter((pet: Pet) => pet.type === 'dragon'),
    _.map((pet: Pet) => pet.age),
    _.sum
  ])

 const sumOfAgeOfDragons3 = _.flow([
    _.filter(_.matches({type: 'dragon'})),
    _.map(_.prop('age')),
    _.sum
  ])
 
/*
  MongoDB:
  db.pets.aggregate([
    {$match:{type:'dragon'}}, 
    {$project:{age:1}}, 
    {$project:{sumAge: {$sum:'$age'}}}
  ])
*/
