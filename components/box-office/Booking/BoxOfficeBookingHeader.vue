<template>
  <div>
    <div class="flex justify-between text-white">
      <span class="uppercase text-3xl truncate tracking-wider">
        {{ booking.user.firstName }} {{ booking.user.lastName }}
      </span>
      <span class="font-bold text-3xl">{{ booking.reference }}</span>
    </div>
    <div class="flex justify-between text-sta-gray-lighter font-bold">
      <span>
        {{ numberTicketsCollected }}
        {{ pluralize('Ticket', numberTicketsCollected) }}
      </span>
      <span
        >{{ booking.tickets.length - numberTicketsCollected }} Checked In</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import pluralize from 'pluralize';

const props = defineProps<{
  booking: {
    reference: string;
    user: {
      firstName: string;
      lastName: string;
    };
    tickets: { checkedInAt?: string }[];
  };
}>();

const numberTicketsCollected = computed(
  () =>
    props.booking.tickets.filter((ticket) => ticket.checkedInAt !== null).length
);
</script>
