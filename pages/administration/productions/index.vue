<template>
  <AdminPage title="Your Productions">
    <template #toolbar>
      <UiStaButton
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        to="/administration/productions/create"
      >
        Start New Draft
      </UiStaButton>
    </template>
    <div class="flex flex-wrap gap-3 items-end md:flex-nowrap">
      <div>
        <label>Name</label>
        <UiInputText
          v-model="productionSearchFilter"
          placeholder="Search by name"
        />
      </div>
      <div>
        <label>Status</label>
        <UiInputSelect
          v-model="productionsStatusFilter"
          :options="[
            { value: null, displayText: 'All' },
            { value: 'DRAFT', displayText: 'Draft' },
            { value: 'PUBLISHED', displayText: 'Published' },
            { value: 'CLOSED', displayText: 'Closed' },
            { value: 'COMPLETE', displayText: 'Complete' }
          ]"
        />
      </div>
      <div>
        <label>Run Date</label>
        <VueDatepicker
          v-model="productionsRunDateFilter"
          :enable-time-picker="false"
          format="dd/MM/yyyy"
        />
      </div>
    </div>
    <UiCard class="mt-6">
      <UiTablesPaginatedTable
        v-model:offset="productionsOffset"
        :items="
          productionsData ? productionsData.edges.map((edge) => edge?.node) : []
        "
        :loading="loading"
        :max-per-page="10"
        :page-info="productionsData ? productionsData.pageInfo : {}"
      >
        <template #head>
          <UiTablesTableHeadItem>Status</UiTablesTableHeadItem>
          <UiTablesTableHeadItem>Name</UiTablesTableHeadItem>
          <UiTablesTableHeadItem>Society</UiTablesTableHeadItem>
          <UiTablesTableHeadItem>Dates</UiTablesTableHeadItem>
        </template>
        <template #default="slotProps">
          <UiTablesTableRow
            v-for="(production, index) in slotProps.items"
            :key="index"
          >
            <UiTablesTableRowItem>
              <ProductionStatusBadge :production="production" />
            </UiTablesTableRowItem>
            <UiTablesTableRowItem>
              <NuxtLink
                :to="`/administration/productions/${production.slug}`"
                class="text-sta-orange hover:text-sta-orange-dark font-semibold"
              >
                {{ production.name }}
              </NuxtLink>
            </UiTablesTableRowItem>
            <UiTablesTableRowItem>{{
              production.society.name
            }}</UiTablesTableRowItem>
            <UiTablesTableRowItem>
              {{
                production.start && production.end
                  ? displayStartEnd(production.start, production.end, 'd MMMM')
                  : ''
              }}
            </UiTablesTableRowItem>
          </UiTablesTableRow>
        </template>
      </UiTablesPaginatedTable>
    </UiCard>
  </AdminPage>
</template>

<script setup lang="ts">
import {
  useAdminProductionsQuery,
  AdminProductionsQueryVariables
} from '@/graphql/codegen/operations';
import { displayStartEnd } from '~~/utils/datetime';
import VueDatepicker from '@vuepic/vue-datepicker';
import { DateTime } from 'luxon';

const productionsOffset = ref(0);
const productionsStatusFilter = ref<string | null>(null);
const productionsRunDateFilter = ref<Date | null>(null);
const productionSearchFilter = ref<string | null>(null);

useHead({
  title: 'Your Productions'
});

const { result: queryResult, loading } = useAdminProductionsQuery(
  () =>
    ({
      offset: productionsOffset.value,
      status: productionsStatusFilter.value,
      startLte: productionsRunDateFilter.value
        ? DateTime.fromJSDate(productionsRunDateFilter.value).set({
            hour: 0,
            minute: 0,
            second: 0
          })
        : null,
      endGte: productionsRunDateFilter.value
        ? DateTime.fromJSDate(productionsRunDateFilter.value).set({
            hour: 23,
            minute: 59,
            second: 59
          })
        : null,
      search: productionSearchFilter.value
    } as AdminProductionsQueryVariables)
);

const productionsData = computed(() => queryResult.value?.productions);
</script>
