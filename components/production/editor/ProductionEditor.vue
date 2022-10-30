<template>
  <div class="space-y-2">
    <card title="Basic Details">
      <div class="space-y-4">
        <form-label :errors="errors" name="name" :required="true">
          Name
          <template #control>
            <t-input
              :value="name"
              placeholder="e.g. My Show"
              @input="$emit('update:name', $event)"
            />
          </template>
        </form-label>
        <p v-if="computedSlug">
          <template v-if="!changingSlug">
            Your production will be at
            {{
              $router.resolve({ path: `/productions/${computedSlug}` }).route
                .fullPath
            }}
            <sta-button
              class="text-sm bg-sta-orange hover:bg-sta-orange-dark transition-colors"
              @click="
                () => {
                  changingSlug = true;
                  manualSlug = computedSlug;
                }
              "
            >
              Change
            </sta-button>
          </template>
          <template v-else>
            <div class="flex">
              <form-label class="flex-grow">
                Slug
                <t-input
                  :value="manualSlug"
                  @input="manualSlug = kebabCase($event)"
                />
              </form-label>
              <sta-button
                class="bg-sta-green hover:bg-sta-green-dark transition-colors lg:mx-8 mx-4 mt-6"
                @click="
                  () => {
                    $emit('update:slug', manualSlug);
                    changingSlug = false;
                  }
                "
              >
                Done
              </sta-button>
            </div>
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
        <form-label :errors="errors" name="contactEmail" :required="true">
          Contact Email Address
          <template #control>
            <t-input
              :value="contactEmail"
              @input="$emit('update:contactEmail', $event)"
            />
          </template>
          <template #helper>
            This email will be shown to people equiring about accessibility and
            content warnings.
          </template>
        </form-label>
        <form-label :errors="errors" name="description" :required="true">
          Description
          <template #control>
            <rich-text-input
              :value="description"
              @input="$emit('update:description', $event)"
            />
          </template>
        </form-label>
        <form-label :errors="errors" name="warnings">
          Content Warnings
          <template #control>
            <div>
              <table class="w-full">
                <tr
                  v-for="contentWarning in contentWarnings"
                  :key="contentWarning.warning.id"
                >
                  <th>
                    {{ contentWarning.warning.shortDescription }}
                    <p>
                      <sta-button
                        icon="trash"
                        :small="true"
                        colour="rouge"
                        @click="updateWarnings(contentWarning.warning, false)"
                      >
                        Remove
                      </sta-button>
                    </p>
                  </th>
                  <td>
                    <textarea
                      v-model="contentWarning.information"
                      class="w-full text-black"
                      type="text"
                      :placeholder="
                        contentWarning.information
                          ? contentWarning.information
                          : contentWarning.warning.longDescription
                          ? contentWarning.warning.longDescription
                          : 'You can provide extended information about this content warning here'
                      "
                    />
                  </td>
                </tr>
              </table>
            </div>
            <div>
              <sta-button
                class="bg-sta-green"
                icon="plus-circle"
                :small="true"
                @click="onAddWarning"
              >
                Add
              </sta-button>
            </div>
          </template>
        </form-label>
        <div class="flex items-end">
          <form-label
            class="lg:w-1/4 w-1/5 mr-4"
            :errors="errors"
            name="ageRating"
          >
            Age Rating
            <t-input
              :value="ageRating"
              type="number"
              min="4"
              max="18"
              @input="$emit('update:ageRating', $event)"
              @keypress.stop="
                if (!/^[0-9]$/i.test($event.key)) $event.preventDefault();
              "
            />
          </form-label>
          <form-label class="flex-grow" :errors="errors" name="facebookEvent">
            Facebook Event Link
            <t-input
              :value="facebookEvent"
              @input="$emit('update:facebookEvent', $event)"
            />
          </form-label>
        </div>
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
            text: society.name
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
        class="flex items-center justify-center p-4 bg-sta-gray-dark rounded-lg space-x-8"
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
            Feature Image
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
            Poster Image
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
import { v4 as uuid } from 'uuid';
import kebabCase from 'lodash/kebabCase';
import ImageInput from '../../ui/Inputs/ImageInput.vue';
import FormLabel from '../../ui/FormLabel.vue';
import Card from '../../ui/Card.vue';
import RichTextInput from '@/components/ui/Inputs/RichTextInput.vue';
import Errors from '@/classes/Errors';

