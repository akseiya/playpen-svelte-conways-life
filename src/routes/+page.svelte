<script lang="ts">
	import { onMount } from "svelte";

  import Board from "$lib/Board.svelte";
	import Tweakpad from "$lib/Tweakpad.svelte";

	import { game_state, tweaks } from "$lib/stores";

  import {
    blank_board,
    random_board,
    updated_board
  } from "$lib/life";
	import { apply_theme, themes } from "$lib/themes";
	import { known_patterns } from "$lib/patterns";

  let step_count = 0;

  // from a cookie?
  Object.assign($tweaks, {
    width:200, height:140, wrap:true,

    spawn:[3], survive:[2,3],

    spawn_chance:0.1,

    living:false,
    update_delay:1,

    theme:'green'
  });

  let current_cells:boolean[][] = blank_board($tweaks);

  const clear_board = () => {
    current_cells = blank_board($tweaks);
    step_count = 0;
  }

  const rnd_board = () => {
    current_cells = random_board($tweaks);
    step_count = 0;
  }

  const use_known_pattern = (name:keyof typeof known_patterns) => {
    const pattern = known_patterns[name];
    current_cells = pattern.applied_to(blank_board($tweaks));
    $tweaks.wrap = pattern.wrap;
    step_count = 0;
  }

  const live_a_step = () => {
    current_cells = updated_board({
      ...$tweaks,
      ...$tweaks.rules,
      current_cells,
    });
    step_count++;
  }

  let life_timer:number;

  const life_loop = () => {
    live_a_step();
    life_timer = setTimeout(life_loop, $tweaks.update_delay);
  }

  const start_life = () => {
    $game_state.living = true;
    life_timer = setTimeout(life_loop, $tweaks.update_delay);
  }

  const stop_life= () => {
    $game_state.living = false;
    clearTimeout(life_timer);
  }

  onMount(() => {
    apply_theme($tweaks.theme);
  });

</script>

<svelte:head>
  <title>Conway's Game of Life :: Svelte exercise</title>
</svelte:head>
<div class="life" style="background-color: {themes[$tweaks.theme].color.bg.normal}">
  <header>Conway's Game of Life</header>
  <main>
    <Board {...{current_cells}}/>
    <p>{step_count}</p>
    <Tweakpad/>
    <button on:click={$game_state.living ? stop_life : start_life }>
      { $game_state.living ? 'STOP' : 'START' }
    </button>
    <button disabled={$game_state.living} on:click={live_a_step}>
      STEP
    </button>
    <button disabled={$game_state.living} on:click={clear_board}>
      CLEAR
    </button>
    <button disabled={$game_state.living} on:click={rnd_board}>
      RANDOM
    </button>
    {#each Object.keys(known_patterns) as shape_name}
      <button disabled={$game_state.living}
              on:click={() => use_known_pattern(shape_name)}>
        {shape_name}
      </button>
    {/each}
  </main>
</div>

<style>

div.life {
  font-family: Anta, sans-serif;
  font-size: 1.5vw;
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0; margin: 0;
  background-color: var(--color-bg-normal);
  color: var(--color-content-normal);
}

header {
  font-size: 3vh;
  border-bottom: 2px solid var(--color-content-faint);
  text-align: center;
}

button {
  text-transform: capitalize;
}

</style>
