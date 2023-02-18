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
          v-if="i === nextPeriodIndex && !currentPeriodDurationRemaining"
          class="flex flex-col items-center"
        >
          <span
            class="uppercase tracking-wider text-xs text-sta-gray-lighter"
            >{{
              currentPeriodIndex === undefined ? 'Coming Up' : 'Up Next'
            }}</span
          >
          <span>{{ period.name }}</span>
          <span class="font-bold text-sm text-sta-gray-lighter"
            >{{ durationToNextPeriod }} &#8212;
            {{ period.begins.toFormat('HH:mm') }}</span
          >
        </div>
        <div
          v-if="i !== currentPeriodIndex || !currentPeriodDurationRemaining"
          class="rotated-text p-1 py-2"
          :class="[
            currentPeriodIndex !== undefined && i <= currentPeriodIndex
              ? 'bg-sta-gray'
              : 'bg-sta-gray-light'
          ]"
        >
          <div
            class="rotated-text__inner text-sm font-bold"
            :class="[
              currentPeriodIndex !== undefined && i <= currentPeriodIndex
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

        <div
          v-if="
            i == currentPeriodIndex &&
            currentPeriod &&
            currentPeriodDurationRemaining
          "
          class="flex flex-col items-center"
        >
          <span>{{ currentPeriod.name }}</span>
          <span class="font-bold text-sm text-sta-gray-lighter"
            >{{ currentPeriodDurationRemaining }} left</span
          >
        </div>
      </div>
    </div>
    <UiProgressBar
      v-if="progressPercentage !== undefined"
      class="mt-1"
      :height="2"
      :percentage="progressPercentage"
    />
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
  if (props.performance.intervalDurationMins)
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
        props.performance.intervalDurationMins * 60 * 1000
      )
    });

  periodList.push({
    name: 'Performance End',
    shortenedName: 'End',
    begins: DateTime.fromISO(props.performance.end)
  });

  return periodList;
});

const currentPeriodIndex = computed<number | undefined>(() => {
  for (const [i, period] of periods.value.entries()) {
    if (period.begins.diff(now.value).toMillis() > 0) {
      if (i === 0) return undefined;
      return i - 1;
    }
  }
  return periods.value.length - 1;
});
const currentPeriod = computed<PeriodDefinition | undefined>(() =>
  currentPeriodIndex.value !== undefined
    ? periods.value[currentPeriodIndex.value]
    : undefined
);
const currentPeriodDurationRemaining = computed<string | undefined>(() => {
  if (
    currentPeriod.value === undefined ||
    currentPeriod.value.duration === undefined
  )
    return undefined;

  const remainingMillis = currentPeriod.value.begins
    .plus(currentPeriod.value.duration)
    .diff(now.value)
    .toMillis();

  return remainingMillis > 0
    ? humanizeDuration(remainingMillis, {
        largest: 1,
        round: true
      })
    : undefined;
});
const nextPeriodIndex = computed<number | undefined>(() => {
  if (currentPeriodIndex.value == undefined) return 0;
  if (currentPeriodIndex.value == periods.value.length - 1) return undefined;
  return currentPeriodIndex.value + 1;
});
const durationToNextPeriod = computed(() => {
  if (nextPeriodIndex.value === undefined) return undefined;
  const nextPeriod = periods.value[nextPeriodIndex.value];
  return humanizeDuration(now.value.diff(nextPeriod.begins).toMillis(), {
    largest: 1,
    round: true
  });
});

const now = useClock();

const progressPercentage = computed<undefined | number>(() => {
  const doorsOpenTime = DateTime.fromISO(props.performance.doorsOpen);
  const endTime = DateTime.fromISO(props.performance.end);

  if (endTime.diff(now.value).toMillis() < 0) return undefined;
  if (doorsOpenTime.diff(now.value).toMillis() > 0) return undefined;

  const elapsedMillis = Math.max(now.value.diff(doorsOpenTime).toMillis(), 0);

  const durationMillis = endTime.diff(doorsOpenTime).toMillis();

  return (100 * elapsedMillis) / durationMillis;
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
