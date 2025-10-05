<script setup lang="ts">
  import type { Game } from '@/api/model'
  import { computed, defineEmits, onMounted, onUnmounted } from 'vue'
  import * as api from '@/api/api'
  import BoardView from '@/components/Board.vue'
  import { store } from '@/api/store'
  const model = store()

  const enabled = computed(() => model.player === model.game.inTurn)

  let emit = defineEmits({
    gameFinished(game: Game) {
      return game.stalemate || game.winState
    }
  })

  const board = computed(() => model.game.board ?? [[]])


  async function makeMove(x: number, y: number) {
    if (enabled.value) {
      await api.createMove(model.game.gameNumber!, {x, y, player: model.player!})
    }
  }

  onMounted(() => { 
    const events = new EventSource(`http://localhost:8080/games/${model.game.gameNumber}/events?type=move`)

    events.onmessage = ({data}) => {
      const message = JSON.parse(data)
      if (message.type === 'conceded') {
        const {type, ...game_data} = message
        model.applyGameProperties(game_data)
      } else {
        const {type, move, ...game_data} = message
        model.makeMove(move)
        model.applyGameProperties(game_data)
      } 
    }   

    onUnmounted(() => { 
      events.close() 
    })
  })

  async function concede() {
    const {winState} = await api.concede(model.player!, model.game.gameNumber!)
    model.applyGameProperties({winState})
  }

</script>

<template>
  <div id = 'game'>
    <p id = 'messages' v-if='enabled'>Your turn, {{ model.player }}</p>
    <p id = 'messages' v-else='enabled'>Waiting for other player to move...</p>
    <board-view :enabled='enabled' :board='board' @click='makeMove'/>
    <button v-if="enabled" @click="concede">Concede</button>
  </div>
</template>
