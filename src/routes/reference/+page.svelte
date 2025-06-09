<script lang="ts">
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import { flags } from "$lib/content";
</script>

<GameContainer>
  {#snippet title()}
    World Flags
  {/snippet}
  <div class="text-center">
    <p class="text-base-content/50">Aspect ratios may be inaccurate</p>
    <a href="https://flagpedia.net/index" target="_blank" rel="noopener noreferrer" class="link">
      Source (Flagpedia.net)
    </a>
  </div>
  <div class="grid grid-cols-2 gap-5 sm:grid-cols-3">
    {#each flags as flag}
      <a
        class="group bg-base-200 rounded-b-field flex flex-col shadow-md"
        href="https://flagpedia.net/{flag.code}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="./flags/{flag.code}.png"
          alt={flag.name}
          class="bg-base-100/50 ml-auto aspect-[3/2]"
        />
        <p class="group-hover:text-accent font-title px-2 py-1 text-2xl transition-colors">
          {flag.name}
        </p>
      </a>
    {/each}
  </div>
</GameContainer>
