import * as z from 'zod'

export const Player = z.enum(['X', 'O'])
export const Tile = z.nullable(Player)
export const Board = z.array(z.array(Tile).length(3)).length(3)

const PlainMove = z.object({
  conceded: z.literal(false),
  x: z.number(),
  y: z.number(),
  player: Player
})

const ConcededMove = z.object({
  conceded: z.literal(true),
  player: Player
})

export const Move = z.discriminatedUnion("conceded", [PlainMove, ConcededMove])

const Row = z.array(
  z.object({
    x: z.number(),
    y: z.number(),
  })
)

export const WinState = z.object({
  winner: Player,
  row: Row.optional()
})

export const GameData = z.object({
  board: Board,
  inTurn: Player,
  winState: WinState.optional(),
  stalemate: z.boolean(),
  gameNumber: z.number(),
  gameName: z.string()
})
