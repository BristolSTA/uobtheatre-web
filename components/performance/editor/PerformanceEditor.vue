<template>
  <div class="space-y-2">
    <UiCard title="Venue">
      <t-select
        placeholder="Select a venue"
        class="mb-4"
        :value="venue ? venue.id : null"
        :disabled="!!performanceSeatGroups.length"
        :options="
          availableVenues.map((venue) => ({
            value: venue.id,
            text: venue.name
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
    </UiCard>
    <UiCard title="Timings">
      <div class="space-y-4">
        <p>
          <strong>Note:</strong> All times should be in the time local to the
          venue
        </p>
        <form-label name="doorsOpen" :errors="errors" :required="true">
          Doors Open
          <template #control>
            <t-datepicker
              :value="doorsOpen"
              user-format="Y-m-d H:i"
              date-format="Z"
              :timepicker="true"
              class="text-black"
              initial-time="00:00:00"
              @change="$emit('update:doorsOpen', $event)"
            />
          </template>
        </form-label>
        <form-label name="start" :errors="errors" :required="true">
          Performance Starts
          <template #control>
            <t-datepicker
              :value="start"
              user-format="Y-m-d H:i"
              date-format="Z"
              :timepicker="true"
              class="text-black"
              initial-time="00:00:00"
              @change="$emit('update:start', $event)"
            />
          </template>
        </form-label>
        <form-label name="end" :errors="errors" :required="true">
          Performance Ends
          <template #control>
            <t-datepicker
              :value="end"
              user-format="Y-m-d H:i"
              date-format="Z"
              :timepicker="true"
              class="text-black"
              initial-time="00:00:00"
              @change="$emit('update:end', $event)"
            />
          </template>
        </form-label>
        <form-label name="intervalDurationMins" :errors="errors">
          Interval Length
          <template #control>
            <t-input
              :value="intervalDurationMins"
              type="number"
              min="1"
              @input="$emit('update:intervalDurationMins', $event)"
              @keypress.stop="
                if (!/^[0-9]$/i.test($event.key)) $event.preventDefault();
              "
            />
          </template>
          <template #helper>
            If your performance has an interval, enter the approximate duration
            <u>in minutes</u>. Otherwise, you can leave it blank.
          </template>
        </form-label>
      </div>
    </UiCard>

    <UiCard title="Ticket Options">
      <template
        v-if="similarPerformances.length && showTicketsEditor"
        #messageBox
      >
        <UiStaButton
          class="bg-sta-orange hover:bg-sta-orange-dark transition-colors"
          @click="loadTicketOptions"
        >
          Load From Exisiting Performance
        </UiStaButton>
      </template>
      <template v-if="!showTicketsEditor">
        <p class="text-center">
          Would you like to load ticket options from an exisiting performance?
        </p>
        <div class="flex justify-center gap-4 max-w-xl mx-auto mt-2">
          <UiStaButton
            class="bg-sta-orange hover:bg-sta-orange-dark transition-colors"
            @click="loadTicketOptions"
          >
            Load from exisiting
          </UiStaButton>
          <UiStaButton
            class="bg-sta-gray hover:bg-sta-gray-dark transition-colors"
            @click="ignoredExisitingPerformances = true"
          >
            Start from scratch
          </UiStaButton>
        </div>
      </template>
      <template v-else>
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
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
              <alert v-if="!venue" class="text-sm" level="warning">
                You must select a venue before adding seat groups
              </alert>
              <alert
                v-if="
                  venue && selectedSeatGroupCapacities > venue.internalCapacity
                "
                class="text-sm"
                level="warning"
              >
                <strong>NB:</strong> Venue capacity will limit this
                performance's capacity automatically to
                {{ venue.internalCapacity }}
              </alert>
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
              >
                <template
                  v-if="discount.performances.edges.length > 1"
                  #editor-footer
                >
                  <alert>
                    Synced with
                    {{ discount.performances.edges.length - 1 }} other
                    performances.
                  </alert>
                </template>
              </concession-type>
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
            :discounts="performance.discounts.edges"
            :performance-seat-groups="performanceSeatGroups"
            :editing="true"
          />
        </div>
      </template>
    </UiCard>
    <UiCard title="Other Details">
      <div class="space-y-4">
        <form-label name="disabled" :errors="errors">
          Disabled
          <template #control>
            <t-toggle
              :checked="disabled"
              @change="$emit('update:disabled', $event)"
            />
          </template>
          <template #helper>
            Disabled performances will not show, and will not be available for
            booking
          </template>
        </form-label>
        <form-label name="capacity" :errors="errors">
          Performance Capacity
          <template #control>
            <t-input
              :value="capacity"
              type="number"
              min="1"
              @input="$emit('update:capacity', $event)"
              @keypress.stop="
                if (!/^[0-9]$/i.test($event.key)) $event.preventDefault();
              "
            />
          </template>
          <template #helper>
            Optionally, add the capacity of the performance. If not given, the
            capacity from the seat groups assigned will be used. You can reserve
            comp seats later - this should be representitive of the total number
            of seats actually phsyically allowed.
          </template>
        </form-label>
        <form-label name="description" :errors="errors">
          Description
          <template #control>
            <t-textarea
              :value="description"
              @input="$emit('update:description', $event)"
            />
          </template>
        </form-label>
      </div>
    </UiCard>
  </div>
</template>

<script>
import FormLabel from '../../ui/FormLabel.vue';
import SeatGroup from './SeatGroup.vue';
import ConcessionType from './ConcessionType.vue';
import PriceMatrix from './PriceMatrix.vue';
import ErrorHelper from '@/components/ui/ErrorHelper.vue';
import Errors from '@/classes/Errors';
import { getValidationErrors, performMutation } from '@/utils/api';
import { swal } from '@/utils/alerts';
import { dateFormat } from '@/utils/datetime';
import Alert from '@/components/ui/Alert.vue';
import { singleDiscounts as singleDiscountsFn } from '@/utils/performance';

import {
  AdminPerformanceDetailDocument,
  AdminPerformancesIndexDocument,
  AdminVenueDetailedDocument,
  ConcessionTypeMutationDocument,
  DeleteDiscountMutationDocument,
  DeletePerformanceSeatGroupMutationDocument,
  DiscountMutationDocument,
  DiscountRequirementMutationDocument,
  PerformanceSeatGroupDocument,
  VenuesDocument
} from '@/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    FormLabel,

    SeatGroup,
    ConcessionType,
    ErrorHelper,
    Alert,
    PriceMatrix
  },
  props: {
    performance: {
      default: null,
      type: Object
    },
    id: {
      type: String,
      default: null
    },
    capacity: {
      type: [Number, String],
      default: null
    },
    doorsOpen: {
      type: String,
      default: null
    },
    start: {
      type: String,
      default: null
    },
    production: {
      type: Object,
      default: null
    },
    end: {
      type: String,
      default: null
    },
    venue: {
      type: Object,
      default: null
    },
    errors: {
      type: Errors,
      default: null
    },
    discounts: {
      type: Object,
      default: () => {}
    },
    ticketOptions: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: null
    },
    intervalDurationMins: {
      type: [Number],
      default: null
    }
  },
  data() {
    return {
      ignoredExisitingPerformances: false,
      availableSeatGroups: [],
      availableVenues: [],
      otherPerformances: [],

      performanceSeatGroups: [],

      deletedDiscounts: []
    };
  },
  apollo: {
    availableVenues: {
      query: VenuesDocument,
      update: (data) => data.venues.edges.map((edge) => edge.node)
    },
    availableSeatGroups: {
      query: AdminVenueDetailedDocument,
      update: (data) => data.venue.seatGroups.edges.map((edge) => edge.node),
      variables() {
        return {
          slug: this.venue.slug
        };
      },
      skip() {
        return !this.venue;
      }
    },
    otherPerformances: {
      query: AdminPerformancesIndexDocument,
      update: (data) =>
        data.production.performances.edges.map((edge) => edge.node),
      variables() {
        return {
          productionId: this.production.id
        };
      },
      fetchPolicy: 'cache-and-network'
    }
  },
  computed: {
    remainingSeatGroups() {
      return this.availableSeatGroups.filter(
        (seatGroup) =>
          !this.currentSeatGroups.find(
            (currentSeatGroup) => currentSeatGroup.id === seatGroup.id
          )
      );
    },
    similarPerformances() {
      return this.otherPerformances.filter(
        (performance) =>
          performance.venue.id === this.venue?.id && performance.id !== this.id
      );
    },
    currentSeatGroups() {
      return this.performanceSeatGroups.map(
        (ticketOption) => ticketOption.seatGroup
      );
    },
    singleDiscounts() {
      return singleDiscountsFn(this.discounts?.edges || []);
    },
    selectedSeatGroupCapacities() {
      return this.performanceSeatGroups.reduce(
        (sum, option) => sum + option.capacity,
        0
      );
    },
    showTicketsEditor() {
      return (
        this.performanceSeatGroups.length ||
        this.singleDiscounts.length ||
        this.ignoredExisitingPerformances ||
        !this.similarPerformances.length
      );
    }
  },
  watch: {
    ticketOptions: {
      handler(newValue) {
        this.performanceSeatGroups = [...newValue];
      },
      immediate: true
    },
    similarPerformances(newVal) {
      // If this is a create operation, and there are similar performances
      if (newVal.length && !this.id) {
        // If no interval has been set yet, but similar performances has an interval, pre-fill with those interval lengths
        const intervalLength = newVal.find(
          (performance) => performance.intervalDurationMins
        )?.intervalDurationMins;
        if (this.intervalDurationMins === null && intervalLength) {
          this.$emit('update:intervalDurationMins', intervalLength);
        }
      }
    }
  },
  methods: {
    getInputData() {
      const returnObject = {
        id: this.id,
        doorsOpen: this.doorsOpen,
        intervalDurationMins:
          this.intervalDurationMins === '' ? null : this.intervalDurationMins,
        start: this.start,
        end: this.end,
        venue: this.venue?.id,
        disabled: this.disabled,
        description: this.description,
        capacity: this.capacity === '' ? null : this.capacity
      };

      if (!returnObject.id) {
        delete returnObject.id;
      }

      return returnObject;
    },
    async loadTicketOptions() {
      const { value } = await swal.fire({
        input: 'select',
        inputOptions: Object.fromEntries(
          this.similarPerformances.map((performance) => [
            performance.id,
            'Performance at ' +
              dateFormat(performance.start, 'EEEE dd MMMM y HH:mm ZZZZ')
          ])
        ),
        showCancelButton: true,
        confirmButtonText: 'Load'
      });
      if (!value) {
        return;
      }

      // Load the details
      const { data } = await this.$apollo.query({
        query: AdminPerformanceDetailDocument,
        variables: {
          productionSlug: this.production.slug,
          performanceId: value
        },
        fetchPolicy: 'no-cache'
      });

      // Delete exisiting performance seat groups
      const performance = data.production.performances.edges[0].node;
      this.performanceSeatGroups = [];

      // Delete exisiting discounts / concessions
      for (const discount of this.singleDiscounts) {
        await this.deleteConcession(discount);
      }

      // For the chosen performancem add seat groups ...
      performance.ticketOptions.forEach((performanceSeatGroup) => {
        this.addSeatGroup(
          performanceSeatGroup.seatGroup,
          performanceSeatGroup.price
        );
      });

      // And concession types...
      for (const edge of performance.discounts.edges) {
        if (
          edge.node.requirements.length > 1 ||
          edge.node.requirements[0].number !== 1
        ) {
          continue;
        }
        const requirement = edge.node.requirements[0];
        await this.addNewConcession(
          requirement.concessionType.name,
          requirement.concessionType.description,
          edge.node.percentage,
          requirement.concessionType.id
        );
      }
    },
    async saveRelated() {
      const mutations = [];
      // Process seat group changes
      const currentSeatGroupIds = this.ticketOptions.map(
        (ticketOption) => ticketOption.id
      );
      const editedSeatGroupIds = this.performanceSeatGroups.map(
        (performanceSeatGroup) => performanceSeatGroup.id
      );

      // Delete deleted seat groups
      currentSeatGroupIds
        .filter((currentId) => !editedSeatGroupIds.includes(currentId))
        .forEach((currentId) => {
          mutations.push(
            performMutation(
              this.$apollo,
              {
                mutation: DeletePerformanceSeatGroupMutationDocument,
                variables: {
                  id: currentId
                }
              },
              'deletePerformanceSeatGroup'
            )
          );
        });

      // Update or add edited ones
      this.performanceSeatGroups.forEach((performanceSeatGroup) => {
        const input = {
          seatGroup: performanceSeatGroup.seatGroup.id,
          performance: this.performance.id,
          price: performanceSeatGroup.price
        };
        if (performanceSeatGroup.id) {
          input.id = performanceSeatGroup.id;
        }
        mutations.push(
          performMutation(
            this.$apollo,
            {
              mutation: PerformanceSeatGroupDocument,
              variables: {
                input
              }
            },
            'performanceSeatGroup'
          )
        );
      });

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
                  mutation: DiscountMutationDocument,
                  variables: {
                    input: {
                      id: discount.id,
                      performances: discount.performances.edges
                        .map((edge) => edge.node.id)
                        .filter((id) => id !== this.performance.id)
                    }
                  }
                },
                'discount'
              )
            );
          }

          // Otherwise, try the delete
          mutations.push(
            performMutation(
              this.$apollo,
              {
                mutation: DeleteDiscountMutationDocument,
                variables: { id: discount.id }
              },
              'deleteDiscount'
            )
          );
        });

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
                  )
                };
                if (discount.id) {
                  input.id = discount.id;
                }
                performMutation(
                  this.$apollo,
                  {
                    mutation: DiscountMutationDocument,
                    variables: {
                      input
                    }
                  },
                  'discount'
                ).then((data) => {
                  discount.id = data.discount.discount.id;
                  // Create or update the discount requirement & concession
                  discount.requirements.forEach((requirement) => {
                    // Step #1: Concession Type
                    let input = {
                      name: requirement.concessionType.name,
                      description: requirement.concessionType.description
                    };

                    if (requirement.concessionType.id) {
                      input.id = requirement.concessionType.id;
                    }

                    performMutation(
                      this.$apollo,
                      {
                        mutation: ConcessionTypeMutationDocument,
                        variables: {
                          input
                        }
                      },
                      'concessionType'
                    )
                      .then((data) => {
                        requirement.concessionType.id =
                          data.concessionType.concessionType.id;

                        // Step#2: Update or create the requirement
                        input = {
                          number: requirement.number,
                          concessionType: requirement.concessionType.id,
                          discount: discount.id
                        };
                        if (requirement.id) {
                          input.id = requirement.id;
                        }

                        performMutation(
                          this.$apollo,
                          {
                            mutation: DiscountRequirementMutationDocument,
                            variables: {
                              input
                            }
                          },
                          'discountRequirement'
                        )
                          .then(resolve())
                          .catch((e) => reject(e));
                      })
                      .catch((e) => reject(e));
                  });
                });
              })
            );
          });
      }

      try {
        await Promise.all(mutations);
        return true;
      } catch (e) {
        this.$emit('update:errors', getValidationErrors(e));
        return false;
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
              seatGroup.name
            ])
          ),
          showCancelButton: true,
          confirmButtonText: 'Add'
        });
        if (!value) {
          return;
        }
        sg = this.remainingSeatGroups.find(
          (seatGroup) => seatGroup.id === value
        );
      }

      this.performanceSeatGroups.push({
        seatGroup: sg,
        price,
        capacity: sg.capacity
      });
    },
    async addNewConcession(
      name = null,
      description = null,
      percentage = 0,
      id = null
    ) {
      const currentNum = this.discounts?.edges
        ? this.discounts.edges.length
        : 0;
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
                    id,
                    name: name || `New Concession Type ${currentNum + 1}`,
                    description
                  }
                }
              ]
            }
          }
        ]
      });
    },
    async deleteConcession(discount) {
      // Remove from array
      await this.$emit('update:discounts', {
        edges: this.discounts.edges.filter((edge) => edge.node !== discount)
      });

      this.deletedDiscounts.push(discount);
    }
  }
});
</script>
