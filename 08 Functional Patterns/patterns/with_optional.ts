import { Optional } from "./optional"

type ActiveGame = {
    id: number,
    pending: false,
    player_in_turn: Optional<number>,
    players: string[]
}

type PendingGame = {
    id: number,
    pending: true,
    players: string[]
}

type Game = ActiveGame | PendingGame

function player(index: number, game: Game): Optional<string> {
    return Optional(game.players[index])
}

export function player_in_turn(games: Game[], id: number): Optional<string> {
    return Optional(games.find(g => g.id === id))
      .filter(g => !g.pending)
      .flatMap(g => g.player_in_turn.flatMap(i => player(i, g)))
}
