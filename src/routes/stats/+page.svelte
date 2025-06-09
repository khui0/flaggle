<script lang="ts">
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import LucideCalendarDays from "~icons/lucide/calendar-days";
  import LucideFlag from "~icons/lucide/flag";
  import LucideZap from "~icons/lucide/zap";
  import StatsContainer from "./stats-container.svelte";
  import StatsItem from "./stats-item.svelte";
  import { classicStats, dailyStats, lightningStats } from "$lib/stats";

  function initBaseObject<T extends Record<string, any>>(obj: T): Record<keyof T, number> {
    return Object.fromEntries(Object.keys(obj).map((key) => [key, 0])) as Record<keyof T, number>;
  }

  let daily = $state(initBaseObject(dailyStats));

  Object.entries(dailyStats).forEach(([stat, observable]) => {
    observable.subscribe((value) => {
      daily[stat as keyof typeof dailyStats] = value;
    });
  });

  let classic = $state(initBaseObject(classicStats));

  Object.entries(classicStats).forEach(([stat, observable]) => {
    observable.subscribe((value) => {
      classic[stat as keyof typeof classicStats] = value;
    });
  });

  let lightning = $state(initBaseObject(lightningStats));

  Object.entries(lightningStats).forEach(([stat, observable]) => {
    observable.subscribe((value) => {
      lightning[stat as keyof typeof lightningStats] = value;
    });
  });
</script>

<GameContainer>
  {#snippet title()}
    Statistics
  {/snippet}
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
    <div class="sm:col-span-2">
      <StatsContainer>
        {#snippet icon()}
          <LucideCalendarDays />
        {/snippet}
        {#snippet title()}
          Daily
        {/snippet}
        <StatsItem label="Streak">{daily.streak}</StatsItem>
        <StatsItem label="Average Guesses">{daily.averageGuesses.toFixed(2)}</StatsItem>
      </StatsContainer>
    </div>
    <StatsContainer>
      {#snippet icon()}
        <LucideFlag />
      {/snippet}
      {#snippet title()}
        Classic
      {/snippet}
      <StatsItem label="Streak">{classic.streak}</StatsItem>
      <StatsItem label="Highest Streak">{classic.maxStreak}</StatsItem>
      <StatsItem label="Games Won">{classic.wins}</StatsItem>
      <StatsItem label="Games Lost">{classic.losses}</StatsItem>
      <StatsItem label="Games Won">{classic.wins}</StatsItem>
      <StatsItem label="Win/Loss Ratio">
        {((classic.wins / classic.losses) * 100 || 0).toFixed(1)}%
      </StatsItem>
      <StatsItem label="Avg. Guesses">{classic.averageGuesses.toFixed(2)}</StatsItem>
    </StatsContainer>
    <StatsContainer>
      {#snippet icon()}
        <LucideZap />
      {/snippet}
      {#snippet title()}
        Lightning
      {/snippet}
      <StatsItem label="Streak">{lightning.streak}</StatsItem>
      <StatsItem label="Highest Streak">{lightning.maxStreak}</StatsItem>
      <StatsItem label="Games Won">{lightning.wins}</StatsItem>
      <StatsItem label="Games Lost">{lightning.losses}</StatsItem>
      <StatsItem label="Games Won">{lightning.wins}</StatsItem>
      <StatsItem label="Win/Loss Ratio">
        {((lightning.wins / lightning.losses) * 100 || 0).toFixed(1)}%
      </StatsItem>
      <StatsItem label="Avg. Guesses">{lightning.averageGuesses.toFixed(2)}</StatsItem>
    </StatsContainer>
  </div>
</GameContainer>
