function games_waiting_for_player(player, callback) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http:/localhost:8080/active')
    xhr.onload = _ => {
        const games = JSON.parse(xhr.responseText)
        const active_games = games.filter(g => g.player_in_turn !== undefined)
        const waiting_games = active_games.filter(g => g.players[g.player_in_turn] === player)
        const loaded_games = []
        for(let game of waiting_games) {
            const gameXhr = new XMLHttpRequest()
            gameXhr.open('GET', `http://localhost:8000/active/${game.id}`)
            gameXhr.onload = _ => {
                loaded_games.push(JSON.parse(gameXhr.responseText))
                if (loaded_games.length === waiting_games.length) 
                    callback(loaded_games)
            }
            gameXhr.send()
        }
    }
    xhr.send()
}
