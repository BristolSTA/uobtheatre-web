<template>
  <div class="space-y-2">
    <card title="Basic Details">
      <div class="space-y-4">
        <form-label :errors="errors" name="name">
          Name <required-star />
          <t-input
            :value="name"
            placeholder="e.g. My Show"
            @input="$emit('update:name', $event)"
          />
        </form-label>
        <p v-if="computedSlug">
          <template v-if="!changingSlug">
            Your production will be at
            {{
              $router.resolve({ path: `/productions/${computedSlug}` }).route
                .fullPath
            }}
            <sta-button
              class="
                text-sm
                bg-sta-orange
                hover:bg-sta-orange-dark
                transition-colors
              "
              @click="
                () => {
                  changingSlug = true
                  manualSlug = computedSlug
                }
              "
              >Change</sta-button
            >
          </template>
          <template v-else>
            <form-label>
              Slug
              <t-input
                :value="manualSlug"
                @input="manualSlug = kebabCase($event)"
              />
            </form-label>
            <sta-button
              class="bg-sta-green hover:bg-sta-green-dark transition-colors"
              @click="
                () => {
                  $emit('update:slug', manualSlug)
                  changingSlug = false
                }
              "
              >Done</sta-button
            >
          </template>
          <br />
          <error-helper :errors="errors" field-name="slug" />
        </p>
        <form-label :errors="errors" name="subtitle">
          Subtitle
          <t-input
            :value="subtitle"
            @input="$emit('update:subtitle', $event)"
          />
        </form-label>
        <form-label :errors="errors" name="description">
          Description <required-star />
          <template #control>
            <rich-text-input
              :value="description"
              @input="$emit('update:description', $event)"
            />
          </template>
        </form-label>
        <form-label :errors="errors" name="warnings">
          Audience Warnings
          <template #control>
            <div class="flex flex-wrap space-x-3">
              <div v-for="(warning, index) in availableWarnings" :key="index">
                <input
                  type="checkbox"
                  :checked="
                    warnings.find(
                      (currentWarning) => currentWarning.id === warning.id
                    )
                  "
                  @change="updateWarnings(warning, $event.target.checked)"
                />
                {{ warning.description }}
              </div>
            </div>
          </template>
        </form-label>
        <form-label :errors="errors" name="facebookEvent">
          Facebook Event Link
          <t-input
            :value="facebookEvent"
            @input="$emit('update:facebookEvent', $event)"
          />
        </form-label>
        <form-label :errors="errors" name="ageRating">
          Age Rating
          <t-input
            :value="ageRating"
            type="number"
            min="4"
            max="18"
            @input="$emit('update:ageRating', $event)"
          />
        </form-label>
      </div>
    </card>
    <card title="Society">
      <t-select
        placeholder="Select a society"
        class="mb-4"
        :value="society ? society.id : null"
        :options="
          availableSocieties.map((society) => ({
            value: society.id,
            text: society.name,
          }))
        "
        @input="
          $emit(
            'update:society',
            availableSocieties.find((society) => society.id === $event)
          )
        "
      />

      <div
        v-if="society"
        class="
          flex
          items-center
          justify-center
          p-4
          bg-sta-gray-dark
          rounded-lg
          space-x-8
        "
      >
        <img :src="society.logo.url" style="max-width: 100px" />
        <span class="text-xl font-semibold">{{ society.name }}</span>
      </div>
      <div v-else>
        <h4 class="font-bold text-lg">No Society Selected</h4>
      </div>
      <error-helper :errors="errors" field-name="society" />
    </card>
    <card title="Images">
      <div class="space-y-4">
        <div class="flex flex-wrap justify-evenly md:flex-nowrap md:space-x-4">
          <form-label :errors="errors" name="featuredImage">
            Feature Image <required-star />
            <template #helper>
              The main image used to promote your production across the site. It
              should have a ratio of roughly 16:9
            </template>
            <template #control>
              <image-input
                :value="featuredImage ? featuredImage.url : null"
                :required-ratio="16 / 9"
                :min-width="400"
                :ratio-flexability="0.13"
                @change="$emit('update:featuredImage', { file: $event })"
              />
            </template>
          </form-label>
          <form-label :errors="errors" name="posterImage">
            Poster Image <required-star />
            <template #helper>
              A poster image for your production, portrait in standard "A" paper
              ratio (1/√2).
            </template>
            <template #control>
              <image-input
                :value="posterImage ? posterImage.url : null"
                :required-ratio="1 / Math.sqrt(2)"
                :min-width="100"
                @change="$emit('update:posterImage', { file: $event })"
              />
            </template>
          </form-label>
        </div>
        <form-label :errors="errors" name="coverImage">
          Cover Image
          <template #helper>
            A cover image used on the homepage carousel. Should have a ratio of
            roughly 3:1, with at least 1200px width dimension
          </template>
          <template #control>
            <image-input
              :value="coverImage ? coverImage.url : null"
              :required-ratio="3"
              :min-width="1200"
              @change="$emit('update:coverImage', { file: $event })"
            />
          </template>
        </form-label>
      </div>
    </card>
  </div>
