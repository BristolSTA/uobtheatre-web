<template>
  <div class="h-screen bg-sta-gray font-body flex flex-col px-4 md:px-12 py-4">
    <BoxOfficeHeader />
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import {
  BoxOfficePerformanceDocument,
  BoxOfficePerformanceQuery,
  BoxOfficePerformanceQueryVariables
} from '~~/graphql/codegen/operations';

import InjectionKeys from '@/utils/injection-keys';

definePageMeta({
  middleware: ['authed'],
  layout: false
});

const performanceId = useRoute().params.performanceId;

if (typeof performanceId !== 'string')
  throw createSafeError({ message: 'Only one performance ID can be passed' });

const { data } = await useAsyncQuery<BoxOfficePerformanceQuery>(
  BoxOfficePerformanceDocument,
  {
    id: performanceId
  } satisfies BoxOfficePerformanceQueryVariables
);

const performance = data.value?.performance;

if (!performance)
  throw createSafeError({
    statusCode: 404,
    message: 'This performance does not exist'
  });

provide(InjectionKeys.boxOffice.performance, performance);
</script>
