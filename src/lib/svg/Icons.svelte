<script lang="ts">
	import type { Playback_Command } from "$lib/types";

  type Func_Name = Playback_Command;
  type Shape_Name = 'd6' | 'eject' | 'next' | 'pause' | 'play';
  type Shapes_Map = Record<Func_Name, Shape_Name>;
  type Shape_Def = {
    view_box: string;
    paths: { d: string; transform?: string; }[]
  }

  export let func:Func_Name;
  export let disabled:boolean;

  const shape_names:Shapes_Map = {
    start: 'play', clear: 'eject',
    step:  'next', pause: 'pause',
    random:'d6',
  }

  const all_shapes:Record<string, Shape_Def> = {
    play:   { view_box: '0 0 8 8', paths: [{ d: 'M0 0v6l6-3-6-3z',                  transform: 'translate(1.7 1)'}]},
    pause:  { view_box: '0 0 8 8', paths: [{ d: 'M0 0v6h2v-6h-2zm4 0v6h2v-6h-2z',   transform: 'translate(1.1 1.1)'}]},
    next:   { view_box: '0 0 8 8', paths: [{ d: 'M0 0v6l5-3-5-3zm5 3v3h2v-6h-2v3z', transform: 'translate(0.5 1)'}]},
    eject:  { view_box: '0 0 8 8', paths: [{ d: 'M4 0l-4 5h8l-4-5zm-4 6v2h8v-2h-8z',transform: 'translate(0.6 0.6 ) scale(0.8 0.8)'}]},
    d6:     { view_box: '0 0 512 512',  paths: [
      { d: 'M440.88,129.37,288.16,40.62a64.14,64.14,0,0,0-64.33,0L71.12,129.37a4,4,0,0,0,0,6.9L254,243.85a4,4,0,0,0,4.06,0L440.9,136.27A4,4,0,0,0,440.88,129.37ZM256,152c-13.25,0-24-7.16-24-16s10.75-16,24-16,24,7.16,24,16S269.25,152,256,152Z'},
      { d: 'M238,270.81,54,163.48a4,4,0,0,0-6,3.46V340.86a48,48,0,0,0,23.84,41.39L234,479.48a4,4,0,0,0,6-3.46V274.27A4,4,0,0,0,238,270.81ZM96,368c-8.84,0-16-10.75-16-24s7.16-24,16-24,16,10.75,16,24S104.84,368,96,368Zm96-32c-8.84,0-16-10.75-16-24s7.16-24,16-24,16,10.75,16,24S200.84,336,192,336Z'},
      { d: 'M458,163.51,274,271.56a4,4,0,0,0-2,3.45V476a4,4,0,0,0,6,3.46l162.15-97.23A48,48,0,0,0,464,340.86V167A4,4,0,0,0,458,163.51ZM320,424c-8.84,0-16-10.75-16-24s7.16-24,16-24,16,10.75,16,24S328.84,424,320,424Zm0-88c-8.84,0-16-10.75-16-24s7.16-24,16-24,16,10.75,16,24S328.84,336,320,336Zm96,32c-8.84,0-16-10.75-16-24s7.16-24,16-24,16,10.75,16,24S424.84,368,416,368Zm0-88c-8.84,0-16-10.75-16-24s7.16-24,16-24,16,10.75,16,24S424.84,280,416,280Z'},
    ]},
  }

  let shape:Shape_Def;
  $: shape = all_shapes[shape_names[func]];
</script>

<span class:enabled={!disabled}>
  <svg  fill="currentColor" viewBox={shape.view_box}
        xmlns="http://www.w3.org/2000/svg">
    <g stroke-width="0"></g>
    <g stroke-linecap="round" stroke-linejoin="round"></g>
    <g>
      {#each shape.paths as path}
        <path d={path.d} transform={path.transform}></path>
      {/each}
    </g>
  </svg>
</span>

<style>
span {
  display: block;
  margin: auto;

  color: var(--color-content-faint);
  background-color: var(--color-bg-faint);

  border-radius: 50%;

  font-size: 0.3em;
  padding: 2.4em;
  width: 12em;
  height: 12em;
  border: 0.2em solid var(--color-bg-strong);
}

span.enabled {
  color: var(--color-content-normal);
  background-color: var(--color-bg-strong);
  border-color: var(--color-content-normal);
}

@media screen and (hover: hover) {
  span.enabled:hover {
    color: var(--color-bg-faint);
    background-color: var(--color-content-normal);
    border-color: var(--color-content-normal);
  }
}

svg {
  margin: 0;
}
</style>
