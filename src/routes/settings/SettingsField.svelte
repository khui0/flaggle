<script lang="ts">
  import { createEventDispatcher } from "svelte";

  interface Option {
    name: string;
    value: string;
  }

  export let title: string;
  export let type: "checkbox" | "toggle" | "select" | "text" | "button" | "link";
  export let value: string = "";
  export let options: Option[] = [];
  export let maxlength: number | undefined = undefined;
  export let placeholder: string = "";
  export let text: string = "";
  export let href: string = "";

  let checkbox: HTMLInputElement;

  $: value,
    (() => {
      if (checkbox) {
        checkbox.checked = value === "true";
      }
    })();

  const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col gap-2">
  <div class="rounded-box bg-base-200 p-2 pl-4">
    <div class="flex items-center justify-between gap-2 p-1">
      <span class="label-text text-base">{title}</span>
      {#if type === "checkbox" || type === "toggle"}
        <input
          type="checkbox"
          class={type === "checkbox" ? "checkbox rounded-md" : "toggle"}
          bind:this={checkbox}
          on:input={() => {
            value = checkbox.checked ? "true" : "false";
          }}
        />
      {:else if type === "select"}
        <select class="select select-sm w-fit" bind:value>
          {#each options as option}
            <option value={option.value}>{option.name}</option>
          {/each}
        </select>
      {:else if type === "text"}
        <div class="flex flex-row gap-1">
          <input
            type="text"
            class="input input-sm w-full max-w-xs"
            bind:value
            {maxlength}
            {placeholder}
          />
          <button
            class="btn btn-sm"
            on:click={() => {
              dispatch("save", {
                value,
              });
            }}
            >Save
          </button>
        </div>
      {:else if type === "button"}
        <button class="btn btn-sm" on:click>{text}</button>
      {:else if type === "link"}
        <a class="btn btn-sm" {href}>{text}</a>
      {/if}
    </div>
  </div>
  <p class="text-base-content/50 mx-4 mb-4 text-sm"><slot></slot></p>
</div>
