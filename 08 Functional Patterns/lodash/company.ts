import * as _ from 'lodash/fp'

type Person = {
  readonly name: string
  readonly age: number
}

const createPerson = (name: string, age: number) => ({name, age})

export type Company = {
  readonly name: string
  readonly address: string
  readonly employees: Readonly<Person[]>
}

const createCompany = (name: string, address: string, employees: Person[] = []): Company => 
  ({name, address, employees})

const addEmployee = (e: Person, c: Company) =>
  _.update('employees', _.extend(e), c) 

const removeEmployee = (e: Person, c: Company) => 
  createCompany(c.name, c.address, c.employees.filter(ee => e.name !== ee.name))
