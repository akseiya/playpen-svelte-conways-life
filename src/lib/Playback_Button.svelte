<script lang="ts">
  import { createEventDispatcher as CED } from "svelte";
	import { state } from "./stores";

  type Playback_Command = 'start' | 'stop' | 'step' | 'clear' | 'random';

  export let func:string;

  const dispatch = CED<{ playback: { command: string } }>();

  let icon:string;
  $: icon = {
    start: 'play_arrow', stop: 'pause', clear: 'stop',
    step: 'skip_next', random: 'casino'
  }[func as Playback_Command];

  let disabled:boolean = true;
  $: switch(func) {
    case 'stop': disabled = false; break;
    case 'start': disabled = $state.blank; break;
    case 'clear': case 'step': disabled = $state.blank || $state.living; break;
    case 'random':
      disabled = $state.living; break;
  }
  // const can_disable = !['start', 'stop'].includes(func);
</script>

<button class="icons-font"
        {disabled}
        on:click={() => dispatch('playback', {command: func})}>
  {icon}
</button>

<style>

button {
  font-size: 30px;
  font-variation-settings: 'FILL' 1;
  background-color: var(--color-bg-strong);
  margin: 0.5em;
  border: 0.1em solid var(--color-bg-strong);
  border-radius: 50%;
  padding: 0.3em;
  color: var(--color-content-normal);
}

button:enabled {
   border-color: var(--color-content-normal);
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