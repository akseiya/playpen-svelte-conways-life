<script lang="ts">
  import { createEventDispatcher as CED } from "svelte";
  type Playback_Command = 'start' | 'stop' | 'step' | 'clear' | 'random';
  export let disabled:boolean;
  export let func:string;

  const dispatch = CED<{ playback: { command: string } }>();

  let icon:string;
  $: icon = {
    start: 'play_arrow', stop: 'pause', clear: 'stop',
    step: 'skip_next', random: 'casino'
  }[func as Playback_Command];


  const can_disable = !['start', 'stop'].includes(func);
</script>

<button class="icons-font"
        disabled={can_disable && disabled}
        on:click={() => dispatch('playback', {command: func})}>
  {icon}
</button>

<style>

button {
  font-size: 30px;
  font-variation-settings: 'FILL' 1;
  background-color: var(--color-bg-strong);
  margin: 0.5em; border: 0.1em solid var(--color-content-normal);
  border-radius: 50%;
  padding: 0.3em;
  color: var(--color-content-normal);
}

@media screen and (hover: hover) {
  button:hover {
    color: var(--color-content-strong);
    background-color: var(--color-bg-faint);
  }
}

button:disabled {
  color: var(--color-content-faint);
}

</style>