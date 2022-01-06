<template>
  <div class="space-y-2">
    <card title="Venue">
      <t-select
        placeholder="Select a venue"
        class="mb-4"
        :value="venue ? venue.id : null"
        :disabled="!!performanceSeatGroups.length"
        :options="
          availableVenues.map((venue) => ({
            value: venue.id,
            text: venue.name,
          }))
        "
        @input="
          $emit(
            'update:venue',
            availableVenues.find((venue) => venue.id === $event)
          )
        "
      />
      <span v-if="performanceSeatGroups.length" class="text-sm font-semibold"
        >You can't change the venue whilst the performance has seat groups
        assigned</span
      >
      <error-helper :errors="errors" field-name="venue" />
    </card>
    <card title="Timings">
      <div class="space-y-4">
        <p>
          <strong>Note:</strong> All times should be in the time local to the
          venue
        </p>
        <form-label name="doorsOpen" :errors="errors" :required="true">
          Doors Open
          <template #control
            ><t-datepicker
              :value="doorsOpen"
              user-format="Y-m-d H:i"
              date-format="Z"
              :timepicker="true"
              class="text-black"
              @change="$emit('update:doorsOpen', $event)"
          /></template>
        </form-label>
        <form-label name="start" :errors="errors" :required="true">
          Performance Starts
          <template #control
            ><t-datepicker
              :value="start"
              user-format="Y-m-d H:i"
              date-format="Z"
              :timepicker="true"
              class="text-black"
              @change="$emit('update:start', $event)"
          /></template>
        </form-label>
        <form-label name="end" :errors="errors">
          Performance Ends <required-star />
          <template #control
            ><t-datepicker
              :value="end"
              user-format="Y-m-d H:i"
              date-format="Z"
              :timepicker="true"
              class="text-black"
              @change="$emit('update:end', $event)"
          /></template>
        </form-label>
      </div>
    </card>

    <card title="Ticket Options">
      <template
        v-if="similarPerformances.length && showTicketsEditor"
        #messageBox
      >
        <sta-button
          class="bg-sta-orange hover:bg-sta-orange-dark transition-colors"
          @click="loadTicketOptions"
          >Load From Exisiting Performance</sta-button
        >
      </template>
      <template v-if="!showTicketsEditor">
        <p class="text-center">
          Would you like to load ticket options from an exisiting performance?
        </p>
        <div class="flex justify-center gap-4 max-w-xl mx-auto mt-2">
          <sta-button
            class="bg-sta-orange hover:bg-sta-orange-dark transition-colors"
            @click="loadTicketOptions"
            >Load from exisiting</sta-button
          >
          <sta-button
            class="bg-sta-gray hover:bg-sta-gray-dark transition-colors"
            @click="ignoredExisitingPerformances = true"
            >Start from scratch</sta-button
          >
        </div>
      </template>
      <template v-else
        ><div class="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div class="px-2 border border-sta-gray rounded-lg">
            <div class="flex items-center justify-between pt-3">
              <h4 class="text-h4">Seat Groups</h4>
              <font-awesome-icon
                v-if="remainingSeatGroups.length"
                icon="plus-circle"
                class="cursor-pointer text-lg hover:text-gray-300"
                @click="addSeatGroup()"
              />
            </div>
            <div class="py-3 space-y-2">
              <seat-group
                v-for="(performanceSeatGroup, index) in performanceSeatGroups"
                :key="performanceSeatGroup.id"
                :value="performanceSeatGroup.seatGroup"
                :capacity-override="performanceSeatGroup.capacity"
                :removable="true"
                @remove="performanceSeatGroups.splice(index, 1)"
              />
              <alert
                v-if="
                  venue && selectedSeatGroupCapacities > venue.internalCapacity
                "
                level="warning"
                ><strong>NB:</strong> Venue capacity will limit this
                performance's capacity automatically to
                {{ venue.internalCapacity }}</alert
              >
            </div>
          </div>
          <div class="px-2 border border-sta-gray rounded-lg">
            <div class="flex items-center justify-between pt-3">
              <h4 class="text-h4">Concessions</h4>
              <font-awesome-icon
                icon="plus-circle"
                class="cursor-pointer text-lg hover:text-gray-300"
                @click="addNewConcession()"
              />
            </div>
            <div class="py-3 space-y-2">
              <concession-type
                v-for="discount in singleDiscounts"
                :key="discount.id"
                v-bind.sync="discount.requirements[0].concessionType"
                :removable="true"
                :editable="true"
                @remove="deleteConcession(discount)"
                ><template
                  v-if="discount.performances.edges.length > 1"
                  #editor-footer
                >
                  <alert
                    >Synced with
                    {{ discount.performances.edges.length - 1 }} other
                    performances.
                  </alert>
                </template></concession-type
              >
            </div>
          </div>
        </div>

        <h4 class="mt-6 text-h4">Ticket Pricing</h4>
        <div
          v-if="!performanceSeatGroups.length"
          class="p-4 text-white bg-sta-rouge"
        >
          Please add at least one seat group
        </div>
        <div
          v-else-if="!singleDiscounts.length"
          class="p-4 text-white bg-sta-rouge"
        >
          Please add at least one concession type
        </div>
        <div v-else class="max-w-full overflow-x-auto">
          <div
            v-if="!singleDiscounts.some((discount) => discount.percentage == 0)"
            class="p-4 text-white bg-sta-rouge"
          >
            You need at least one concession type with 0% discount.
          </div>
          <price-matrix
            :single-discounts="singleDiscounts"
            :performance-seat-groups="performanceSeatGroups"
            :editing="true"
          />
        </div>
      </template>
    </card>
    <card title="Other Details">
      <div class="space-y-4">
        <form-label name="disabled" :errors="errors">
          Disabled
          <template #control
            ><div>
              <t-toggle
                :checked="disabled"
                @change="$emit('update:disabled', $event)"
              />

              <br /><small
                >Disabled performances will not show, and will not be available
                for booking</small
              >
            </div></template
          >
        </form-label>
        <form-label name="capacity" :errors="errors">
          Performance Capacity
          <template #control
            ><t-input
              :value="capacity"
              type="number"
              min="1"
              @input="$emit('update:capacity', $event)"
              @keypress.stop="
                if (!/^[0-9]$/i.test($event.key)) $event.preventDefault()
              "
          /></template>
          <template #helper
            >Optionally, add the capacity of the performance. If not given, the
            capacity from the seat groups assigned will be used.</template
          >
        </form-label>
        <form-label name="description" :errors="errors">
          Description
          <template #control
            ><t-textarea
              :value="description"
              @input="$emit('update:description', $event)"
          /></template>
        </form-label>
      </div>
    </card>
  </div>
