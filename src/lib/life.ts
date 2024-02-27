interface Board_Size {
  width:number; height:number;
}
interface Random_Board_Parms extends Board_Size {
  spawn_chance:number;
}
export const blank_board = (size:Board_Size):boolean[][] =>
  Array.from({ length: size.height }, () =>
    Array(size.width).fill(false));

export const random_board = (parms:Random_Board_Parms) =>
  Array.from({ length: parms.height }, () =>
    Array.from(
      { length: parms.width },
      () => Math.random() < parms.spawn_chance
  ));

export const count_neighbours = (
  current_cells: boolean[][],
  x: number, y: number,
  width: number, height: number,
  wrap = true
) => {
  let count = 0;
  for (let i = x - 1; i < x + 2; i++)
    for (let j = y - 1; j < y + 2; j++) {
      if (i === x && j === y) continue;
      if(!wrap && (
        i < 0 || j < 0 || i >= width || j >= height
      )) continue;
      const wrapped_i = (width + i) % width;
      const wrapped_j = (height + j) % height;
      if (current_cells[wrapped_j][wrapped_i]) count++;
    }
  return count;
}

export type Board_Update_Inputs = {
  current_cells:boolean[][];
  spawn:number[];  survive:number[];
  width:number;    height:number;
  wrap?: boolean;
}

export const updated_board = (parameters: Board_Update_Inputs) => {
  const {
    current_cells, spawn, survive, width, height, wrap
  } = parameters;
  return current_cells.map((row, y) =>
    row.map((is_live, x) => {
      const n = count_neighbours(current_cells, x, y, width, height, wrap);
      return (spawn.includes(n)) || (is_live && survive.includes(n));
    })
  );
}
