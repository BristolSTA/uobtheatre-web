<template>
  <table class="text-sm sm:text-base">
    <tr class="text-left border-b">
      <th class="pl-3">Seat Group</th>
      <th>Type</th>
      <th class="text-center">Checked In</th>
    </tr>
    <tr v-for="ticket in tickets" :key="ticket.id">
      <td
        class="hidden sm:table-cell pr-4 border-l-8 pl-2"
        :class="[
          selectedTicketId === ticket.id
            ? 'border-sta-orange'
            : 'border-transparent'
        ]"
      >
        {{ ticket.seatGroup.name }}
      </td>
      <td class="pr-3 sm:">
        {{ ticket.concessionType.name }}
      </td>
      <td class="py-1 text-center">
        <div class="flex items-center justify-center space-x-2">
          <font-awesome-icon
            :icon="ticket.checkedInAt ? 'check-circle' : 'times-circle'"
            class="text-xl"
            :class="[ticket.checkedInAt ? 'text-sta-green' : 'text-sta-rouge']"
          />
        </div>
      </td>
      <td v-if="allowInspection">
        <UiStaButton
          class="bg-white text-black py-1 font-bold"
          @click="selectTicket(ticket)"
          >Inspect</UiStaButton
        >
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import type { IBookingTicketProp } from '../BoxOfficeSharedTypes';

const emit = defineEmits<{
  (event: 'selectTicket', ticket: IBookingTicketProp): void;
}>();

withDefaults(
  defineProps<{
    tickets: IBookingTicketProp[];
    selectedTicketId?: string;
    allowInspection?: boolean;
  }>(),
  {
    allowInspection: true,
    selectedTicketId: undefined
  }
);

function selectTicket(ticket: IBookingTicketProp) {
  emit('selectTicket', ticket);
}
</script>