import imageUpload from '@/services/imageUploadService';
import ErrorHelper from '@/components/ui/ErrorHelper.vue';
import StaButton from '@/components/ui/StaButton.vue';
import { swal } from '@/utils/alerts';
import {
  WarningsDocument,
  AdminSocietiesIndexDocument
} from '@/graphql/codegen/operations';

export default {
  components: {
    FormLabel,
    ImageInput,
    Card,
    RichTextInput,
    ErrorHelper,
    StaButton
  },
  props: {
    id: {
      type: String,
      default: null
    },
    errors: {
      type: Errors,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    },
    contactEmail: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    contentWarnings: {
      default: () => [],
      type: Array
    },
    society: {
      default: null,
      type: Object
    },
    facebookEvent: {
      default: null,
      type: String
    },
    ageRating: {
      default: null,
      type: [Number, String]
    },
    coverImage: {
      default: null,
      type: Object
    },
    posterImage: {
      default: null,
      type: Object
    },
    featuredImage: {
      default: null,
      type: Object
    },
    slug: {
      default: null,
      type: String
    }
  },
  data() {
    return {
      availableWarnings: [],
      availableSocieties: [],

      slugManuallyEdited: false,
      changingSlug: false,
      manualSlug: null
    };
  },
  apollo: {
    availableWarnings: {
      query: WarningsDocument,
      update: (data) => data.warnings.edges.map((edge) => edge.node)
    },
    availableSocieties: {
      query: AdminSocietiesIndexDocument,
      update: (data) => data.societies.edges.map((edge) => edge.node)
    }
  },
  computed: {
    computedSlug() {
      return this.slug || kebabCase(this.name);
    }
  },
  methods: {
    kebabCase,
    async onAddWarning() {
      const { value: warningId } = await swal.fire({
        input: 'select',
        inputOptions: Object.fromEntries(
          this.availableWarnings
            .filter(
              (warning) =>
                !this.contentWarnings
                  .map((cw) => cw.warning.id)
                  .includes(warning.id)
            )
            .map((warning) => [warning.id, warning.shortDescription])
        ),
        showCancelButton: true,
        confirmButtonText: 'Add'
      });

      if (!warningId) {
        return;
      }

      const warning = this.availableWarnings.find(
        (warning) => warning.id === warningId
      );

      const warningDescriptors = [
        'Contains themes throughout',
        'Contains references in dialogue',
        'Contains graphic references in dialogue',
        'Contains depiction of this trigger'
      ];

      const { value: descriptorIndex } = await swal.fire({
        title: `Please choose a description for "<strong>${warning.shortDescription}</strong>"`,
        text: 'Note that you can provide a custom, more detailed description by clicking the button below',
        input: 'select',
        inputOptions: warningDescriptors,
        showCancelButton: true,
        cancelButtonText: 'Let me add my own description',
        inputPlaceholder: 'Select a description',
        confirmButtonText: 'Finish'
      });

      this.updateWarnings(
        warning,
        true,
        descriptorIndex ? warningDescriptors[descriptorIndex] : null
      );
    },
    updateWarnings(warning, include, information = null) {
      return this.$emit(
        'update:contentWarnings',
        include
          ? [...this.contentWarnings, { information, warning }]
          : this.contentWarnings.filter(
              (currentWarning) => currentWarning.warning.id !== warning.id
            )
      );
    },
    async getInputData() {
      // Upload any new images
      const images = {
        coverImage: this.coverImage,
        featuredImage: this.featuredImage,
        posterImage: this.posterImage
      };

      for (const [key, imageNode] of Object.entries(images)) {
        if (!imageNode) {
          continue;
        }
        if (imageNode.id) {
          images[key] = imageNode.id;
        } else if (imageNode.file) {
          const image = await imageUpload(
            this,
            imageNode.file,
            key + `_${this.id ?? uuid()}.` + imageNode.file.name.split('.')[1]
          );
          images[key] = image.global_id;
        } else {
          images[key] = null;
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
        contactEmail: this.contactEmail,
        contentWarnings: this.contentWarnings.map((cw) => ({
          id: cw.warning.id,
          information: cw.information
        })),
        society: this.society?.id,
        ...images
      };

      if (!returnObject.id) {
        delete returnObject.id;
      }

      return returnObject;
    }
  }
};
</script>
