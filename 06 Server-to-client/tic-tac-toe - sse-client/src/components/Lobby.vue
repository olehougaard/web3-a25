<script setup lang="ts">
  import * as api from '@/api/api'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { store } from '@/api/store'

  const model = store()

  const newGameEvents = new EventSource('http://localhost:8080/games/events?type=new_game')
  const startingGameEvents = new EventSource('http://localhost:8080/games/events?type=game_starting')

  onMounted(async () => { 
    newGameEvents.onmessage = (message) => {
      const game = JSON.parse(message.data)
      model.games.push(game)
    }    
  
    newGameEvents.onerror = console.error
    
    startingGameEvents.onmessage = (message) => {
      const game = JSON.parse(message.data)
      model.games = model.games.filter(g => g.gameNumber != game.gameNumber)
    }    
  
    startingGameEvents.onerror = console.error
    
    model.games = await api.readGamesList()
  })

  onUnmounted(() => {
    newGameEvents.close()
    startingGameEvents.close()
  })

  const gameName = ref('game')

  async function newGame() {
    const game = await api.createGame(gameName.value)
    model.waitForPlayer('X', game)
  }

  async function join(gameNumber: number) {
    const game = await api.joinGame(gameNumber)
    model.startGame('O', game)
  }
</script>

<template>
  <div v-for="game in model.games">{{game.gameName}} <button @click="join(game.gameNumber)">Join</button></div>
  <input type="text" v-model="gameName"/> <button @click="newGame()">Create</button>
</template>
