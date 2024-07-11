<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2 text-white">
      <div v-for="(item, i) in items" :key="i">
        <p class="text-lg">
          <strong>{{ item.title }}</strong>
        </p>
        <p>{{ item.text }}</p>
      </div>
      <p><strong>ID:</strong> {{ ticket.id }}</p>
    </div>
    <BoxOfficeBookingCheckInButton
      v-if="allowCheckIn"
      class="mt-auto"
      :check-in="!checkedIn"
      @check-in="emit('checkIn', { ticket, asyncCompleteCallback: $event })"
      @un-check-in="
        emit('unCheckIn', { ticket, asyncCompleteCallback: $event })
      "
    />
  </div>
</template>

<script lang="ts" setup>
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';
import type {
  ConcessionTypeNode,
  ExtendedUserNode,
  SeatGroupNode,
  TicketNode
} from '~~/graphql/codegen/operations';

type Ticket = Pick<TicketNode, 'id' | 'checkedInAt'> & {
  seatGroup: Pick<SeatGroupNode, 'name'>;
  concessionType: Pick<ConcessionTypeNode, 'name'>;
  checkedInBy?: Pick<ExtendedUserNode, 'firstName' | 'lastName'> | null;
};

const props = withDefaults(
  defineProps<{
    ticket: Ticket;
    allowCheckIn?: boolean;
  }>(),
  {
    allowCheckIn: false
  }
);

const now = useClock(5);

const emit = defineEmits<{
  (
    event: 'checkIn',
    payload: { ticket: Ticket; asyncCompleteCallback: () => void }
  ): void;
  (
    event: 'unCheckIn',
    payload: { ticket: Ticket; asyncCompleteCallback: () => void }
  ): void;
}>();

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
