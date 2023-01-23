<template>
  <div class="bg-sta-gray-dark rounded-xl px-5 py-3 flex flex-col gap-2">
    <h2 class="underline text-2xl text-white text-center font-bold">
      <font-awesome-icon
        icon="fa-ticket"
        class="-rotate-45 mr-2"
      ></font-awesome-icon
      >Ticket Details
    </h2>
    <hr class="border-dashed border-sta-gray-light border" />
    <div class="flex flex-col gap-2 text-white">
      <div v-for="(item, i) in items" :key="i">
        <p class="text-lg">
          <strong>{{ item.title }}</strong>
        </p>
        <p>{{ item.text }}</p>
      </div>
      <p><strong>ID:</strong> {{ ticket.id }}</p>
    </div>
    <BoxOfficeButton
      class="text-white mt-auto"
      :class="[
        checkedIn
          ? 'bg-sta-orange hover:bg-sta-orange-dark'
          : 'bg-sta-green hover:bg-sta-green-dark'
      ]"
      >{{ checkedIn ? 'Un Check-in' : 'Check In' }}</BoxOfficeButton
    >
  </div>
</template>

<script lang="ts" setup>
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';
import {
  ConcessionTypeNode,
  ExtendedUserNode,
  SeatGroupNode,
  TicketNode
} from '~~/graphql/codegen/operations';

const props = defineProps<{
  ticket: Pick<TicketNode, 'id' | 'checkedInAt'> & {
    seatGroup: Pick<SeatGroupNode, 'name'>;
    concessionType: Pick<ConcessionTypeNode, 'name'>;
    checkedInBy?: Pick<ExtendedUserNode, 'firstName' | 'lastName'> | null;
  };
}>();

const now = useClock(5);

const checkedIn = computed(
  () => !!props.ticket.checkedInAt && !!props.ticket.checkedInBy
);

const items = computed<{ title: string; text: string }[]>(() => {
  const items = [
    { title: 'Seat Group', text: props.ticket.seatGroup.name },
    { title: 'Type', text: 'General Admission' }
  ];

  if (checkedIn.value) {
    const timeAgo = humanizeDuration(
      now.value.toMillis() -
        DateTime.fromISO(props.ticket.checkedInAt as string).toMillis(),
      {
        largest: 1,
        round: true
      }
    );

    items.push({
      title: 'Last Check In',
      text: `${timeAgo} ago by ${props.ticket.checkedInBy!.firstName} ${
        props.ticket!.checkedInBy!.lastName
      }`
    });
  }
  return items;
});
</script>
