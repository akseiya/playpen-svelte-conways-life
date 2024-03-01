export type Board_Data = {
  current_cells: Uint8Array;
  width: number;
  wrap: boolean;
  rules: {
    spawn: number[],
    survive: number[]
  },
}
