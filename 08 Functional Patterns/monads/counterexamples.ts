type Pet = {
  type: 'dog' | 'cat' | 'dragon',
  name: string,
  age: number
}

const dragons = (pets: Pet[]) => 
  pets.filter(p => p.type === 'dragon')

const ages = (pets: Pet[]) => 
  pets.map(p => p.age)

const sum = (ns: number[]) => 
  ns.reduce((sum, n) => sum + n, 0)

const pets: Pet[] = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

let sumOfAgeOfDragons = sum(ages(dragons(pets)))

