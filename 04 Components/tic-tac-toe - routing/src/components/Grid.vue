<script setup lang="ts">
    import { defineProps } from 'vue'

  type Tile = { col: number, row: number }

  const props = defineProps<{
    rows: number,
    cols: number
  }>()

  const range = (length: number) => [... new Array(length)]

  function tiles(): Tile[][] {
    return range(props.rows).map((_, row) => range(props.cols).map((_, col) => ({col, row})))
  }
</script>

<template>
    <table id = 'board'>
        <tr v-for='row in tiles()'>
          <td name="tile" v-for='tile in row' class='cell'>
            <slot name="tile" v-bind='tile'></slot>
          </td>
        </tr>
    </table>
</template>

<style>
  .cell {
    width: 40px;
    height: 40px;
    border: 1px solid black;
  }
  table {
    border: 1px solid black;
    border-spacing: 0;
  }
</style>
