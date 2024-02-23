<script lang="ts">
	import {
	acorn_pattern,
    apply_pattern_at,
    blank_board,
    patterns,
    puffer_pattern,
    random_board,
    thingy_pattern,
    updated_board
  } from "$lib/life";

  let width = 220;
  let height = 150;
  let wrap = true;
  let spawn = [3];
  let survive = [2,3]
  let live_chance = 0.4;

  let current_cells:boolean[][] = blank_board(width, height);

  const use_pattern = (
    pattern:string[],
    x:number, y:number,
    rotate: boolean = false
  ) => {
    const fresh_cells = blank_board(width, height);
    apply_pattern_at(x, y, pattern, fresh_cells, rotate);
    current_cells = fresh_cells;
  }

  const center_pattern = (
    pattern:string[],
    horizontally:boolean,
    rotated: boolean = false
  ) =>
    ((horizontally ? width : height) >> 1) -
    (((horizontally || (!horizontally && rotated)) ?
      pattern[0].length :
      pattern.length) >> 1);


  const use_puffer = () => {
    use_pattern(
      puffer_pattern,
      1 + puffer_pattern.length,
      (height >> 1) - (puffer_pattern[0].length >> 1),
      true
    );
    wrap = false;
  }

  const use_acorn = () => {
    use_pattern(
      acorn_pattern,
      center_pattern(acorn_pattern, true),
      center_pattern(acorn_pattern, false)
    );
    wrap = true;
  }

  const use_thingy = () => {
    use_pattern(
      thingy_pattern,
      34,
      center_pattern(acorn_pattern, false) - 5
    );
    wrap = true;
  }

  const use_ecologist = () => {
    use_pattern(
      patterns.ecologist,
      center_pattern(acorn_pattern, true),
      center_pattern(acorn_pattern, false)
    );
    wrap = true;
  }

  const flip_cell = (x:number, y:number) =>
    current_cells[y][x] = !current_cells[y][x];
  
  let update_delay = 1;

  const live_a_step = () => {
    current_cells = updated_board({
      current_cells, spawn, width, height, wrap, survive
    });
  }

  let living = false;
  let life_timer:number;

  const life_loop = () => {
    live_a_step();
    life_timer = setTimeout(life_loop, update_delay);
  }

  const start_life = () => {
    living = true;
    life_timer = setTimeout(life_loop, update_delay);
  }

  const stop_life= () => {
    living = false;
    clearTimeout(life_timer);
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
              on:click={() => living || flip_cell(cell_idx, row_idx)}
          ></td>
        {/each}
        </tr>
      {/each}
      </tbody>
    </table>
    <button on:click={ living ? stop_life : start_life } type="button">{ living ? 'STOP' : 'START' }</button>
    <button disabled={living} on:click={live_a_step}>STEP</button>
    <button disabled={living} on:click={() => {current_cells = blank_board(width, height)}}>CLEAR</button>
    <button disabled={living} on:click={() => {current_cells = random_board(width, height, live_chance)}}>RANDOM</button>
    <button disabled={living} on:click={use_acorn}>ACORN</button>
    <button disabled={living} on:click={use_puffer}>PUFFER</button>
    <button disabled={living} on:click={use_thingy}>Simple growth</button>
    <button disabled={living} on:click={use_ecologist}>Ecologist</button>
    <button disabled={living} on:click={() => { wrap = !wrap }}>{ wrap ? 'NO WRAP' : 'WRAP'}</button>
  </main>
</div>

<style>

* {
  --color-bg-normal:      #070F00;
  --color-bg-faint:       #0A2000;
  --color-bg-strong:      #474;
  --color-content-normal: #DFC;
  --color-content-faint:  #474;
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
  font-size: 3vh;
  border-bottom: 2px solid var(--color-content-faint);
  text-align: center;
}

table.board {
  background-color: var(--color-bg-faint);
  border-collapse: collapse;
  margin: 1em;
  margin-left: auto;
  margin-right: auto;
}

table.board td {
  width: 5px;
  height: 5px;
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