</template>

<script>
import RichTextInput from '@/components/ui/Inputs/RichTextInput.vue'
import Errors from '@/classes/Errors'

import imageUpload from '@/services/imageUploadService'
import { v4 as uuid } from 'uuid'
import map from 'lodash/map'
import kebabCase from 'lodash/kebabCase'
import ErrorHelper from '@/components/ui/ErrorHelper.vue'
import StaButton from '@/components/ui/StaButton.vue'
import ImageInput from '../../ui/Inputs/ImageInput.vue'
import FormLabel from '../../ui/FormLabel.vue'
import RequiredStar from '../../ui/Form/RequiredStar.vue'
import Card from '../../ui/Card.vue'

export default {
  components: {
    FormLabel,
    ImageInput,
    Card,
    RequiredStar,
    RichTextInput,
    ErrorHelper,
    StaButton,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    errors: {
      type: Errors,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    subtitle: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    warnings: {
      default: () => [],
      type: Array,
    },
    society: {
      default: null,
      type: Object,
    },
    facebookEvent: {
      default: null,
      type: String,
    },
    ageRating: {
      default: null,
      type: [Number, String],
    },
    coverImage: {
      default: null,
      type: Object,
    },
    posterImage: {
      default: null,
      type: Object,
    },
    featuredImage: {
      default: null,
      type: Object,
    },
    slug: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      availableWarnings: [],
      availableSocieties: [],

      slugManuallyEdited: false,
      changingSlug: false,
      manualSlug: null,
    }
  },
  apollo: {
    availableWarnings: {
      query: require('@/graphql/queries/Warnings.gql'),
      update: (data) => data.warnings.edges.map((edge) => edge.node),
    },
    availableSocieties: {
      query: require('@/graphql/queries/admin/societies/AdminSocietiesIndex.gql'),
      update: (data) => data.societies.edges.map((edge) => edge.node),
    },
  },
  computed: {
    computedSlug() {
      return this.slug || kebabCase(this.name)
    },
  },
  methods: {
    kebabCase,
    updateWarnings(warning, include) {
      return this.$emit(
        'update:warnings',
        include
          ? [...this.warnings, warning]
          : this.warnings.filter(
              (currentWarning) => currentWarning.id !== warning.id
            )
      )
    },
    async getInputData() {
      // Upload any new images
      const images = {
        coverImage: this.coverImage,
        featuredImage: this.featuredImage,
        posterImage: this.posterImage,
      }

      for (const [key, imageNode] of Object.entries(images)) {
        if (!imageNode) continue
        if (imageNode.id) {
          images[key] = imageNode.id
        } else if (imageNode.file) {
          const image = await imageUpload(
            this,
            imageNode.file,
            key + `_${this.id ?? uuid()}.` + imageNode.file.name.split('.')[1]
          )
          images[key] = image.global_id
        } else {
          images[key] = null
        }
      }

      const returnObject = {
        id: this.id,
        name: this.name,
        slug: this.slug,
        subtitle: this.subtitle,
        description: this.description,
        ageRating: this.ageRating,
        facebookEvent: this.facebookEvent,
        warnings: map(this.warnings, 'id'),
        society: this.society?.id,
        ...images,
      }

      if (!returnObject.id) {
        delete returnObject.id
      }

      return returnObject
    },
  },
}
</script>
