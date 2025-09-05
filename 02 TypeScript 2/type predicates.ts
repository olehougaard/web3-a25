// Problem with union of objects
type LoadingState = { percentComplete: number }
type FailedState = { statusCode : number }
type OkState = { payload: number[] }

type State = LoadingState | FailedState | OkState


function reportStateError(state: State) {
  if ((state as LoadingState).percentComplete !== undefined) {
    
    // The narrowing doesn't work - it's too complex:
    console.log(`Loading ${state.percentComplete}% done`)
  } // And so on
}
