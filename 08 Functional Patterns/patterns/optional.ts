export interface Optional<T> {
  isPresent(): boolean
  ifPresent(consumer: (element: T) => void): void
  map<U>(f: (element: T) => U): Optional<U>
  flatMap<U>(f: (element: T) => U | Optional<U>): Optional<U>
  filter<S extends T>(predicate: (element: T) => element is S): Optional<S>
  filter(predicate: (element: T) => boolean): Optional<T>
  get(): T
  getOrElse(fallback: T): T
  or(other: Optional<T>): Optional<T>
}

function isOptional<T>(x: any): x is Optional<T> {
  return typeof x.get === 'function'
}

export function Some<T>(element: T): Optional<T> {
  const self: Optional<T> = {
    isPresent: () => true,
    ifPresent: consumer => consumer(element),
    map: f => Some(f(element)),
    flatMap: f => {
      const u = f(element)
      if (isOptional(u))
        return u
      return Some(u)
    },
    filter(predicate: (element: T) => boolean): Optional<T> {
      return predicate(element) ? self : None()
    },
    get: () => element,
    getOrElse: _ => element,
    or: _ => self
  }
  return self
}

export function None<T>(): Optional<T> {
  const self: Optional<T> = {
    isPresent: () => false,
    ifPresent: _ => {},
    map<U>(_: (element: T) => U) { return None<U>() },
    flatMap<U>(_: (element: T) => U | Optional<U>) { return None<U>() },
    filter(_predicate: (element: T) => boolean): Optional<T> {
      return self
    },
    get: () => { throw new Error('No element') },
    getOrElse: fallback => fallback,
    or: other => other
  }
  return self
}

export function Optional<T>(element: T | undefined): Optional<T> {
  if (element === undefined)
    return None<T>()
  return Some(element)
}
