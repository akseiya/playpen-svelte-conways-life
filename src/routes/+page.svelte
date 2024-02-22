<script lang="ts">
	import { jcon } from "$lib/debug";


  let board_size = 20;
  const blank_board = (size:number) => Array.from({length: size}, () => 
    Array(size).fill(false));

  let current_cells:boolean[][] = blank_board(board_size);

  current_cells[10][10] = true;
  current_cells[10][11] = true;
  current_cells[11][10] = true;
  current_cells[11][11] = true;
  current_cells[12][9] = true;

  const flip_cell = (x:number, y:number) =>
    current_cells[y][x] = !current_cells[y][x];

  const update_board = () => {
    const new_board = blank_board(board_size);
    
  }

</script>

<svelte:head>
  <title>Conway's Game of Life :: Svelte exercise</title>
</svelte:head>
<div class="life">
  <header>Conway's Game of Life</header>
  <main>
    <table class="board">
      <tbody>
      {#each current_cells as row, row_idx}
        <tr>
        {#each row as cell, cell_idx}
          <td class="{cell === true ? 'live' : 'dead'}"
              on:click={() => flip_cell(cell_idx, row_idx)}
          ></td>
        {/each}
        </tr>
      {/each}
      </tbody>
    </table>
  </main>
</div>

<style>

* {
  --color-bg-normal:      #070F00;
  --color-bg-faint:       #0A2000;
  --color-bg-strong:      #474;
  --color-content-normal: #DFC;
  --color-content-faint:  #7A7;
  --color-content-strong: #FFF;
}

div {
  font-family: Anta, sans-serif;
  font-size: 1.5vw;
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0; margin: 0;
  background-color: var(--color-bg-normal);
  color: var(--color-content-normal);
}

header {
  font-size: 3vw;
  border-bottom: 2px solid var(--color-content-faint);
  text-align: center;
}

table.board {
  background-color: var(--color-bg-faint);
  border-collapse: collapse;
  margin: 1em;
}

table.board td {
  font-size: 0.9vw;
  width: 2vw;
  height: 2vw;
  border: 1px solid var(--color-content-faint);
  text-align: center;
}

table.board td.live {
  background-color: var(--color-bg-strong);
}

</style>
