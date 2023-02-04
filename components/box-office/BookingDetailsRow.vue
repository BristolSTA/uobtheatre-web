<template>
  <tr
    class="bg-sta-gray"
    :class="[index % 2 == 0 ? 'bg-sta-gray-light' : 'bg-sta-gray']"
  >
    <td colspan="100%" class="p-4">
      <div class="md:flex">
        <div class="flex-none order-2 md:pl-2 pb-2 sm:b-0">
          <button
            v-if="!editing"
            class="p-2 bg-sta-green hover:bg-sta-green-dark rounded focus:outline-none transition-colors"
            @click="startEditing"
          >
            Alter Check Ins
          </button>
          <loading-icon v-else-if="saving" />
          <template v-else>
            <button
              class="p-2 bg-sta-green hover:bg-sta-green-dark rounded focus:outline-none transition-colors"
              @click="updateBookingCheckins"
            >
              Save
            </button>
            <button
              class="p-2 bg-gray-400 roundedhover:bg-gray-500 rounded focus:outline-none transition-colors"
              @click="cancelEdits"
            >
              Cancel
            </button>
          </template>
        </div>

        <div class="flex flex-grow order-1 overflow-x-auto">
          <table class="w-full text-sm sm:text-base">
            <tr class="text-left border-b">
              <th class="hidden sm:table-cell pr-4">Seat Group</th>
              <th class="pr-3 sm:pr-4">Type</th>
              <th class="pr-3 sm:pr-4">Ticket ID</th>
              <th class="text-center">Checked In?</th>
            </tr>
            <template v-for="(seatGroup, i) in seatGroupList" :key="i">
              <tr class="sm:hidden">
                <td colspan="3" class="py-2">
                  <u>
                    <div class="text-center">
                      <strong>Seat Group: </strong>
                      {{ seatGroup.name }}
                    </div>
                  </u>
                </td>
              </tr>
              <tr
                v-for="(ticket, n) in sortedTicketArray[i]"
                :key="i.toString() + n.toString()"
                :class="{
                  'bg-sta-orange-dark': highlightTicketId === ticket.id
                }"
              >
                <td class="hidden sm:table-cell pr-4">
                  <template v-if="n == 0">
                    {{ ticket.seatGroup.name }}
                  </template>
                  <template
                    v-else-if="
                      sortedTicketArray[i][n - 1].seatGroup.name !=
                      ticket.seatGroup.name
                    "
                  >
                    {{ ticket.seatGroup.name }}
                  </template>
                </td>
                <td class="pr-3 sm:">
                  {{ ticket.concessionType.name }}
                </td>
                <td class="pr-3 sm: font-mono md:text-base text-xs sm:text-sm">
                  {{ ticket.id }}
                </td>
                <td class="py-1 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <font-awesome-icon
                      :icon="
                        (editing ? editingData[ticket.id] : ticket.checkedIn)
                          ? 'check-circle'
                          : 'times-circle'
                      "
                      :class="[
                        (editing ? editingData[ticket.id] : ticket.checkedIn)
                          ? 'text-sta-green'
                          : 'text-sta-rouge'
                      ]"
                    />
                    <button
                      v-if="editing && !saving"
                      class="flex-none p-1 bg-sta-orange hover:bg-sta-orange-dark rounded focus:outline-none transition-colors"
                      @click="editingData[ticket.id] = !editingData[ticket.id]"
                    >
                      {{ editingData[ticket.id] ? 'Un-Check In' : 'Check In' }}
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import lo from 'lodash';
import LoadingIcon from '../ui/UiLoadingIcon.vue';
import Booking from '@/classes/Booking';

import CheckInMutation from '@/graphql/mutations/box-office/CheckInTickets.gql';
import UnCheckInMutation from '@/graphql/mutations/box-office/UnCheckInTickets.gql';
import BoxOfficePerformanceBooking from '@/graphql/queries/box-office/BoxOfficePerformanceBooking.gql';

export default {
  components: { LoadingIcon },
  props: {
    booking: {
      required: true,
      type: Booking
    },
    index: {
      required: true,
      type: Number
    },
    highlightTicketId: {
      default: null,
      type: [String, Number]
    }
  },
  data() {
    return {
      editing: false,
      editingData: null,
      saving: false
    };
  },
  computed: {
    seatGroupList() {
      return lo
        .uniqBy(this.booking.tickets, (ticket) => ticket.seatGroup.id)
        .map((ticket) => ticket.seatGroup);
    },
    sortedTicketArray() {
      return Object.values(
        lo.groupBy(this.booking.tickets, (ticket) => ticket.seatGroup.id)
      );
    }
  },
  methods: {
    startEditing() {
      this.editingData = lo.fromPairs(
        this.booking.tickets.map((ticket) => [ticket.id, ticket.checkedIn])
      );
      this.editing = true;
    },
    async updateBookingCheckins() {
      this.saving = true;

      const apollo = this.$apollo;
      const ticketsToCheckIn = this.booking.tickets
        .filter(
          (ticket) => !ticket.checkedIn && this.editingData[ticket.id] === true
        )
        .map((ticket) => {
          return { ticketId: ticket.id };
        });
      const ticketsToUnCheckIn = this.booking.tickets
        .filter((ticket) => this.editingData[ticket.id] === false)
        .map((ticket) => {
          return { ticketId: ticket.id };
        });

      const queries = [];

      if (ticketsToCheckIn.length) {
        queries.push(
          apollo.mutate({
            mutation: CheckInMutation,
            variables: {
              reference: this.booking.reference,
              performanceId: this.booking.performance.id,
              tickets: ticketsToCheckIn
            }
          })
        );
      }

      if (ticketsToUnCheckIn.length) {
        queries.push(
          apollo.mutate({
            mutation: UnCheckInMutation,
            variables: {
              reference: this.booking.reference,
              performanceId: this.booking.performance.id,
              tickets: ticketsToUnCheckIn
            }
          })
        );
      }

      await Promise.all(queries);

      const { data } = await apollo.query({
        query: BoxOfficePerformanceBooking,
        variables: {
          performanceId: this.booking.performance.id,
          bookingId: this.booking.id
        }
      });

      this.booking.updateFromAPIData(data.performance.bookings.edges[0].node);

      this.editing = this.saving = false;
    },
    cancelEdits() {
      this.editing = false;
    }
  }
};
</script>
