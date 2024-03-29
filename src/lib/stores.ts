import { writable } from "svelte/store";

export const tweaks = writable({
  wrap: true,

  rules: {
    spawn:    [3],
    survive:  [2,3],
  },

  spawn_chance: 0.1,

  update_delay: 1,

  theme: 'green'
});

export const state = writable({
  living: false,
  blank: true
});
