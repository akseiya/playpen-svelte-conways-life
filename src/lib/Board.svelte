<script lang="ts">

import { state, tweaks } from '$lib/stores';
import   board from "$lib/life";
import { known_patterns } from './patterns';

import Playback from './Playback.svelte';

import Board_Updater from "$lib/workers/updater?worker";
import { onMount } from 'svelte';

export let width:number, height:number;

let current_cells = new Uint8Array(width * height);
let step_count:number;

let updater:Worker;
onMount(() => {
  updater = new Board_Updater();
  updater.onmessage = (e) => {
    current_cells = e.data;
    if ($state.living) setTimeout(live_a_step, $tweaks.update_delay);
  }
});

const clear_board = () => {
  current_cells = board.blank({ width, height });
  $state.blank = true;
  step_count = 0;
}
clear_board();

const rand_board = () => {
  current_cells = board.random({ ...$tweaks, width, height });
  $state.blank = false;
  step_count = 0;
}

const use_known_pattern = (name:keyof typeof known_patterns) => {
  const pattern = known_patterns[name];
  current_cells = pattern.applied_to(board.blank({ width, height }), width);
  $tweaks.wrap = pattern.wrap;
  $state.blank = false;
  step_count = 0;
}

const live_a_step = () => {
  updater.postMessage(
    {current_cells, width, ...$tweaks},
    [current_cells.buffer]
  );
  step_count++;
}

const start_life = () => {
  $state.living = true;
  live_a_step();
}

const stop_life= () => { $state.living = false; }

const execute_command = (command:string) => {
  switch(command) {
    case 'start':  start_life();  break;
    case 'pause':  stop_life();   break;
    case 'step':   live_a_step(); break;
    case 'clear':  clear_board(); break;
    case 'random': rand_board();  break;
    default: throw new
      TypeError(`Wrong playback command ${command} issued!`);
  }
}

const flip_cell = (x:number, y:number) => {
  const offset = y * width + x;
  const is_live = current_cells[offset];
  current_cells[offset] = Number(!is_live);
  $state.blank = false;
}
const cell_num = (x:number, y:number) => width * y + x;

const widther = Array(height);
const heighter = Array(height);

</script>

<table class="board" class:nowrap={!$tweaks.wrap}>
  <tbody>{#each heighter as row, row_idx}
    <tr>{#each widther as col, cell_idx (cell_num(cell_idx, row_idx)) }
      <!-- id={`cell-${cell_idx}-${row_idx}`} -->
      <td class:live={current_cells[row_idx*width + cell_idx]}
          on:click={() => flip_cell(cell_idx, row_idx)}
      ></td>
    {/each}</tr>
  {/each}</tbody>
</table>
<Playback on:playback=   { e => execute_command(e.detail.command) }
          on:use_pattern={ e => use_known_pattern(e.detail.pattern) }/>

<style>
table {
  background-color: var(--color-bg-faint);
  border-collapse: collapse;
  margin: 0.4em;
}
table.nowrap {
  border: 1px solid var(--color-content-strong)
}
td {
  width: 2px;
  height: 2px;
  padding: 0;
  margin: 0;
  cursor: none;
}
@media (min-width: 580px) and (min-height: 680px) {
  td { width: 3px; height: 3px; }
}
@media (min-width: 760px) and (min-height: 860px) {
  td { width: 4px; height: 4px; }
}
td.live {
  background-color: var(--color-content-faint);
}
@media screen and (hover: hover) {
  table.board td:hover, td.live:hover {
    background-color: var(--color-content-strong);
  }
}

</style>