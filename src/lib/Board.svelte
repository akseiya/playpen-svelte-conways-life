<script lang="ts">

import { game_state, tweaks } from '$lib/stores';

export let current_cells:boolean[][];

const flip_cell = (x:number, y:number) =>
  current_cells[y][x] = !current_cells[y][x];

// $: width = current_cells[0].length;
const cell_num = (x:number, y:number) => $tweaks.width * y + x;

</script>

<table class="board" class:nowrap={!$tweaks.wrap}>
  <tbody>
  {#each current_cells as row, row_idx}
    <tr>
    {#each row as live, cell_idx (cell_num(cell_idx, row_idx)) }
      <td class:live
          on:click={() => $game_state.living || flip_cell(cell_idx, row_idx)}
      ></td>
    {/each}
    </tr>
  {/each}
  </tbody>
</table>

<style>
table.board {
  background-color: var(--color-bg-faint);
  border-collapse: collapse;
  margin: 1em;
  margin-left: auto;
  margin-right: auto;
}
table.board.nowrap {
  border: 1px solid var(--color-content-strong)
}
table.board td {
  width: 3px;
  height: 3px;
  border: 0px solid var(--color-content-faint);
  padding: 0;
  margin: 0;
  cursor: none;
}
table.board td.live {
  background-color: var(--color-bg-strong);
}
table.board td:hover, td.live:hover {
  background-color: var(--color-content-strong);
}
</style>