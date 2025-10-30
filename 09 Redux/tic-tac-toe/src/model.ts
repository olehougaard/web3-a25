import * as _ from 'lodash/fp'

export type Player = 'X' | 'O'
export type Board = ('X' | 'O' | '')[][]
export type Game = {
    gameNumber: number,
    gameName: string,
    board: Board,
    ongoing: boolean,
    inTurn: Player,
    winState?: {winner: Player, row?: any},
    stalemate: boolean
}

export type Move = {
    conceded?: boolean
    x?: number,
    y?: number,
    player: Player
}

export type GameState = 
    { mode: 'playing' | 'waiting' | 'no game', player?: Player, game?: Game} 

export const otherPlayer = (p: Player): Player => {
    switch(p) {
        case 'X': return 'O'
        case 'O': return 'X'
    }
}

export const emptyGameState: GameState = { mode: 'no game' }

export function makeMove(state: GameState, move: Move): GameState {
  const {x, y, player} = move
  if (x === undefined || y === undefined)
    return state
  if (state.mode !== 'playing')
    return state
  return _.set(['game', 'board', x, y], player, state)
}
