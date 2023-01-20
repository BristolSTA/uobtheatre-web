<template>
  <div>
    <div class="flex justify-between text-white">
      <span class="uppercase text-3xl truncate tracking-wider">
        {{ booking.user?.firstName || 'Unknown' }}
        {{ booking.user?.lastName || 'User' }}
      </span>
      <span class="font-bold text-3xl">{{ booking.reference }}</span>
    </div>
    <div class="flex justify-between text-sta-gray-lighter font-bold">
      <span>
        {{ tickets.length }}
        {{ pluralize('Ticket', numberTicketsCollected) }}
      </span>
      <span>{{ numberTicketsCollected }} Checked In</span>
    </div>
  </div>
</template>

<script lang="ts">
import pluralize from 'pluralize';
import { PropType } from 'vue';

export type IBookingHeader = {
  reference: string;
  user?:
    | {
        firstName: string;
        lastName: string;
      }
    | null
    | undefined;
  tickets: { checkedInAt?: any }[] | null;
};

export default defineComponent({
  props: {
    booking: {
      required: true,
      type: Object as PropType<IBookingHeader>
    },
    interactable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const tickets = computed(() => props.booking.tickets ?? []);

    const numberTicketsCollected = computed(
      () => tickets.value.filter((ticket) => ticket.checkedInAt !== null).length
    );

    return { tickets, numberTicketsCollected, pluralize };
  }
});
</script>
