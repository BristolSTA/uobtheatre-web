<template>
  <div class="text-white">
    <p
      class="uppercase tracking-wider font-bold text-sm text-center text-sta-gray-lighter"
    >
      Schedule
    </p>
    <div class="flex gap-2">
      <div
        v-for="(period, i) in periods"
        :key="i"
        class="flex items-center gap-2"
      >
        <div
          v-if="i === currentPeriodIndex + 1"
          class="flex flex-col items-center"
        >
          <span class="uppercase tracking-wider text-xs text-sta-gray-lighter"
            >Up Next</span
          >
          <span>{{ period.name }}</span>
          <span class="font-bold text-sm text-sta-gray-lighter"
            >{{ durationToNextPeriod }} &#8212;
            {{ period.begins.toFormat('HH:mm') }}</span
          >
        </div>
        <div
          class="rotated-text p-1 py-2"
          :class="[
            i <= currentPeriodIndex ? 'bg-sta-gray' : 'bg-sta-gray-light'
          ]"
        >
          <div
            class="rotated-text__inner text-sm font-bold"
            :class="[
              i <= currentPeriodIndex
                ? 'rotated-text__inner_left'
                : 'rotated-text__inner_right'
            ]"
          >
            {{ period.shortenedName }}
            <span class="text-gray-500">{{
              period.begins.toFormat('HH:mm')
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import humanizeDuration from 'humanize-duration';
import { DateTime, Duration } from 'luxon';
import { PerformanceNode } from '~~/graphql/codegen/operations';

const props = defineProps<{
  performance: Pick<
    PerformanceNode,
    'start' | 'end' | 'doorsOpen' | 'intervalDurationMins'
  >;
}>();

type PeriodDefinition = {
  shortenedName: string;
  name: string;
  begins: DateTime;
  duration?: Duration;
};

const periods = computed<PeriodDefinition[]>(() => {
  let periodList: PeriodDefinition[] = [];

  // Add the performance doors period
  periodList.push({
    name: 'Doors Open',
    shortenedName: 'Doors',
    begins: DateTime.fromISO(props.performance.doorsOpen)
  });

  // Add the performance start period
  periodList.push({
    name: 'Performance Start',
    shortenedName: 'Start',
    begins: DateTime.fromISO(props.performance.start)
  });

  // If there is an interval
  periodList.push({
    name: 'Interval',
    shortenedName: 'Int.',
    begins: DateTime.fromISO(props.performance.start).plus({
      milliseconds:
        (new Date(props.performance.end).valueOf() -
          new Date(props.performance.start).valueOf()) /
        2
    }),
    duration: Duration.fromMillis(
      props.performance.intervalDurationMins ?? 0 * 60 * 1000
    )
  });

  periodList.push({
    name: 'Performance End',
    shortenedName: 'End',
    begins: DateTime.fromISO(props.performance.end)
  });

  return periodList;
});

const currentPeriodIndex = computed(() => 0);

const now = useClock();

const durationToNextPeriod = computed(() => {
  const nextPeriod = periods.value[currentPeriodIndex.value + 1];
  return humanizeDuration(now.value.diff(nextPeriod.begins).toMillis(), {
    largest: 1,
    round: true
  });
});
</script>

<style scoped>
/* Styling for rotated "bookshelf" from https://kizu.dev/rotated-text/#book */
.rotated-text {
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;

  width: 1.5em;
  line-height: 0.8;
}
.rotated-text__inner {
  vertical-align: middle;
  text-align: center;
  display: inline-block;
  white-space: nowrap;
  padding: 0;
}
.rotated-text__inner_left {
  transform: translate(0, 100%) rotate(-90deg);
  transform-origin: 0 0;
}
.rotated-text__inner_right {
  transform: translate(-78%, 100%) rotate(90deg);
  transform-origin: top right;
}
.rotated-text__inner:after {
  content: '';
  float: left;
  margin-top: 100%;
}
</style>
