<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="space-y-2">
    <UiCard title="Venue">
      <UiInputSelect
        placeholder="Select a venue"
        class="mb-4"
        :model-value="performance.venue?.id || ''"
        :disabled="!!performanceSeatGroups.length"
        :options="
          availableVenues.map((venue) => ({
            value: venue.id,
            displayText: venue.name
          }))
        "
        @update:model-value="
          performance.venue = availableVenues.find(
            (venue) => venue.id === $event
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
            <UiInputDateTime v-model="performance.doorsOpen" />
          </template>
        </form-label>
        <form-label name="start" :errors="errors" :required="true">
          Performance Starts
          <template #control>
            <UiInputDateTime v-model="performance.start" />
          </template>
        </form-label>
        <form-label name="end" :errors="errors" :required="true">
          Performance Ends
          <template #control>
            <UiInputDateTime v-model="performance.end" />
          </template>
        </form-label>
        <form-label name="intervalDurationMins" :errors="errors">
          Interval Length
          <template #control>
            <UiInputText
              v-model="performance.intervalDurationMins"
              type="number"
              min="1"
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
              <alert v-if="!performance.venue" class="text-sm" level="warning">
                You must select a venue before adding seat groups
              </alert>
              <alert
                v-if="
                  performance.venue &&
                  selectedSeatGroupCapacities >
                    performance.venue.internalCapacity
                "
                class="text-sm"
                level="warning"
              >
                <strong>NB:</strong> Venue capacity will limit this
                performance's capacity automatically to
                {{ performance.venue.internalCapacity }}
              </alert>
            </div>
          </div>
          <div class="px-2 border border-sta-gray rounded-lg">
            <div class="flex items-center justify-between pt-3">
              <h4 class="text-h4">Ticket Types</h4>
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
                v-model:name="discount.requirements[0].concessionType.name"
                v-model:description="
                  discount.requirements[0].concessionType.description
                "
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

        <h4 class="mt-6 text-h4">Ticket Types</h4>
        <div
          v-if="!performanceSeatGroups.length"
          class="p-4 text-white bg-sta-rouge"
        >
          You need to add at least one seat group.
        </div>
        <div
          v-else-if="!singleDiscounts.length"
          class="p-4 text-white bg-sta-rouge"
        >
          You need to add at least one ticket type (e.g. 'General Admission').
        </div>
        <div v-else class="max-w-full overflow-x-auto">
          <div
            v-if="!singleDiscounts.some((discount) => discount.percentage == 0)"
            class="p-4 text-white bg-sta-rouge"
          >
            You need to add at least one ticket type with a 0% discount (e.g.
            'General Admission').
          </div>
          <price-matrix
            :discounts="performanceDiscountsLocal.edges"
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
            <UiInputToggle v-model="performance.disabled" />
          </template>
          <template #helper>
            Disabled performances will not show, and will not be available for
            booking
          </template>
        </form-label>
        <form-label name="capacity" :errors="errors">
          Performance Capacity
          <template #control>
            <UiInputText
              v-model="performance.capacity"
              type="number"
              min="1"
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
          Performance Description
          <template #control>
            <UiInputTextArea v-model="performance.description" />
          </template>
          <template #helper>
            Optionally, add a description unique to this performance (e.g.
            'Relaxed Performance'). Users will be shown this description when
            booking a ticket for this performance.
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
import Errors from '~~/classes/Errors';
import { getValidationErrors, performMutation } from '@/utils/api';
import { swal } from '@/utils/alerts';
import { dateFormat } from '@/utils/datetime';
import Alert from '@/components/ui/Alert.vue';
import { getSingleDiscounts } from '@/utils/performance';

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

export default {
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
    errors: {
      type: Errors,
      default: null
    },
    production: {
      type: Object,
      required: true
    }
  },
  emits: ['update:errors', 'update:performance'],
  data() {
    return {
      ignoredExisitingPerformances: false,
      availableSeatGroups: [],
      availableVenues: [],
      otherPerformances: [],

      performanceSeatGroups: [],
      performanceDiscountsLocal: { edges: [] },

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
          slug: this.performance.venue.slug
        };
      },
      skip() {
        return !this.performance.venue;
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
      return getSingleDiscounts(this.performanceDiscountsLocal?.edges || []);
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
    'performance.ticketOptions': {
      handler(newValue) {
        if (newValue !== undefined) this.performanceSeatGroups = [...newValue];
      },
      immediate: true
    },
    // Link this nested property with a local property, and watch for it to change
    // This is because performance.discounts is a property of a local property (i.e. it is nested),
    // so we can't mutate it directly, and instead have to have a local copy and use
    // $emit elsewhere to update
    'performance.discounts': {
      handler(newValue) {
        if (newValue !== undefined) this.performanceDiscountsLocal = newValue;
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
        if (this.performance.intervalDurationMins === null && intervalLength) {
          // eslint-disable-next-line vue/no-mutating-props
          this.performance.intervalDurationMins = intervalLength;
        }
      }
    }
  },
  methods: {
    getInputData() {
      const returnObject = {
        id: this.performance.id,
        doorsOpen: this.performance.doorsOpen,
        intervalDurationMins:
          this.performance.intervalDurationMins === ''
            ? null
            : this.performance.intervalDurationMins,
        start: this.performance.start,
        end: this.performance.end,
        venue: this.performance.venue?.id,
        disabled: !!this.performance.disabled,
        description: this.performance.description,
        capacity:
          this.performance.capacity === '' ? null : this.performance.capacity
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

      // For the chosen performance add seat groups ...
      performance.ticketOptions.forEach((performanceSeatGroup) => {
        this.addSeatGroup(
          performanceSeatGroup.seatGroup,
          performanceSeatGroup.price
        );
      });

      // And concession types...
      for (const edge of performanceDiscountsLocal.edges) {
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
      const currentSeatGroupIds = this.performance.ticketOptions
        ? this.performance.ticketOptions.map((ticketOption) => ticketOption.id)
        : [];

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
      if (this.performanceDiscountsLocal?.edges) {
        this.performanceDiscountsLocal.edges
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
      const currentNum = this.performanceDiscountsLocal?.edges
        ? this.performanceDiscountsLocal.edges.length
        : 0;

      this.performanceDiscountsLocal = {
        edges: [
          ...(this.performanceDiscountsLocal?.edges || []),
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
      };

      // Alert about the local update to keep the remote version in sync
      this.$emit('update:performance', {
        ...this.performance,
        discounts: this.performanceDiscountsLocal
      });
    },
    async deleteConcession(discount) {
      // Remove from array

      this.performanceDiscountsLocal = {
        edges: this.performanceDiscountsLocal.edges.filter(
          (edge) => edge.node !== discount
        )
      };

      this.deletedDiscounts.push(discount);

      // Alert about the local update to keep the remote version in sync
      this.$emit('update:performance', {
        ...this.performance,
        discounts: this.performanceDiscountsLocal
      });
    }
  }
};
</script>
