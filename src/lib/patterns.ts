// import { jcon } from './debug';
import shape_defs from './patterns.txt?raw'

type Align_To = 'left' | 'right' | 'top' | 'bottom';
type Alignment_Spec =  { [k in Align_To]?: (number | 'middle') }
type Cells = boolean[][];
class Pattern_Align {
  x0: number = 0; y0: number = 0;
  x(x:number) { return this.x0 + x }
  y(y:number) { return this.y0 + y }

  constructor(
    pattern: Cells, board: Uint8Array,
    b_width: number, align:Alignment_Spec
  ) {
    const board_height = (board.length / b_width)>>0;
    const height={board: board_height,    pattern: pattern.length};
    const width ={board: b_width, pattern: pattern[0].length};

    if (align.right === 'middle' || align.left === 'middle')
      this.x0 = (width.board - width.pattern) >> 1;
    else {
      if ('left' in align) this.x0 = align.left as number;
      else if ('right' in align) this.x0 =
        width.board - width.pattern - (align.right as number);
    }
    if (align.top === 'middle' || align.bottom === 'middle')
      this.y0 = (height.board - height.pattern) >> 1;
    else {
      if ('top' in align) this.y0 = align.top as number;
      else if ('bottom' in align)
        this.y0 = height.board - height.pattern - (align.bottom as number);
    }
  }
}

export class Pattern {
  cells: boolean[][];
  default_alignment: Alignment_Spec = { top: 'middle', left: 'middle' };
  wrap: boolean = true;
  constructor (cells: string[], positioning?:string) {
    this.cells = cells.map(
      row => row.split('').map(cell => cell !== ' ')
    );
    const opposites:Record<Align_To, Align_To> = {
      top: 'bottom', bottom: 'top', left: 'right', right: 'left'
    };
    if (positioning)
      for(const directive of positioning.split(',')) {
        if (directive === 'rotate') this.rotate();
        if (directive === 'nowrap') this.wrap = false;
        const [dir, spec] = directive.split(':');
        if(dir === 'mirror') this.mirror(spec.startsWith('v'));
        if(dir in opposites) {
          delete this.default_alignment[opposites[dir as Align_To]];
          this.default_alignment[dir as Align_To] =
            spec === 'middle' ? spec : Number(spec);
        }
      }
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
    board:Uint8Array,
    width: number,
    alignment:Alignment_Spec = this.default_alignment
  ) {
    const align = new Pattern_Align(this.cells, board, width, alignment);
    this.cells.
      forEach((row, y) => row.forEach(
        (cell, x) => board[align.y(y) * width + align.x(x)] = Number(cell)
      ));
    return board;
  }
}

const patterns_space:Record<string, Pattern> = {};

shape_defs.split('---\n').
  map(def => def.split('\n')).forEach(def_lines => {
    const lines = [...def_lines];
    const [name, positioning] = lines.shift()!.split('::');
    patterns_space[name] = new Pattern(lines, positioning);
  });

export const known_patterns = patterns_space;
