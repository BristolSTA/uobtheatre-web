<template>
  <div class="px-4 py-2 text-center text-white rounded-sm bg-sta-green">
    <span class="font-semibold">Family Ticket:</span>
    <div class="flex justify-center text-sm">
      <table class="text-left table-auto">
        <tr>
          <td class="pr-2">Adult</td>
          <td>x 2</td>
        </tr>
        <tr>
          <td class="pr-2">Studentttttttt</td>
          <td>x 10</td>
        </tr>
      </table>
    </div>
    <button
      class="font-semibold text-sm btn w-full mt-1 px-2.5 py-1 rounded-sm btn-orange"
    >
      Add Ticket: £18.00
    </button>
  </div>
</template>

<script>
export default {
  name: 'group-ticket-button',
  props: {
    // concession_type: {
    //   required: true,
    // },
    // current_tickets: {
    //   required: true,
    // },
  },
  methods: {
    addTicket() {
      this.$emit('add-tickets');
    },
  },
};
</script>
