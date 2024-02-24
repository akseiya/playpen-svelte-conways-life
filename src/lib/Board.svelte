<script lang="ts">

export let current_cells:boolean[][];
export let living:boolean;

const flip_cell = (x:number, y:number) =>
  current_cells[y][x] = !current_cells[y][x];

$: width = current_cells[0].length;

</script>

<table class="board">
  <tbody>
  {#each current_cells as row, row_idx}
    <tr>
    {#each row as live, cell_idx (width * row_idx + cell_idx) }
      <td class="{ live ? 'live' : 'dead' }"
          on:click={() => living || flip_cell(cell_idx, row_idx)}
      ></td>
    {/each}
    </tr>
  {/each}
  </tbody>
</table>

<!-- <canvas width={800} height={400}/> -->

<style>
table.board {
  background-color: var(--color-bg-faint);
  border-collapse: collapse;
  margin: 1em;
  margin-left: auto;
  margin-right: auto;
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