import { writable } from "svelte/store";

export const tweaks = writable({
  width: 200,
  height: 120,
  wrap: true,

  rules: {
    spawn: [3],
    survive: [2,3],
  },

  spawn_chance: 0.1,

  update_delay: 1,

  theme: 'green'
});

export const game_state = writable({
  living: false,
});