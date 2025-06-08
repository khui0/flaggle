<script lang="ts">
  import data from "$lib/assets/flags/data.json";

  const flags = data as { code: string; name: string }[];

  flags.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
</script>

<div class="flex justify-between items-center gap-4 flex-wrap">
  <h1 class="font-[BigNoodleTitling] italic text-4xl">All Flags ({flags.length})</h1>
</div>
<div class="flex justify-between items-center gap-4 flex-wrap">
  <p class="text-base-content/50">Aspect ratios may be inaccurate</p>
  <a href="https://flagpedia.net/index" target="_blank" rel="noopener noreferrer" class="link">
    Source (Flagpedia.net)
  </a>
</div>
<div class="grid grid-cols-3 gap-5">
  {#each flags as flag}
    <a
      class="flex flex-col gap-2.5 group"
      href="https://flagpedia.net/{flag.code}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="./flags/{flag.code}.png"
        alt={flag.name}
        class="bg-base-100/50 aspect-[3/2] ml-auto"
      />
      <div class="relative font-[BigNoodleTitling] italic text-2xl w-fit">
        <p
          class="absolute w-full top-0 left-full ml-2 text-base-content/50 -translate-x-4 opacity-0 pointer-events-none group-hover:translate-x-0 group-hover:opacity-100 transition-all"
        >
          {flag.code}
        </p>
        <p class="group-hover:text-accent transition-colors">
          {flag.name}
        </p>
      </div>
    </a>
  {/each}
</div>
