<template>
  <tr
    class="text-center text-white hover:bg-opacity-80 cursor-pointer"
    :class="[
      active
        ? 'bg-sta-orange'
        : index % 2 == 0
          ? 'bg-sta-gray-light'
          : 'bg-sta-gray',
    ]"
    @click="$emit('select-booking')"
    @keypress="$emit('select-booking')"
  >
    <td class="p-2">
      <template
        v-if="booking.user.firstName"
      >
        {{ booking.user.firstName }} {{ booking.user.lastName }}
      </template><template v-else>
        <i>Anonymous User</i>
      </template>
    </td>
    <td class="p-2 font-mono text-sm md:text-base">
      {{ booking.reference }}
    </td>
    <td class="p-2" style="width: 1%">
      <font-awesome-icon
        :icon="booking.allCheckedIn ? 'check-circle' : 'times-circle'"
        :class="[booking.allCheckedIn ? 'text-sta-green' : 'text-sta-rouge']"
      />
    </td>
    <td class="p-2 font-mono">
      £{{ (booking.raw.salesBreakdown.totalPayments / 100).toFixed(2) }}
    </td>
  </tr>
</template>

<script>
import Booking from '@/classes/Booking'

export default {
  props: {
    booking: {
      required: true,
      type: Booking
    },
    active: {
      required: true,
      type: Boolean
    },
    index: {
      required: true,
      type: Number
    }
  }
}
</script>
