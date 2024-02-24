export const blank_board = (
  width: number, height: number
):boolean[][] =>
  Array.from({ length: height }, () =>
    Array(width).fill(false));

export const random_board = (width:number, height:number, chance:number = 0.1) => 
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Math.random() < chance));

type Align_To = 'left' | 'right' | 'top' | 'bottom';
type Alignment_Spec =  { [k in Align_To]?: (number | 'middle') }
type Cells = boolean[][];
class Pattern_Align {
  x0: number = 0; y0: number = 0;
  constructor(
    pattern: Cells, board: Cells,
    align:Alignment_Spec
  ) {
    if ('left' in align && 'right' in align)
      throw new SyntaxError('Specify either right: or left:');
    if ('top' in align && 'bottom' in align)
      throw new SyntaxError('Specify either top: or bottom:');

    const height = { board: board.length,    pattern: pattern.length };
    const width  = { board: board[0].length, pattern: pattern[0].length };

    if (align.right === 'middle' || align.left === 'middle')
      this.x0 = (width.board - width.pattern) >> 1;
    else {
      if ('left' in align) this.x0 = align.left as number;
      if ('right' in align) this.x0 =
        width.board - width.pattern - (align.right as number);
    }
    if (align.top === 'middle' || align.bottom === 'middle')
      this.y0 = (height.board - height.pattern) >> 1;
    else {
      if ('top' in align) this.y0 = align.top as number;
      if ('bottom' in align)
        this.y0 = height.board - height.pattern - (align.bottom as number);
    }
  }
  x(x:number) { return this.x0 + x }
  y(y:number) { return this.y0 + y }
}

export class Pattern {
  cells: boolean[][];
  constructor (src: string[]) {
    this.cells = src.map(
      row => row.split('').map(cell => cell !== ' ')
    );
  }
  rotate() {
    const new_cells = Array.from(
      { length: this.cells[0].length },
      (_, y) => Array.from(
        { length: this.cells.length },
        (_, x) => this.cells[x][y]
      )
    );
    this.cells = new_cells;
    return this;
  }
  mirror(vertical = true) {
    if (vertical) {
      this.cells.forEach(row => row.reverse());
      return this;
    }
    this.cells.reverse();
    return this;
  }
  applied_to(
    board:boolean[][],
    alignment:Alignment_Spec = { left: 'middle', top: 'middle' }
  ) {
    const align = new Pattern_Align(this.cells, board, alignment);
    this.cells.
      forEach((row, y) => row.forEach(
        (cell, x) => board[align.y(y)][align.x(x)] = cell
      ));
    return board;
  }
}

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

