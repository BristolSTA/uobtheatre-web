<template>
  <AdminPage :title="production?.name">
    <template #toolbar>
      <UiStaButton
        colour="green"
        icon="link"
        :to="`/production/${production.slug}`"
      >
        View Public Page
      </UiStaButton>
      <UiStaButton
        v-if="canEditRightNow"
        colour="orange"
        icon="edit"
        :to="`/administration/productions/${production.slug}/edit`"
      >
        Edit
      </UiStaButton>
    </template>
    <div class="space-y-4">
      <div class="flex flex-wrap justify-around space-y-4">
        <UiCard title="Summary" class="max-w-2xl">
          <table class="table-auto w-full">
            <tr>
              <table-head-item>Status</table-head-item>
              <table-row-item>
                <ProductionStatusBadge :production="production" />
                <p class="text-sm">
                  {{ statusDescription }}
                </p>
              </table-row-item>
            </tr>
            <tr>
              <table-head-item>Society</table-head-item>
              <table-row-item> {{ production.society.name }} </table-row-item>
            </tr>
            <tr v-if="production.totalCapacity && production.salesBreakdown">
              <table-head-item>Ticket Sales</table-head-item>
              <table-row-item>
                {{ production.totalTicketsSold }} of
                {{ production.totalCapacity }} ({{
                  Math.floor(
                    (100 * production.totalTicketsSold) /
                      production.totalCapacity
                  )
                }}%)
                <progress-bar
                  :percentage="
                    (100 * production.totalTicketsSold) /
                    production.totalCapacity
                  "
                />
              </table-row-item>
            </tr>
            <tr v-if="production.salesBreakdown">
              <table-head-item>Net Society Revenue</table-head-item>
              <table-row-item>
                £{{
                  (production.salesBreakdown.societyRevenue / 100).toFixed(2)
                }}
              </table-row-item>
            </tr>
          </table>
        </UiCard>
        <div>
          <UiCard v-if="actions.length" title="Actions" class="max-w-2xl">
            <div class="flex gap-2">
              <UiStaButton
                v-for="(action, index) in actions"
                :key="index"
                class="bg-sta-orange hover:bg-sta-orange-dark mt-3"
                :class="action.class"
                :icon="action.icon"
                @click="action.action()"
              >
                {{ action.text }}
              </UiStaButton>
            </div>
          </UiCard>
        </div>
      </div>
      <UiCard title="Performances">
        <template v-if="canEdit" #messageBox>
          <div class="flex items-center">
            <NuxtLink
              class="hover:text-gray-300"
              :to="`/administration/productions/${production.slug}/performances/create`"
            >
              <font-awesome-icon icon="plus-circle" class="fa-2x" />
            </NuxtLink>
          </div>
        </template>
        <paginated-table
          v-model:offset="performancesOffset"
          :items="
            performancesData
              ? performancesData.edges.map((edge) => edge.node)
              : []
          "
          empty-text="This production currently has no performances"
          :max-per-page="10"
          :loading="$apollo.queries.performancesData?.loading"
          :page-info="performancesData ? performancesData.pageInfo : {}"
        >
          <template #head>
            <table-head-item />
            <table-head-item>Date</table-head-item>
            <table-head-item>Doors Time</table-head-item>
            <table-head-item>Venue</table-head-item>
            <table-head-item>Sales</table-head-item>
            <table-head-item />
          </template>
          <template #default="slotProps">
            <table-row
              v-for="performance in slotProps.items"
              :key="performance.id"
            >
              <table-row-item>
                <performance-status-badge :performance="performance" />
                <UiBadge
                  v-if="performance.minSeatPrice === 0"
                  class="text-white bg-sta-orange font-bold"
                >
                  Free
                </UiBadge>
              </table-row-item>
              <table-row-item>
                {{ dateFormat(performance.start, 'EEEE dd MMMM y') }}
              </table-row-item>
              <table-row-item>
                {{ dateFormat(performance.doorsOpen, 'HH:mm ZZZZ') }}
                <span class="text-sm">
                  ({{ humanDuration(performance.durationMins)
                  }}<template v-if="performance.intervalDurationMins">
                    inc. interval</template
                  >)
                </span>
              </table-row-item>
              <table-row-item>{{ performance.venue.name }}</table-row-item>
              <table-row-item>
                <template v-if="performance.ticketsBreakdown.totalCapacity">
                  <p>
                    {{ performance.ticketsBreakdown.totalTicketsSold }} of
                    {{ performance.ticketsBreakdown.totalCapacity }} ({{
                      salesPercentage(performance)
                    }}%)
                  </p>
                  <progress-bar
                    :height="2"
                    :percentage="parseInt(salesPercentage(performance))"
                  />
                </template>
              </table-row-item>
              <table-row-item class="space-x-2">
                <UiStaButton
                  :small="true"
                  colour="green"
                  :to="`/administration/productions/${production.slug}/performances/${performance.id}`"
                >
                  View
                </UiStaButton>
              </table-row-item>
            </table-row>
          </template>
          <template #empty>
            <div class="flex items-center justify-center">
              <NuxtLink
                class="bg-sta-green py-1 px-2 rounded-full hover:bg-sta-green-dark"
                :to="`${production.slug}/performances/create`"
              >
                Add a performance?
              </NuxtLink>
            </div>
          </template>
        </paginated-table>
      </UiCard>
    </div>
  </AdminPage>
</template>

