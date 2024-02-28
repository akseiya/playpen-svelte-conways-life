<script lang="ts">
  import { createEventDispatcher as CED} from "svelte";

  import Playback_Button from "./Playback_Button.svelte";
	import { known_patterns } from "./patterns";
  import { game_state } from "./stores";

  const dispatch = CED<{ use_pattern: { pattern: string } }>();

  let disabled:boolean;
  let start_stop:string;
  let playback_functions:string[];

  $: disabled = $game_state.living;
  $: start_stop = $game_state.living ? 'stop' : 'start';
  $: playback_functions = [start_stop, 'step', 'clear', 'random'];
</script>

{#each playback_functions as func}
  <Playback_Button {disabled} {func} on:playback/>
{/each}

{#each Object.keys(known_patterns) as shape_name}
  <button {disabled} on:click={
    () => dispatch('use_pattern', {pattern: shape_name})
  }>
    {shape_name}
  </button>
{/each}

<style>

button {
  text-transform: capitalize;
}

</style>