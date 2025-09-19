<script setup lang="ts">
  import { computed, onMounted, inject } from 'vue'
  import { model } from '@/api/store'
  import type { API } from '@/api/api'
  import Grid from './Grid.vue'

  const api = inject<API>('api')

  const enabled = computed(() => model.player === model.game.inTurn)

  const board = computed(() => model.game.board ?? [[]])

  function finished() {
    return model.game.stalemate || model.game.winState
  }

  function message() {
    if (enabled.value)
      return 'Your turn, ' + model.player
    else
      return 'Waiting for other player to move...'
  }

  async function makeMove(x: number, y: number) {
    if (enabled.value) {
      const {move, ...move_props} = await api.createMove(model.game.gameNumber!, {x, y, player: model.player!})
      model.makeMove(move)
      model.applyGameProperties(move_props)
      if (!finished())
        waitForMove()
    }
  }

  async function waitForMove() {
    const { moves, ...game_props } = await api.readMoves(model.game.gameNumber!)
    if (game_props.inTurn === model.player) {
      const move = moves[moves.length - 1]
      if (!move.conceded) model.makeMove(move)
      model.applyGameProperties(game_props)
    } else 
      setTimeout(waitForMove, 1000)
  }

  async function concede() {
    const {winState} = await api.concede(model.game.gameNumber!, model.player === 'X' ? 'O' : 'X')
    model.applyGameProperties({winState})
  }

  onMounted(() => {
    if (model.game.inTurn !== model.player) waitForMove()
  })

</script>

<template>
  <div id = 'game'>
    <p id = 'messages'>{{ message() }}</p>
    <grid :rows="board.length" :cols="board[0].length">
      <template #tile="{row, col}">
        <div class = 'tile' :class='board[row][col] ?? "blank"' @click='makeMove(col, row)'></div>
      </template>
    </grid>
    <button v-if="enabled" @click="concede">Concede</button>
  </div>
</template>
