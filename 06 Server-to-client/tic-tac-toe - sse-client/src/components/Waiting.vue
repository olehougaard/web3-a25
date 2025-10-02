<script setup lang="ts">
  import * as api from '@/api/api'
  import { defineProps, onMounted, onUnmounted } from 'vue'
  import { store } from '@/api/store';
  const model = store()

  const props = defineProps<{gameNumber: number}>()

  onMounted(() => { 
    const events = new EventSource(`http://localhost:8080/games/${props.gameNumber}/events?type=game_updated`)

    events.onmessage = ({data}) => {
      const {ongoing, ...game} = JSON.parse(data)
      if (ongoing) model.startGame('X', game)
    }

    onUnmounted(() => { 
      events.close()
    })
  })

  async function waitForPlayer() {
    const game = await api.readGame(props.gameNumber)
    if (game.ongoing)
      model.startGame('X', game)
    else 
      setTimeout(waitForPlayer, 100)
  }

  onMounted(waitForPlayer)
</script>

<template>
  <h1>Waiting for other player...</h1>
</template>
