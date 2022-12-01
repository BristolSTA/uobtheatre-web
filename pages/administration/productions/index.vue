<template>
  <AdminPage title="Your Productions">
    <template #toolbar>
      <UiStaButton
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        to="productions/create"
      >
        Start New Draft
      </UiStaButton>
    </template>
    <div class="flex flex-wrap gap-3 items-end md:flex-nowrap">
      <div>
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
        <t-datepicker v-model="productionsRunDateFilter" class="text-black" />
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

const productionsOffset = ref(0);
const productionsStatusFilter = ref(null);
const productionsRunDateFilter = ref(null);
const productionSearchFilter = ref(null);

useHead({
  title: 'Your Productions'
});

const { result: queryResult, loading } = useAdminProductionsQuery({
  offset: productionsOffset.value,
  status: productionsStatusFilter.value,
  startLte: productionsRunDateFilter.value
    ? productionsRunDateFilter.value + 'T23:59:59'
    : null,
  endGte: productionsRunDateFilter.value
    ? productionsRunDateFilter.value + 'T00:00:00'
    : null,
  search: productionSearchFilter.value
} as AdminProductionsQueryVariables);

const productionsData = computed(() => queryResult.value?.productions);
</script>
