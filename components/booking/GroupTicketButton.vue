<template>
  <div class="px-4 py-2 text-center text-white bg-sta-green rounded-sm">
    <span class="font-semibold">{{ discount.name }}:</span>
    <div class="flex justify-center text-sm">
      <table class="table-auto text-left">
        <tr v-for="(requirement, index) in discount.requirements" :key="index">
          <td class="pr-2">{{ requirement.concessionType.name }}</td>
          <td>x {{ requirement.number }}</td>
        </tr>
      </table>
    </div>
    <button
      class="
        btn btn-orange
        mt-1
        px-2.5
        py-1
        w-full
        text-sm
        font-semibold
        rounded-sm
      "
      @click="addTickets"
      @keypress="addTickets"
    >
      Add Tickets
    </button>
  </div>
</template>

<script>
export default {
  name: 'GroupTicketButton',
  props: {
    discount: {
      required: true,
      type: Object,
    },
  },
  methods: {
    addTickets() {
      this.$emit('add-discount-tickets')
    },
  },
}
</script>
