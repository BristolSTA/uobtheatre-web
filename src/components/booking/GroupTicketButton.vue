<template>
  <div class="px-4 py-2 text-center text-white rounded-sm bg-sta-green">
    <span class="font-semibold">{{ discount.name }}:</span>
    <div class="flex justify-center text-sm">
      <table class="text-left table-auto">
        <tr
          v-for="(
            discount_requirement, index
          ) in discount.discount_requirements"
          :key="index"
        >
          <td class="pr-2">{{ discount_requirement.concession_type.name }}</td>
          <td>x {{ discount_requirement.number }}</td>
        </tr>
      </table>
    </div>
    <button
      class="font-semibold text-sm btn w-full mt-1 px-2.5 py-1 rounded-sm btn-orange"
      @click="addTickets"
      @keypress="addTickets"
    >
      Add Tickets
    </button>
  </div>
</template>

<script>
export default {
  name: 'group-ticket-button',
  props: {
    discount: {
      required: true,
    },
  },
  methods: {
    addTickets() {
      this.$emit('add-discount-tickets');
    },
  },
};
</script>