<script>
import AdminProductionShowQuery from '@/graphql/queries/admin/productions/AdminProductionShow.gql';
import AdminPerformancesIndexQuery from '@/graphql/queries/admin/productions/AdminPerformancesIndex.gql';

import ProgressBar from '@/components/ui/ProgressBar.vue';
import PerformanceStatusBadge from '@/components/performance/PerformanceStatusBadge.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import { getValidationErrors, performMutation } from '~~/utils/api';
import { successToast, swal } from '~~/utils/alerts';
import { humanDuration, dateFormat } from '~~/utils/datetime';
import { SetProductionStatusDocument } from '@/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    ProgressBar,
    PerformanceStatusBadge,
    TableRowItem,
    TableHeadItem,
    PaginatedTable,
    TableRow
  },
  async asyncData() {
    // Execute query
    const { data } = await useAsyncQuery({
      query: AdminProductionShowQuery,
      variables: {
        slug: useRoute().params.productionSlug
      },
      fetchPolicy: 'no-cache'
    });

    const production = computed(() => data.value.production);
    if (!production.value) {
      throw createSafeError({
        statusCode: 404,
        message: 'This production does not exist'
      });
    }
    return {
      production
    };
  },
  data() {
    return {
      production: null,

      performancesData: null,
      performancesOffset: 0
    };
  },
  apollo: {
    performancesData: {
      query: AdminPerformancesIndexQuery,
      variables() {
        return {
          productionSlug: this.production?.slug,
          offset: this.performancesOffset
        };
      },
      update: (data) => data.production.performances,
      fetchPolicy: 'cache-and-network'
    }
  },
  computed: {
    statusDescription() {
      if (this.production.status === 'DRAFT') {
        return 'This production is private, and not bookable';
      }
      if (this.production.status === 'PENDING') {
        return 'This production has been submitted for review. You will recieve an email once this has been completed';
      }
      if (this.production.status === 'PUBLISHED') {
        return 'This production is being displayed publicly';
      }
      if (this.production.status === 'CLOSED') {
        return 'This production has been closed, and it no longer accepting bookings';
      }
      if (this.production.status === 'COMPLETED') {
        return 'This production has been completed, and income has been transfered to the society';
      }

      return null;
    },
    canEdit() {
      // Returns if the user has any edit permissions, at any point, for this produciton
      return (
        this.production.permissions.includes('change_production') ||
        this.canEditRightNow
      );
    },
    canEditRightNow() {
      // Returns if the user can edit production details right now (i.e. the ability)
      return this.production.permissions.includes('edit_production');
    },
    actions() {
      const list = [];
      if (this.canEdit) {
        list.push({
          icon: 'list-ul',
          action: () =>
            useRouter().push(
              `/administration/productions/${this.production.slug}/permissions`
            ),
          text: 'Edit Permissions'
        });

        if (this.production.status === 'APPROVED') {
          list.push({
            icon: 'globe',
            class: 'animate-pulse animate',
            action: () => this.setStatus('PUBLISHED'),
            text: 'Make Live'
          });
        }
      }
      if (
        this.production.status === 'PENDING' &&
        this.production.permissions.includes('approve_production')
      ) {
        list.push({
          icon: 'check',
          action: () => this.setStatus('APPROVED'),
          text: 'Approve'
        });
        list.push({
          icon: 'exclamation',
          action: () => this.setStatus('DRAFT'),
          text: 'Reject'
        });
      }
      if (
        this.production.status === 'PUBLISHED' &&
        new Date(this.production.end) < new Date() &&
        this.production.permissions.includes('force_change_production')
      ) {
        list.push({
          icon: 'times-circle',
          action: () => this.setStatus('CLOSED'),
          text: 'Close Production'
        });
      }
      // Add action button based on status
      if (this.canEditRightNow && this.production.status === 'DRAFT') {
        list.push({
          icon: 'user-check',
          action: () => this.setStatus('PENDING'),
          text: 'Submit for Review'
        });
      }

      return list;
    }
  },
  methods: {
    dateFormat,
    salesPercentage(performance) {
      return Math.floor(
        (100 * performance.ticketsBreakdown.totalTicketsSold) /
          performance.ticketsBreakdown.totalCapacity
      );
    },
    humanDuration,
    async setStatus(status) {
      const swalArgs = {
        title: 'Are you sure?',
        text: `Are you sure you want to change the status to '${status}'`,
        showCancelButton: true,
        showConfirmButton: true
      };
      if (status === 'DRAFT' && this.production.status === 'PENDING') {
        swalArgs.input = 'text';
        swalArgs.inputLabel = 'Reason';
        swalArgs.inputValidator = (value) => {
          if (!value) {
            return 'You need to write something!';
          }
        };
      }

      const { isConfirmed, value } = await swal.fire(swalArgs);
      if (!isConfirmed) {
        return;
      }

      try {
        await performMutation(
          this.$apollo,
          {
            mutation: SetProductionStatusDocument,
            variables: {
              id: this.production.id,
              message: value,
              status
            }
          },
          'setProductionStatus'
        );
      } catch (e) {
        const errors = getValidationErrors(e);
        swal.fire({
          title: 'There was an issue',
          html: errors.allErrors
            .map((error) => `<p>${error.message}</p>`)
            .join('')
        });
        return;
      }
      await refreshNuxtData();
      successToast.fire({ title: 'Status updated' });
    }
  }
});
</script>
