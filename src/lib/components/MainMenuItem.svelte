<script lang="ts">
  export let href: string;
  export let title: string;
  export let target: string = "";
</script>

<a
  {href}
  {target}
  class="rounded-box bg-base-200 group relative flex flex-col gap-1 overflow-hidden px-5 py-4"
>
  <h2 class="group-hover:text-accent font-title z-10 transition-colors">
    {title}
  </h2>
  <p class="text-neutral-content z-10 mr-20"><slot></slot></p>
  <div
    class="text-neutral group-hover:text-accent absolute right-4 bottom-[-0.6rem] z-0 text-6xl transition-all group-hover:bottom-[1rem]"
  >
    <slot name="icon"></slot>
  </div>
</a>
