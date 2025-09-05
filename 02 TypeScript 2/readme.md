## TypeScript (II)

These are the code examples from session 2. Details below.

### Type features
Simple, but helpful type features that are useful every time.
* `type predicates.ts` - how to help the compiler when default narrowing doesn't work.
* `immutability.ts` - how to be sure that you know which changes you make.

### Creating new types from other types
How to get the precise type for everything without violating the DRY principle.
* `generics.ts` - mostly a reminder of what generics are. Doesn't go beyond Java or C#.
* `utility types.ts` - using the built-in utility types in TypeScript.
* `type manipulations.ts` - deconstructing and constructing object types with `keyof` and index signatures.

### Type helpers
Creating your own utility types and other advanced topics. This can be seen as optional.
* `template literal types.ts` - using template literals to compute key types or unions from other types.
* `type helpers.ts` - conditional types, `infer`
