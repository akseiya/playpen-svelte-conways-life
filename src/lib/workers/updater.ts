import type { Board_Data } from '$lib/update_worker_interface';
import board from '$lib/life'

self.onmessage = (m:MessageEvent<Board_Data>) => {
  const { data } = m;
  const { current_cells, width, wrap, rules } = data;
  const { survive, spawn } = rules;
  const height = (current_cells.length / width)>>0;
  const new_cells = board.updated({
    current_cells, width, wrap, survive, spawn, height
  });
  self.postMessage(new_cells);
  // , '.', [new_cells.buffer]);
}