</template>

<script>
import ErrorHelper from '@/components/ui/ErrorHelper.vue'
import Errors from '@/classes/Errors'
import { getValidationErrors, performMutation, swal } from '@/utils'
import StaButton from '@/components/ui/StaButton.vue'
import Alert from '@/components/ui/Alert.vue'
import Card from '../../ui/Card.vue'
import RequiredStar from '../../ui/Form/RequiredStar.vue'
import FormLabel from '../../ui/FormLabel.vue'
import SeatGroup from './SeatGroup.vue'
import ConcessionType from './ConcessionType.vue'
import PriceMatrix from './PriceMatrix.vue'

export default {
  components: {
    FormLabel,
    Card,
    RequiredStar,
    SeatGroup,
    ConcessionType,
    ErrorHelper,
    StaButton,
    Alert,
    PriceMatrix,
  },
  props: {
    performance: {
      default: null,
      type: Object,
    },
    id: {
      type: String,
      default: null,
    },
    capacity: {
      type: [Number, String],
      default: null,
    },
    doorsOpen: {
      type: String,
      default: null,
    },
    start: {
      type: String,
      default: null,
    },
    production: {
      type: Object,
      default: null,
    },
    end: {
      type: String,
      default: null,
    },
    venue: {
      type: Object,
      default: null,
    },
    errors: {
      type: Errors,
      default: null,
    },
    discounts: {
      type: Object,
      default: () => {},
    },
    ticketOptions: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      ignoredExisitingPerformances: false,
      availableSeatGroups: [],
      availableVenues: [],
      otherPerformances: [],

      performanceSeatGroups: [],

      deletedDiscounts: [],
    }
  },
  apollo: {
    availableVenues: {
      query: require('@/graphql/queries/Venues.gql'),
      update: (data) => data.venues.edges.map((edge) => edge.node),
    },
    availableSeatGroups: {
      query: require('@/graphql/queries/admin/venue/AdminVenueDetailed.gql'),
      update: (data) => data.venue.seatGroups.edges.map((edge) => edge.node),
      variables() {
        return {
          slug: this.venue.slug,
        }
      },
      skip() {
        return !this.venue
      },
    },
    otherPerformances: {
      query: require('@/graphql/queries/admin/productions/AdminPerformancesIndex.gql'),
      update: (data) =>
        data.production.performances.edges.map((edge) => edge.node),
      variables() {
        return {
          productionId: this.production.id,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  computed: {
    remainingSeatGroups() {
      return this.availableSeatGroups.filter(
        (seatGroup) =>
          !this.currentSeatGroups.find(
            (currentSeatGroup) => currentSeatGroup.id === seatGroup.id
          )
      )
    },
    similarPerformances() {
      return this.otherPerformances.filter(
        (performance) =>
          performance.venue.id === this.venue?.id && performance.id !== this.id
      )
    },
    currentSeatGroups() {
      return this.performanceSeatGroups.map(
        (ticketOption) => ticketOption.seatGroup
      )
    },
    singleDiscounts() {
      return [
        ...(this.discounts?.edges || [])
          .map((edge) => edge.node)
          .filter(
            (discount) =>
              discount.requirements.length === 1 &&
              discount.requirements[0].number === 1
          ),
      ].sort(
        (discount1, discount2) => discount1.percentage - discount2.percentage
      )
    },
    selectedSeatGroupCapacities() {
      return this.performanceSeatGroups.reduce(
        (sum, option) => sum + option.capacity,
        0
      )
    },
    showTicketsEditor() {
      return (
        this.performanceSeatGroups.length ||
        this.singleDiscounts.length ||
        this.ignoredExisitingPerformances ||
        !this.similarPerformances.length
      )
    },
  },
  watch: {
    ticketOptions: {
      handler(newValue) {
        this.performanceSeatGroups = [...newValue]
      },
      immediate: true,
    },
  },
  methods: {
    getInputData() {
      const returnObject = {
        id: this.id,
        doorsOpen: this.doorsOpen,
        start: this.start,
        end: this.end,
        venue: this.venue?.id,
        disabled: this.disabled,
        description: this.description,
        capacity: this.capacity === '' ? null : this.capacity,
      }

      if (!returnObject.id) {
        delete returnObject.id
      }

      return returnObject
    },
    async loadTicketOptions() {
      const { value } = await swal.fire({
        input: 'select',
        inputOptions: Object.fromEntries(
          this.similarPerformances.map((performance) => [
            performance.id,
            'Performance at ' +
              this.$options.filters.dateFormat(
                performance.start,
                'EEEE dd MMMM y HH:mm ZZZZ'
              ),
          ])
        ),
        showCancelButton: true,
        confirmButtonText: 'Load',
      })
      if (!value) return

      // Load the details
      const { data } = await this.$apollo.query({
        query: require('@/graphql/queries/admin/productions/AdminPerformanceDetail.gql'),
        variables: {
          productionSlug: this.production.slug,
          performanceId: value,
        },
        fetchPolicy: 'no-cache',
      })
      const performance = data.production.performances.edges[0].node
      this.performanceSeatGroups = []
      await this.$emit('update:discounts', {})

      performance.ticketOptions.forEach((performanceSeatGroup) => {
        this.addSeatGroup(
          performanceSeatGroup.seatGroup,
          performanceSeatGroup.price
        )
      })

      for (const edge of performance.discounts.edges) {
        if (
          edge.node.requirements.length > 1 ||
          edge.node.requirements[0].number !== 1
        )
          continue
        const requirement = edge.node.requirements[0]
        await this.addNewConcession(
          requirement.concessionType.name,
          requirement.concessionType.description,
          edge.node.percentage
        )
      }
    },
    async saveRelated() {
      const mutations = []
      // Process seat group changes
      const currentSeatGroupIds = this.ticketOptions.map(
        (ticketOption) => ticketOption.id
      )
      const editedSeatGroupIds = this.performanceSeatGroups.map(
        (performanceSeatGroup) => performanceSeatGroup.id
      )

      // Delete deleted seat groups
      currentSeatGroupIds
        .filter((currentId) => !editedSeatGroupIds.includes(currentId))
        .forEach((currentId) => {
          mutations.push(
            performMutation(
              this.$apollo,
              {
                mutation: require('@/graphql/mutations/admin/performance/DeletePerformanceSeatGroup.gql'),
                variables: {
                  id: currentId,
                },
              },
              'deletePerformanceSeatGroup'
            )
          )
        })

      // Update or add edited ones
      this.performanceSeatGroups.forEach((performanceSeatGroup) => {
        const input = {
          seatGroup: performanceSeatGroup.seatGroup.id,
          performance: this.performance.id,
          price: performanceSeatGroup.price,
        }
        if (performanceSeatGroup.id) input.id = performanceSeatGroup.id
        mutations.push(
          performMutation(
            this.$apollo,
            {
              mutation: require('@/graphql/mutations/admin/performance/PerformanceSeatGroupMutation.gql'),
              variables: {
                input,
              },
            },
            'performanceSeatGroup'
          )
        )
      })

      // Delete old discounts
      this.deletedDiscounts
        .filter((discount) => discount.id)
        .forEach((discount) => {
          // Check if we want to delete the mutation, or if we can just remove the performances
          if (discount.performances.length > 1) {
            return mutations.push(
              performMutation(
                this.$apollo,
                {
                  mutation: require('@/graphql/mutations/admin/performance/DiscountMutation.gql'),
                  variables: {
                    input: {
                      id: discount.id,
                      performances: discount.performances.edges
                        .map((edge) => edge.node.id)
                        .filter((id) => id !== this.performance.id),
                    },
                  },
                },
                'discount'
              )
            )
          }

          // Otherwise, try the delete
          mutations.push(
            performMutation(
              this.$apollo,
              {
                mutation: require('@/graphql/mutations/admin/performance/DeleteDiscount.gql'),
                variables: { id: discount.id },
              },
              'deleteDiscount'
            )
          )
        })

      // Create or update concession types

      if (this.discounts?.edges) {
        this.discounts.edges
          .map((edge) => edge.node)
          .forEach((discount) => {
            mutations.push(
              new Promise((resolve, reject) => {
                // Create or update the discount
                const input = {
                  percentage: discount.percentage,
                  performances: discount.performances.edges.map(
                    (edge) => edge.node.id
                  ),
                }
                if (discount.id) input.id = discount.id
                performMutation(
                  this.$apollo,
                  {
                    mutation: require('@/graphql/mutations/admin/performance/DiscountMutation.gql'),
                    variables: {
                      input,
                    },
                  },
                  'discount'
                ).then((data) => {
                  discount.id = data.discount.discount.id
                  // Create or update the discount requirement & concession
                  discount.requirements.forEach((requirement) => {
                    // Step #1: Concession Type
                    let input = {
                      name: requirement.concessionType.name,
                      description: requirement.concessionType.description,
                    }

                    if (requirement.concessionType.id)
                      input.id = requirement.concessionType.id

                    performMutation(
                      this.$apollo,
                      {
                        mutation: require('@/graphql/mutations/admin/performance/ConcessionTypeMutation.gql'),
                        variables: {
                          input,
                        },
                      },
                      'concessionType'
                    )
                      .then((data) => {
                        requirement.concessionType.id =
                          data.concessionType.concessionType.id

                        // Step#2: Update or create the requirement
                        input = {
                          number: requirement.number,
                          concessionType: requirement.concessionType.id,
                          discount: discount.id,
                        }
                        if (requirement.id) input.id = requirement.id

                        performMutation(
                          this.$apollo,
                          {
                            mutation: require('@/graphql/mutations/admin/performance/DiscountRequirementMutation.gql'),
                            variables: {
                              input,
                            },
                          },
                          'discountRequirement'
                        )
                          .then(resolve())
                          .catch((e) => reject(e))
                      })
                      .catch((e) => reject(e))
                  })
                })
              })
            )
          })
      }

      try {
        await Promise.all(mutations)
        return true
      } catch (e) {
        this.$emit('update:errors', getValidationErrors(e))
        return false
      }
    },
    async addSeatGroup(sg = null, price = 0) {
      if (!sg) {
        const { value } = await swal.fire({
          text: 'Select seat group:',
          input: 'select',
          inputOptions: Object.fromEntries(
            this.remainingSeatGroups.map((seatGroup) => [
              seatGroup.id,
              seatGroup.name,
            ])
          ),
          showCancelButton: true,
          confirmButtonText: 'Add',
        })
        if (!value) return
        sg = this.remainingSeatGroups.find(
          (seatGroup) => seatGroup.id === value
        )
      }

      this.performanceSeatGroups.push({
        seatGroup: sg,
        price,
        capacity: sg.capacity,
      })
    },
    async addNewConcession(name = null, description = null, percentage = 0) {
      const currentNum = this.discounts?.edges ? this.discounts.edges.length : 0
      await this.$emit('update:discounts', {
        edges: [
          ...(this.discounts?.edges || []),
          {
            node: {
              percentage,
              performances: { edges: [{ node: this.performance }] },
              requirements: [
                {
                  number: 1,
                  concessionType: {
                    name: name || `New Concession Type ${currentNum + 1}`,
                    description,
                  },
                },
              ],
            },
          },
        ],
      })
    },
    deleteConcession(discount) {
      // Remove from array
      this.$emit('update:discounts', {
        edges: this.discounts.edges.filter((edge) => edge.node !== discount),
      })

      this.deletedDiscounts.push(discount)
    },
  },
}
</script>
