<script lang="ts">
  import { createEventDispatcher as CED, SvelteComponent } from "svelte";
	import { state } from "./stores";

  import Icon from "./svg/Icons.svelte";
	import type { Playback_Command } from "./types";

  export let func:Playback_Command;

  const dispatch = CED<{ playback: { command: string } }>();

  let disabled:boolean = true;
  $: switch(func) {
    case 'pause': disabled = false; break;
    case 'start': disabled = $state.blank; break;
    case 'clear': case 'step': disabled = $state.blank || $state.living; break;
    case 'random':
      disabled = $state.living; break;
  }
</script>

<button {disabled}
        on:click={() => dispatch('playback', {command: func})}>
  {func}
  <Icon {func} {disabled}/>
</button>

<style>

button {
  margin: 0.5em;
  color: var(--color-content-normal);
  background-color: transparent;
  border: 0;
  font-family: anta, sans-serif;
  text-transform: uppercase;
}

@media screen and (hover: hover) {
  button:enabled:hover {
    color: var(--color-content-strong);
    border-color: var(--color-content-strong);
  }
}

button:disabled {
  color: var(--color-content-faint);
}

</style>