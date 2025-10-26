function games_waiting_for_player(player, callback) {
  fetch('http:/localhost:8080/active')
    .then(res => res.json())
    .then(games => games.filter(g => g.player_in_turn !== undefined))
    .then(active_games => active_games.filter(g => g.players[g.player_in_turn] === player))
    .then(waiting_games => waiting_games.map(g => fetch(`http://localhost:8000/active/${g.id}`)))
    .then(Promise.all)
    .then(callback)
}
