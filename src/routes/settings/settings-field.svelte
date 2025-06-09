<script lang="ts">
  import type { Snippet } from "svelte";
  import SettingsFieldContainer from "./settings-field-container.svelte";

  type FieldType = "checkbox" | "toggle" | "select" | "button" | "link";

  let {
    title,
    type,
    value = $bindable(),
    options,
    text,
    onclick,
    href,
    children,
  }: {
    title: string;
    type: FieldType;
    value: string;
    options?: Record<string, string>;
    text?: string;
    onclick?: () => void;
    href?: string;
    children: Snippet;
  } = $props();

  let checkbox: HTMLInputElement | null = $state(null);

  $effect(() => {
    if (checkbox === null) return;
    checkbox.checked = value === "true";
  });
</script>

<SettingsFieldContainer>
  {#snippet title()}
    {title}
  {/snippet}
  {#snippet description()}
    {@render children()}
  {/snippet}
  {#if type === "checkbox" || type === "toggle"}
    <input
      type="checkbox"
      class={type === "checkbox" ? "checkbox rounded-md" : "toggle"}
      bind:this={checkbox}
      oninput={() => {
        if (checkbox === null) return;
        value = checkbox.checked ? "true" : "false";
      }}
    />
  {:else if type === "select"}
    <select class="select select-sm w-fit" bind:value>
      {#each Object.entries(options || {}) as [key, value]}
        <option value={key}>{value}</option>
      {/each}
    </select>
  {:else if type === "button"}
    <button class="btn btn-sm" {onclick}>{text}</button>
  {:else if type === "link"}
    <a class="btn btn-sm" {href}>{text}</a>
  {/if}
</SettingsFieldContainer>
