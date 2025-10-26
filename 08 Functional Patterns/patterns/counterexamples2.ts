type ActiveGame = {
    id: number,
    pending: false,
    player_in_turn: number | undefined,
    players: string[]
}

type PendingGame = {
    id: number,
    pending: true,
    players: string[]
}

type Game = ActiveGame | PendingGame

export function player_in_turn(games: Game[], id: number): string | undefined {
    const game = games.find(g => g.id === id)
    if (game === undefined) return undefined
    if (game.pending) return undefined
    if (game.player_in_turn === undefined) return undefined
    return game.players[game.player_in_turn]
}

// Poor man's optional

export function pit(games: Game[], id:number): string | undefined {
    return games.filter(g => g.id === id).slice(0, 1)
      .filter(g => !g.pending)
      .filter(g => g.player_in_turn !== undefined)
      .flatMap(g => g.players[g.player_in_turn!])[0]
}