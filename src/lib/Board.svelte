<script lang="ts">

import { onMount } from "svelte";
	import type { Theme } from "./themes";
	import { jcon, jdmp } from "./debug";


export let current_cells:boolean[][];
export let cell_size:number;
export let living:boolean;
export let theme:Theme;

const flip_cell = (x:number, y:number) =>
  current_cells[y][x] = !current_cells[y][x];

$: width = current_cells[0].length;
$: height = current_cells.length;

let board:HTMLCanvasElement;
let live_context:CanvasRenderingContext2D;
let image_data:ImageData;

onMount(() => {
  live_context = board.getContext('2d', { /*alpha: false*/ })!
  live_context.fillStyle = theme.color.bg.faint;
  live_context.fillRect(0,0,board.width,board.height);
  image_data = live_context.getImageData(0, 0, board.width, board.height);
});

const split_colour = (c:string) => {
  const scale = (c.length / 3)>>0;
  const hexes = [0, 1, 2].map(
    i => c.substr(i * scale + 1, scale)
  );
  return [...hexes.map(hex => parseInt('0x' + hex + (scale == 1 ? hex : ''))), 255];
}
const live_colour = split_colour(theme.color.bg.strong);
const dead_colour = split_colour(theme.color.bg.faint);

const draw_cells_with_rects = () => {
  current_cells.forEach((row, y) => {
    row.forEach((live, x) => {
      live_context.fillStyle = live ?
        theme.color.bg.strong : theme.color.bg.faint;
      const c_x = x * cell_size, c_y = y * cell_size;
      live_context.fillRect(c_x, c_y, c_x + cell_size, c_y + cell_size);
    })
  })
}

const draw_cells_with_pixels = () => {
  let cell_colour:number[];
  let pix_num:number, cell_num:number, cell_y = -1;
  for(let i = 0; i < image_data.data.length; i++) {
    pix_num = i >> 2;
    const pix_x = pix_num % image_data.width;
    const pix_y = (pix_num - pix_x) / image_data.width;
    const cell_x = (pix_x / cell_size) >> 0;
    cell_y = (pix_y / cell_size) >> 0;
    // console.log(`${cell_x},${cell_y} - ${current_cells[cell_y][cell_x]}`);
    try {
      cell_colour = current_cells[cell_y][cell_x] ? live_colour : dead_colour;
    } catch(e) {
      jcon({i, pix_num, pix_x, pix_y, cell_x,cell_y,done:(i/image_data.data.length)});
      throw e;
    }
    image_data.data[i] = cell_colour[i & 3];
  }
  live_context.putImageData(image_data, 0, 0);
}

const dump_board = (board:boolean[][]) => {
  console.log(board.map(row => row.map(cell => cell ? '▉' : ' ').join('')).join('\n'))
}

const draw_cells_from_map = () => {
  image_data.data.set(current_cells.
    map(row => Array(cell_size).fill(row)).flat().  // clone rows
    map(row => row.map(                             // clone cells
      (cell:boolean) => Array(cell_size).fill(cell)
    )).flat(2).
    map((cell:boolean) => cell ? live_colour : dead_colour).flat());
  live_context.putImageData(image_data, 0, 0);
}

$: (() => {
  if (live_context === undefined) return;
  if (current_cells === undefined && current_cells[0] === undefined) return;
  // draw_cells_with_rects();
  draw_cells_from_map();
})();

</script>

<!-- <p>{jdmp({
  strong: split_colour(theme.color.bg.strong),
  faint: split_colour(theme.color.content.faint),
})}</p> -->
<canvas bind:this={board}
        width={width * cell_size}
        height={height * cell_size}
/>


<style>

canvas {
  background-color: var(--color-bg-faint);
  color: white;
}

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