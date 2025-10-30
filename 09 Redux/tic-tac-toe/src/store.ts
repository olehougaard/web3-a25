import { configureStore, createSlice, PayloadAction, Action } from '@reduxjs/toolkit'
import { makeMove, Move, Player, GameState, Game, emptyGameState } from './model'
import * as _ from 'lodash/fp'

export type MakeMovePayload = { move: Move } & Partial<Game>

export type GamePayload = {
    player: Player,
    game: Game
}

const gameReducers = {
    makeMove(state: GameState, action: PayloadAction<MakeMovePayload>): GameState {
        const {move, ...props} = action.payload
        return _.assign(makeMove(state, move), props)
    },
    newGame(_: GameState, action: PayloadAction<GamePayload>): GameState {
        return {mode: 'waiting', ...action.payload}
    },
    setGame(_: GameState, action: PayloadAction<GamePayload>): GameState {
        return {mode: 'playing', ...action.payload}
    },
    leaveGame(_: GameState, __: Action): GameState {
        return {mode: 'no game'}
    }
}

export const gameSlice = createSlice<GameState, typeof gameReducers>({
    name: 'game',
    initialState: emptyGameState,
    reducers: gameReducers
})

const lobbyReducers = {
    init(_: Game[], action: PayloadAction<Game[]>): Game[] {
        return action.payload
    },
    newGame(state: Game[], action: PayloadAction<Game>): Game[] {
        return _.extend(action.payload, state)
    },
    joinGame(state: Game[], action: PayloadAction<Game>): Game[] {
        return _.remove<Game>(_.matches({gameNumber: action.payload.gameNumber}), state)
    }
}

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState: [] as Game[],
    reducers: lobbyReducers
})

export type State = { lobby: Game[], game: GameState }

export const store = configureStore<State>({
    reducer: {game: gameSlice.reducer, lobby: lobbySlice.reducer }
})

export type StoreType = typeof store
export type Dispatch = StoreType['dispatch']
export type GetState = StoreType['getState']
export type Subscriber = Parameters<StoreType['subscribe']>[0]
