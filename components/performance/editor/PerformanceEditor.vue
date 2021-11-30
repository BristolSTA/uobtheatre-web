<template>
  <div class="space-y-2">
    <card title="Timings">
      <div class="space-y-4">
        <p>
          <strong>Important Note:</strong> All times should be according to UTC
          time (i.e. GMT)
        </p>
        <form-label name="doorsOpen" :errors="errors">
          Doors Open <required-star />
          <t-datepicker
            v-model="editingPerformance.doorsOpen"
            user-format="Y-m-d H:i"
            :timepicker="true"
            class="text-black"
          />
        </form-label>
        <form-label name="start" :errors="errors">
          Performance Starts <required-star />
          <t-datepicker
            v-model="editingPerformance.start"
            user-format="Y-m-d H:i"
            :timepicker="true"
            class="text-black"
          />
        </form-label>
        <form-label name="end" :errors="errors">
          Performance Ends <required-star />
          <t-datepicker
            v-model="editingPerformance.end"
            user-format="Y-m-d H:i"
            :timepicker="true"
            class="text-black"
          />
        </form-label>
      </div>
    </card>

    <card title="Ticket Options">
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div class="px-2 border border-sta-gray rounded-lg">
          <div class="flex items-center justify-between pt-3">
            <h4 class="text-h4">Seat Groups</h4>
            <font-awesome-icon icon="plus-circle" />
          </div>
          <div class="py-3 space-y-2">
            <seat-group
              v-for="seatGroup in availableSeatGroups"
              :key="seatGroup.id"
              :value="seatGroup"
              :removable="true"
            />
          </div>
        </div>
        <div class="px-2 border border-sta-gray rounded-lg">
          <div class="flex items-center justify-between pt-3">
            <h4 class="text-h4">Concessions</h4>
            <font-awesome-icon icon="plus-circle" />
          </div>
          <div class="py-3 space-y-2">
            <concession-type
              v-for="(concessionType, index) in availableConcessionTypes"
              :key="concessionType.id"
              v-bind.sync="availableConcessionTypes[index]"
              :removable="true"
              :editable="true"
            />
          </div>
        </div>
      </div>

      <h4 class="mt-6 text-h4">Ticket Pricing</h4>
      <div
        v-if="
          !availableConcessionTypes.some(
            (concessionType) => concessionType.discountPercentage == 0
          )
        "
        class="p-4 text-white bg-sta-rouge"
      >
        You hooligan! You need at least one concession type with 0% discount.
      </div>
      <div class="max-w-full overflow-x-auto">
        <table class="w-full">
          <tr>
            <th></th>
            <th
              v-for="concessionType in availableConcessionTypes"
              :key="concessionType.id"
              class="pb-2"
            >
              {{ concessionType.name }}
              <form-label>
                Discount Percentage
                <percentage-input v-model="concessionType.discountPercentage" />
              </form-label>
            </th>
          </tr>
          <tr
            v-for="seatGroup in availableSeatGroups"
            :key="seatGroup.id"
            class="odd:bg-sta-gray even:bg-sta-gray-dark"
          >
            <th class="p-2">
              <span class="text-sta-orange">{{ seatGroup.name }}</span>
              <form-label>
                <currency-input
                  v-model="seatGroup.price"
                  placeholder="Base Price"
                />
              </form-label>
            </th>
            <td
              v-for="concessionType in availableConcessionTypes"
              :key="concessionType.id"
            >
              <div class="text-center">
                £{{
                  (
                    seatGroup.price *
                    (1 - concessionType.discountPercentage / 100)
                  ).toFixed(2)
                }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </card>
    <card title="Other Details">
      <div class="space-y-4">
        <form-label name="disabled" :errors="errors">
          Disabled<br />
          <template #control
            ><div>
              <t-toggle v-model="editingPerformance.disabled" />

              <br /><small
                >Disabled performances will not show, and will not be available
                for booking</small
              >
            </div></template
          >
        </form-label>
        <form-label name="capacity" :errors="errors">
          Performance Capacity
          <t-input v-model="editingPerformance.capacity" type="number" />
        </form-label>
        <form-label name="description" :errors="errors">
          Description
          <t-textarea v-model="editingPerformance.description" />
        </form-label>
        <form-label name="extraInformation" :errors="errors">
          Extra Information
          <t-textarea v-model="editingPerformance.extraInformation" />
        </form-label>
      </div>
    </card>
  </div>
</template>

<script>
import SeatGroupFake from '@/tests/unit/fixtures/SeatGroup.js'
import ConcessionTypeFake from '@/tests/unit/fixtures/ConcessionType.js'
import Card from '../../ui/Card.vue'
import RequiredStar from '../../ui/Form/RequiredStar.vue'
import FormLabel from '../../ui/FormLabel.vue'
import CurrencyInput from '../../ui/Inputs/CurrencyInput.vue'
import PercentageInput from '../../ui/Inputs/PercentageInput.vue'
import SeatGroup from './SeatGroup.vue'
import ConcessionType from './ConcessionType.vue'

export default {
  components: {
    FormLabel,
    Card,
    RequiredStar,
    SeatGroup,
    ConcessionType,
    CurrencyInput,
    PercentageInput,
  },
  props: {
    performance: {
      default: null,
      type: Object,
    },
  },
  data() {
    return {
      errors: null,
      editingPerformance: Object.assign({}, this.performance),
      availableSeatGroups: [
        SeatGroupFake(),
        SeatGroupFake({ id: 2, name: 'The Meh Seats' }),
        SeatGroupFake({ id: 3, name: 'Standing' }),
      ],
      availableConcessionTypes: [
        ConcessionTypeFake(),
        ConcessionTypeFake({ id: 2, name: 'Child' }),
        ConcessionTypeFake({ id: 3, name: 'OAP' }),
      ],
    }
  },
}
</script>
