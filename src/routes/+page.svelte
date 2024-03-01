<script lang="ts">
	import { onMount } from "svelte";

  import Board from "$lib/Board.svelte";
	import Tweakpad from "$lib/Tweakpad.svelte";

	import { state, tweaks } from "$lib/stores";
	import { apply_theme, themes } from "$lib/themes";

  // from a cookie?
  const width = 180;
  const height = 180;

  Object.assign($tweaks, {
    width:180, height:180, wrap:true,
    spawn:[3], survive:[2,3],
    spawn_chance:0.1,
    update_delay:0,
    theme:'green'
  });
  Object.assign($state, { living: false, blank: true });

  onMount(() => { apply_theme($tweaks.theme) });

</script>

<svelte:head>
  <title>Conway's Game of Life :: Svelte exercise</title>
</svelte:head>
<div class="life" style="background-color: {themes[$tweaks.theme].color.bg.normal}">
  <header>Conway's Game of Life</header>
  <main>
    <Board {width} {height}/>
    <Tweakpad/>
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

</style>
