<template>
  <admin-page :title="production.name">
    <template #toolbar>
      <sta-button
        colour="green"
        icon="link"
        :to="`/production/${production.slug}`"
      >
        View Public Page
      </sta-button>
      <sta-button
        v-if="canEditRightNow"
        colour="orange"
        icon="edit"
        :to="`${production.slug}/edit`"
      >
        Edit
      </sta-button>
    </template>
    <div class="space-y-4">
      <div class="flex flex-wrap justify-around space-y-4">
        <card title="Summary" class="max-w-2xl">
          <table class="table-auto w-full">
            <tr>
              <table-head-item>Status</table-head-item>
              <table-row-item>
                <production-status-badge :production="production" />
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
        </card>
        <div>
          <card v-if="actions.length" title="Actions" class="max-w-2xl">
            <div class="flex gap-2">
              <sta-button
                v-for="(action, index) in actions"
                :key="index"
                class="bg-sta-orange hover:bg-sta-orange-dark mt-3"
                :class="action.class"
                :icon="action.icon"
                @click="action.action()"
              >
                {{ action.text }}
              </sta-button>
            </div>
          </card>
        </div>
      </div>
      <card title="Performances">
        <template v-if="canEdit" #messageBox>
          <div class="flex items-center">
            <nuxt-link
              class="hover:text-gray-300"
              :to="`${production.slug}/performances/create`"
            >
              <font-awesome-icon icon="plus-circle" class="fa-2x" />
            </nuxt-link>
          </div>
        </template>
        <paginated-table
          :items="
            performancesData
              ? performancesData.edges.map((edge) => edge.node)
              : []
          "
          empty-text="This production currently has no performances"
          :max-per-page="10"
          :loading="$apollo.queries.performancesData.loading"
          :page-info="performancesData ? performancesData.pageInfo : {}"
          :offset.sync="performancesOffset"
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
                <badge
                  v-if="performance.minSeatPrice === 0"
                  class="text-white bg-sta-orange font-bold"
                >
                  Free
                </badge>
              </table-row-item>
              <table-row-item>
                {{ performance.start | dateFormat('EEEE dd MMMM y') }}
              </table-row-item>
              <table-row-item>
                {{ performance.doorsOpen | dateFormat('HH:mm ZZZZ') }}
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
                <sta-button
                  :small="true"
                  colour="green"
                  :to="`/administration/productions/${production.slug}/performances/${performance.id}`"
                >
                  View
                </sta-button>
              </table-row-item>
            </table-row>
          </template>
          <template #empty>
            <div class="flex items-center justify-center">
              <nuxt-link
                class="bg-sta-green py-1 px-2 rounded-full hover:bg-sta-green-dark"
                :to="`${production.slug}/performances/create`"
              >
                Add a performance?
              </nuxt-link>
            </div>
          </template>
        </paginated-table>
      </card>
    </div>
  </admin-page>
</template>

<script>
import AdminProductionShowQuery from '@/graphql/queries/admin/productions/AdminProductionShow.gql';
import AdminPerformancesIndexQuery from '@/graphql/queries/admin/productions/AdminPerformancesIndex.gql';
import AdminPage from '@/components/admin/AdminPage.vue';
import StaButton from '@/components/ui/StaButton.vue';
import Card from '@/components/ui/Card.vue';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import PerformanceStatusBadge from '@/components/performance/PerformanceStatusBadge.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import ProductionStatusBadge from '@/components/production/ProductionStatusBadge.vue';
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  getValidationErrors,
  performMutation,
  successToast,
  swal,
  humanDuration,
} from '@/utils';

export default {
  components: {
    AdminPage,
    StaButton,
    Card,
    ProgressBar,
    PerformanceStatusBadge,
    TableRowItem,
    TableHeadItem,
    ProductionStatusBadge,
    PaginatedTable,
    TableRow,
    Badge,
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminProductionShowQuery,
      variables: {
        slug: params.productionSlug,
      },
      fetchPolicy: 'no-cache',
    });

    const production = data.production;
    if (!production) {
      return error({
        statusCode: 404,
        message: 'This production does not exist',
      });
    }
    return {
      production,
    };
  },
  data() {
    return {
      production: null,

      performancesData: null,
      performancesOffset: 0,
    };
  },
  apollo: {
    performancesData: {
      query: AdminPerformancesIndexQuery,
      variables() {
        return {
          productionSlug: this.production.slug,
          offset: this.performancesOffset,
        };
      },
      update: (data) => data.production.performances,
      fetchPolicy: 'cache-and-network',
    },
  },
  head() {
    const productionName = this.production
      ? this.production.name
      : 'Loading...';
    return {
      title: productionName,
    };
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
            this.$router.push(
              `/administration/productions/${this.production.slug}/permissions`
            ),
          text: 'Edit Permissions',
        });

        if (this.production.status === 'APPROVED') {
          list.push({
            icon: 'globe',
            class: 'animate-pulse animate',
            action: () => this.setStatus('PUBLISHED'),
            text: 'Make Live',
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
          text: 'Approve',
        });
        list.push({
          icon: 'exclamation',
          action: () => this.setStatus('DRAFT'),
          text: 'Reject',
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
          text: 'Close Production',
        });
      }
      // Add action button based on status
      if (this.canEditRightNow && this.production.status === 'DRAFT') {
        list.push({
          icon: 'user-check',
          action: () => this.setStatus('PENDING'),
          text: 'Submit for Review',
        });
      }

      return list;
    },
  },
  methods: {
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
        showConfirmButton: true,
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
            mutation: require('@/graphql/mutations/admin/production/SetProductionStatus.gql'),
            variables: {
              id: this.production.id,
              message: value,
              status,
            },
          },
          'setProductionStatus'
        );
      } catch (e) {
        const errors = getValidationErrors(e);
        swal.fire({
          title: 'There was an issue',
          html: errors.allErrors
            .map((error) => `<p>${error.message}</p>`)
            .join(''),
        });
        return;
      }
      await this.$nuxt.refresh();
      successToast.fire({ title: 'Status updated' });
    },
  },
};
</script>
