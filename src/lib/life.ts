interface Board_Size {
  width:number; height:number;
}
interface Random_Board_Parms extends Board_Size {
  spawn_chance:number;
}

const blank_board = (size:Board_Size) => {
  const { width, height} = size;
  return new Uint8Array([...Array(width*height)]);
}

const random_board = (parms:Random_Board_Parms) =>
  new Uint8Array(Array.from(
    { length: parms.width * parms.height},
    () => Math.random() < parms.spawn_chance ? 1 : 0
  ));

const count_neighbours = (
  current_cells: Uint8Array,
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
      if (current_cells[wrapped_j * width + wrapped_i]) count++;
    }
  return count;
}

type Board_Update_Inputs = {
  current_cells:Uint8Array;
  spawn:number[];  survive:number[];
  width:number;    height:number;
  wrap?: boolean;
}

const updated_board = (parameters: Board_Update_Inputs) => {
  const {
    current_cells, spawn, survive, width, height, wrap
  } = parameters;
  return current_cells.map((live, i) => {
    const n = count_neighbours(
      current_cells, i % width, (i/width)>>0, width, height, wrap
    );
    return Number((spawn.includes(n)) || (live && survive.includes(n)));
  });
}

export default {
  blank: blank_board,
  random: random_board,
  updated: updated_board
}