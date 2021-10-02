<template>
  <div class="space-y-2">
    <card title="Basic Details">
      <div class="space-y-4">
        <form-label>
          Name <required-star />
          <t-input
            v-model="editingProduction.name"
            placeholder="e.g. My Show"
          />
        </form-label>
        <form-label>
          Subtitle
          <t-input v-model="editingProduction.subtitle" />
        </form-label>
        <form-label>
          Description <required-star />
          <template #control>
            <rich-text-input v-model="editingProduction.description" />
          </template>
        </form-label>
        <form-label>
          Audience Warnings <required-star />
          <template #control>
            <div class="flex flex-wrap space-x-3">
              <div v-for="(warning, index) in availableWarnings" :key="index">
                <input type="checkbox" /> {{ warning.warning }}
              </div>
            </div>
          </template>
        </form-label>
        <form-label>
          Facebook Event Link
          <t-input v-model="editingProduction.facebookEvent" />
        </form-label>
        <form-label>
          Age Rating
          <t-input
            v-model="editingProduction.ageRating"
            type="number"
            min="4"
            max="18"
          />
        </form-label>
      </div>
    </card>
    <card title="Society">
      <div
        class="
          flex
          items-center
          justify-center
          p-4
          space-x-8
          rounded-lg
          bg-sta-gray-dark
        "
      >
        <img :src="production.society.logo.url" style="max-width: 100px" />
        <span class="text-xl font-semibold">{{ production.society.name }}</span>
      </div>
    </card>
    <card title="Images">
      <div class="space-y-4">
        <div class="flex flex-wrap md:flex-nowrap md:space-x-4 justify-evenly">
          <form-label>
            Feature Image <required-star />
            <template #helper>
              The main image used to promote your production across the site. It
              should have a ratio of roughly 16:9
            </template>
            <template #control>
              <image-input
                :value="
                  editingProduction.featuredImage
                    ? editingProduction.featuredImage.url
                    : null
                "
              />
            </template>
          </form-label>
          <form-label>
            Poster Image <required-star />
            <template #helper>
              A poster image for your production, portrait in standard "A" paper
              ratio (1√2).
            </template>
            <template #control>
              <image-input
                :value="
                  editingProduction.posterImage
                    ? editingProduction.posterImage.url
                    : null
                "
              />
            </template>
          </form-label>
        </div>
        <form-label>
          Cover Image
          <template #helper>
            A cover image used on the homepage carousel. Should have a ratio of
            roughly 3:1, with at least 1200px width dimension
          </template>
          <template #control>
            <image-input
              :value="
                editingProduction.coverImage
                  ? editingProduction.coverImage.url
                  : null
              "
            />
          </template>
        </form-label>
      </div>
    </card>
    <card title="Ticket Options">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="px-2 border rounded-lg border-sta-gray">
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
        <div class="px-2 border rounded-lg border-sta-gray">
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
            class="even:bg-sta-gray-dark odd:bg-sta-gray"
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
  </div>
</template>

<script>
import RichTextInput from '@/components/ui/Inputs/RichTextInput.vue'
import SeatGroupFake from '@/tests/unit/fixtures/SeatGroup.js'
import ConcessionTypeFake from '@/tests/unit/fixtures/ConcessionType.js'
import Card from '../../ui/Card.vue'
import RequiredStar from '../../ui/Form/RequiredStar.vue'
import FormLabel from '../../ui/FormLabel.vue'
import ImageInput from '../../ui/Inputs/ImageInput.vue'
import CurrencyInput from '../../ui/Inputs/CurrencyInput.vue'
import PercentageInput from '../../ui/Inputs/PercentageInput.vue'
import SeatGroup from './SeatGroup.vue'
import ConcessionType from './ConcessionType.vue'

export default {
  components: {
    FormLabel,
    ImageInput,
    Card,
    RequiredStar,
    RichTextInput,
    SeatGroup,
    ConcessionType,
    CurrencyInput,
    PercentageInput,
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      editingProduction: Object.assign({}, this.production),
      availableWarnings: [
        { id: 1, warning: 'Warning 1' },
        { id: 2, warning: 'Warning 2' },
        { id: 3, warning: 'Warning 3' },
        { id: 4, warning: 'Warning 4' },
        { id: 5, warning: 'Warning 5' },
      ],
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
