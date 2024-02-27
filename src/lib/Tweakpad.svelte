<script lang="ts">
  import { tweaks  } from "./stores";

  const rules2string = (args: {spawn: number[], survive: number[]}) =>
    `B${args.spawn.join('')}/S${args.survive.join('')}`;

  let life_rules = rules2string($tweaks.rules);

  const flip_wrap = () => $tweaks.wrap = !$tweaks.wrap;

  const apply_changes = () => {

  }
</script>

<button on:click={flip_wrap}>
  {$tweaks.wrap ? 'Flat space' : 'Toroid space'}
</button>
<!-- <form on:submit|preventDefault={apply_changes}>
  <label><input bind:value={life_rules}/></label>
</form> -->