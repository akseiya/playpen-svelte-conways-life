<script lang="ts">

import { game_state, tweaks } from '$lib/stores';
import   board from "$lib/life";
import { known_patterns } from './patterns';

import Playback from './Playback.svelte';

let current_cells:boolean[][] = board.blank($tweaks);
let step_count = 0;

const clear_board = () => {
  current_cells = board.blank($tweaks);
  step_count = 0;
}

const rand_board = () => {
  current_cells = board.random($tweaks);
  step_count = 0;
}

const use_known_pattern = (name:keyof typeof known_patterns) => {
  const pattern = known_patterns[name];
  current_cells = pattern.applied_to(board.blank($tweaks));
  $tweaks.wrap = pattern.wrap;
  step_count = 0;
}

const live_a_step = () => {
  current_cells = board.updated({
    ...$tweaks,
    ...$tweaks.rules,
    current_cells,
  });
  step_count++;
}

let life_timer:number;

const life_loop = () => {
  live_a_step();
  life_timer = setTimeout(life_loop, $tweaks.update_delay);
}

const start_life = () => {
  $game_state.living = true;
  life_timer = setTimeout(life_loop, $tweaks.update_delay);
}

const stop_life= () => {
  $game_state.living = false;
  clearTimeout(life_timer);
}

const execute_command = (command:string) => {
  switch(command) {
    case 'start':  start_life();  break;
    case 'stop':   stop_life();   break;
    case 'step':   live_a_step(); break;
    case 'clear':  clear_board(); break;
    case 'random': rand_board();  break;
    default: throw new
      TypeError(`Wrong playback command ${command} issued!`);
  }
}

const flip_cell = (x:number, y:number) =>
  current_cells[y][x] = !current_cells[y][x];

const cell_num = (x:number, y:number) => $tweaks.width * y + x;

</script>

<table class="board" class:nowrap={!$tweaks.wrap}>
  <tbody>{#each current_cells as row, row_idx}
    <tr>{#each row as live, cell_idx (cell_num(cell_idx, row_idx)) }
      <td class:live
          on:click={() => flip_cell(cell_idx, row_idx)}
      ></td>
    {/each}</tr>
  {/each}</tbody>
</table>
<Playback on:playback=   { e => execute_command(e.detail.command) }
          on:use_pattern={ e => use_known_pattern(e.detail.pattern) }/>

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
  width: 4px;
  height: 4px;
  border: 0px solid var(--color-content-faint);
  padding: 0;
  margin: 0;
  cursor: none;
}
table.board td.live {
  background-color: var(--color-bg-strong);
}

@media screen and (hover: hover) {
  table.board td:hover, td.live:hover {
    background-color: var(--color-content-strong);
  }
}

</style>