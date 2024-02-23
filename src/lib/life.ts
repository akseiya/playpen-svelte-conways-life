export const blank_board = (
  width: number, height: number
):boolean[][] =>
  Array.from({ length: height }, () =>
    Array(width).fill(false));

export const random_board = (width:number, height:number, chance:number = 0.1) => 
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Math.random() < chance));

export const thingy_pattern = [
  '       ▉      ',
  '      ▉ ▉     ',
  '      ▉ ▉     ',
  '       ▉      ',
  '              ',
  '  ▉▉       ▉▉ ',
  '▉▉  ▉     ▉  ▉',
  '  ▉▉       ▉▉ ',
  '              ',
  '       ▉      ',
  '      ▉ ▉     ',
  '      ▉ ▉     ',
  '       ▉      ',
];

export const acorn_pattern = [
  ' ▉     ',
  '   ▉   ',
  '▉▉  ▉▉▉',
];

export const puffer_pattern = [
  ' ▉▉▉      ▉     ▉      ▉▉▉ ',
  '▉  ▉     ▉▉▉   ▉▉▉     ▉  ▉',
  '   ▉    ▉▉ ▉   ▉ ▉▉    ▉   ',
  '   ▉                   ▉   ',
  '   ▉  ▉             ▉  ▉   ',
  '   ▉  ▉▉           ▉▉  ▉   ',
  '  ▉   ▉▉           ▉▉   ▉  ',
];

export const patterns = {
  puffer: puffer_pattern,
  acorn: acorn_pattern,
  thingy: thingy_pattern,
  ecologist: [
    '▉▉▉▉     ▉▉        ',
    '▉   ▉   ▉▉ ▉▉      ',
    '▉        ▉▉▉▉      ',
    ' ▉  ▉     ▉▉       ',
    '                   ',
    '     ▉         ▉▉  ',
    '   ▉▉▉        ▉▉▉▉▉',
    '  ▉   ▉     ▉    ▉▉',
    '  ▉    ▉▉▉▉▉     ▉▉',
    '  ▉▉ ▉ ▉▉▉▉    ▉▉  ',
    '    ▉   ▉▉ ▉▉▉     ',
    '     ▉ ▉           ',
    '                   ',
    '                   ',
    '▉▉▉▉               ',
    '▉   ▉              ',
    '▉                  ',
    ' ▉  ▉              ',
  ]
}

export const apply_pattern_at = (
  x:number, y:number,
  pattern:string[], board:boolean[][],
  rotate = false
) =>
  pattern.forEach((row, p_y) => row.split('').forEach(
    (char, p_x) => char === ' ' || (
      board[y + (rotate ? p_x : p_y)][x + (rotate ? -p_y : p_x)] = true
    )
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

