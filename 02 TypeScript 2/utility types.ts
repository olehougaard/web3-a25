export type Employee = {
    name: string,
    age: number,
    salary: number
}

// Error
const e1: Employee = {
    name: 'Donald Duck',
    age: 33
}

const e2: Partial<Employee> = {
    name: 'Donald Duck',
    age: 33
}

type PartialEmployee = Partial<Employee>

const e3: Pick<Employee, "name" | "age"> = {
    name: 'Donald Duck',
    age: 33
}

const e4: Omit<Employee, "salary"> = {
    name: 'Donald Duck',
    age: 33
}

type LoadingState = { status: 'loading', percentComplete: number }
type FailedState = { status: 'failed', statusCode : number }
type OkState = { status: 'ok', payload: number[] }

type State = LoadingState | FailedState | OkState

function reportState(state: State) {
  if (state.status === 'loading') {
    console.log(`Loading ${state.percentComplete}% done`)
  } // And so on
}

type FinishedState = Extract<State, {status: 'failed' | 'ok'}>

type FinishedState2 = Exclude<State, {status: 'loading'}>

type R = Record<string, number>

type KeyTypes = keyof any

const c: R = {
  temperature: 4,
  humidity: 37,
  [0]: 11
}

type R2 = Record<number, number>

const c2: R2 = {
  [0]: 4,
  "dog": 7
}
console.log(c)

type HttpRecord = Readonly<Record<string, number>>

const statusCodes: HttpRecord = {
    "ok": 200,
    "Not found": 404,
    "Internal Server Error": 500
}
