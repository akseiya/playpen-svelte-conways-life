<script lang="ts">
  import { createEventDispatcher as CED} from "svelte";

  import Playback_Button from "./Playback_Button.svelte";
	import { known_patterns } from "./patterns";
  import { state } from "./stores";

  const dispatch = CED<{ use_pattern: { pattern: string } }>();

  let disabled:boolean;
  let start_pause:string;
  let playback_functions:string[];

  $: disabled = $state.living;
  $: start_pause = $state.living ? 'pause' : 'start';
  $: playback_functions = [start_pause, 'step', 'clear', 'random'];
</script>

{#each playback_functions as func}
  <Playback_Button {func} on:playback/>
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