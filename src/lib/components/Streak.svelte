<script lang="ts">
  import sound from "$lib/assets/kill.mp3";
  import { Howl } from "howler";

  let {
    value = 0,
  }: {
    value: number;
  } = $props();

  let ready: boolean = false;
  let show: boolean = $state(false);

  const audio = new Howl({
    src: sound,
  });

  const colors = new Map();
  colors.set(10, "red");
  colors.set(50, "purple");
  colors.set(100, "blue");
  colors.set(250, "green");
  colors.set(500, "yellow");
  colors.set(1000, "rainbow");

  $effect(() => {
    if (!ready) {
      ready = true;
      return;
    }
    if (colors.has(value)) {
      show = true;
      setTimeout(() => {
        show = false;
      }, 2000);
      audio.stop();
      audio.play();
    }
  });

  let colorClassName: string = $derived(
    (() => {
      let result = "";
      colors.entries().forEach(([k, v]: [number, string]) => {
        if (value >= k) result = v;
      });
      return result;
    })(),
  );
</script>

<p class="z-10 flex gap-[0.25em] text-3xl whitespace-nowrap {colorClassName}">
  <span class="font-title">{value.toLocaleString()} </span>
  <span class="font-[Icons]">A</span>
</p>

{#if show}
  <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
    <p class="big flex gap-[0.25em] text-8xl whitespace-nowrap {colorClassName}">
      <span class="font-title">{value.toLocaleString()} </span>
      <span class="font-[Icons]">A</span>
    </p>
  </div>
{/if}

<style>
  @reference "../../app.css";

  .red {
    @apply bg-gradient-to-b from-[#df4223] via-[#ed7150] to-[#fae070] bg-clip-text text-transparent;
    text-shadow: 0 0 0.625em red;
  }

  .purple {
    @apply bg-gradient-to-b from-[#7b23df] via-[#c850ed] to-[#fa70b7] bg-clip-text text-transparent;
    text-shadow: 0 0 0.625em #c850ed;
  }

  .blue {
    @apply bg-gradient-to-b from-[#4923df] via-[#50c6ed] to-[#70face] bg-clip-text text-transparent;
    text-shadow: 0 0 0.625em #50c6ed;
  }

  .green {
    @apply bg-gradient-to-b from-[#23dfa7] via-[#50ed68] to-[#d3fa70] bg-clip-text text-transparent;
    text-shadow: 0 0 0.625em #50ed68;
  }

  .yellow {
    @apply bg-gradient-to-b from-[#df8123] via-[#e8ed50] to-[#a7fa70] bg-clip-text text-transparent;
    text-shadow: 0 0 0.625em #e8ed50;
  }

  /* Adapted from https://codepen.io/shironitus/pen/QWyNBqx */
  .rainbow {
    @apply relative bg-clip-text text-transparent;
    background-image: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    background-size: 400%;
    animation: animate 5s linear infinite;
  }

  .rainbow:before {
    content: "";
    @apply absolute inset-x-0 inset-y-2 -z-[1] rounded-full blur-[0.625em];
    background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    background-size: 400%;
    animation: animate 5s linear infinite;
  }

  @keyframes animate {
    0% {
      background-position: 0%;
    }
    100% {
      background-position: 400%;
    }
  }

  .big {
    animation: intro 1s 2 ease forwards alternate;
  }

  @keyframes intro {
    0% {
      scale: 0.5;
      opacity: 0;
      transform: rotateY(-180deg) rotateZ(10deg);
    }
    100% {
      scale: 1;
      opacity: 1;
      transform: rotateY(0);
    }
  }
</style>
