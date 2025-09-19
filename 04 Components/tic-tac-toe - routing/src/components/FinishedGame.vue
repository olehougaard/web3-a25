<script setup lang="ts">
  import { computed } from 'vue'
  import { model } from '@/api/store'
  import { useRouter } from 'vue-router'
  import Grid from './Grid.vue'

  const router = useRouter()
  const board = computed(() => model.game?.board ?? [[]])

  function message() {
      if (model.game.stalemate) 
        return 'Stalemate'
      else
        return model.game.winState?.winner + ' won!'
  }

  function goToLobby() {
    model.endGame()
    router.push("/")
  }
</script>

<template>
  <div id = 'game'>
    <p id = 'messages'>{{ message() }}</p>
    <grid :rows="board.length" :cols="board[0].length">
      <template #tile="{row, col}">
        <div class='tile' :class='board[row][col] ?? "inert"'></div>
      </template>
    </grid>
    <button @click="goToLobby()">Return to lobby</button>
  </div>
</template>
