<template>Pay for booking ID {{ booking.id }}</template>

<script lang="ts" setup>
import useBoxOfficeStore from '~~/store/box-office';

const performance = inject(injectionKeys.boxOffice.performance);

if (!performance)
  throw createSafeError('There was an issue loading this performance');

const router = useRouter();

const boxOfficeStore = useBoxOfficeStore();
const booking = computed(() => boxOfficeStore.inProgressBooking);

if (!booking) router.replace(`/box-office/${performance.id}/sell`);
</script>
