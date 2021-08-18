<template>
  <div>
    <h1 class="text-h1">Your Productions</h1>
    <!-- TODO: Use Paginated table here -->
    <div class="flex items-end space-x-4">
      <div><t-input placeholder="Search by name" /></div>
      <div>
        <label>Status</label
        ><t-select
          :options="['All', 'Draft', 'Published', 'Closed', 'Complete']"
        />
      </div>
      <div>
        <label>Run Date</label>
        <t-datepicker :clearable="false" class="text-black" />
      </div>
    </div>
    <table v-if="productions" class="w-full">
      <thead>
        <tr>
          <td>Status</td>
          <td>Name</td>
          <td>Society</td>
          <td>Dates</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(production, index) in productions.edges.map(
            (edge) => edge.node
          )"
          :key="index"
        >
          <td>{{ production.status.description }}</td>
          <td>
            <nuxt-link :to="`productions/${production.slug}`">{{
              production.name
            }}</nuxt-link>
          </td>
          <td>{{ production.society.name }}</td>
          <td>
            {{ displayStartEnd(production.start, production.end, 'd MMMM') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AdminProductionsQuery from '@/graphql/queries/admin/AdminProductionsIndex.gql'
import { displayStartEnd } from '@/utils'
export default {
  data() {
    return {
      productions: null,
    }
  },
  head: {
    title: 'Your Productions',
  },
  methods: {
    displayStartEnd,
  },
  apollo: {
    productions: {
      query: AdminProductionsQuery,
    },
  },
}
</script>
