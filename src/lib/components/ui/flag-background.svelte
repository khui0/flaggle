<script lang="ts">
  import { flags, getRandomFlag, type Flag } from "$lib/content";
  import { onMount } from "svelte";

  const ROWS = 10;
  const ANGLE = 10;
  const ANGLE_RAD = (Math.PI / 180) * ANGLE;

  let containerWidth: number = $state(0);
  let containerHeight: number = $state(0);
  let flagHeight: number = $state(0);
  let flagWidth: number = $state(0);
  let maxCount: number = $state(0);

  let queue: Flag[][] = $state(new Array(ROWS).fill([]));

  onMount(() => {
    calculateSizes();
    initQueue();
  });

  function initQueue() {
    for (let i = 0; i < ROWS; i++) {
      for (let j = queue[i].length; j < maxCount; j++) {
        queue[i][j] = getRandomFlag();
      }
    }
  }

  function calculateSizes() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const a = Math.sin(ANGLE_RAD) * w;
    const b = Math.cos(ANGLE_RAD) * h;
    const c = Math.sin(ANGLE_RAD) * h;
    const d = Math.cos(ANGLE_RAD) * w;

    containerHeight = a + b;
    containerWidth = c + d;

    flagHeight = containerHeight / ROWS;
    flagWidth = flagHeight * (3 / 2);
    maxCount = Math.ceil(containerWidth / flagWidth);
  }
</script>

<svelte:window
  onresize={() => {
    calculateSizes();
    initQueue();
  }}
/>

<div
  class="absolute top-1/2 left-1/2 -translate-1/2 blur-md"
  style="width: {containerWidth}px; height: {containerHeight}px; rotate: -{ANGLE}deg;"
>
  <div>
    {#each queue as row}
      <div class="slide flex" style="--width: {flagWidth * maxCount};">
        {#each row.slice(0, maxCount) as flag}
          <img
            src="./flags/{flag.code}.png"
            alt={flag.name}
            style="height: {flagHeight}px; width: {flagWidth}px;"
          />
        {/each}
        {#each row.slice(0, maxCount) as flag}
          <img
            src="./flags/{flag.code}.png"
            alt={flag.name}
            style="height: {flagHeight}px; width: {flagWidth}px;"
          />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .slide {
    animation: slide 30s linear infinite;
  }

  @keyframes slide {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(var(--width) * -1px));
    }
  }
</style>
