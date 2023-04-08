<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="space-y-2">
    <UiCard title="Basic Details">
      <div class="space-y-4">
        <form-label :errors="errors" name="name" :required="true">
          Name
          <template #control>
            <UiInputText v-model="production.name" placeholder="e.g. My Show" />
          </template>
        </form-label>
        <p v-if="computedSlug">
          <template v-if="!changingSlug">
            Your production will be at
            {{
              useRouter().resolve({ path: `/productions/${computedSlug}` })
                .fullPath
            }}
            <UiStaButton
              class="text-sm bg-sta-orange hover:bg-sta-orange-dark transition-colors"
              @click="
                () => {
                  changingSlug = true;
                  manualSlug = computedSlug;
                }
              "
            >
              Change
            </UiStaButton>
          </template>
          <template v-else>
            <div class="flex">
              <form-label class="flex-grow">
                Slug
                <UiInputText
                  :model-value="manualSlug"
                  @update:model-value="manualSlug = kebabCase($event)"
                />
              </form-label>
              <UiStaButton
                class="bg-sta-green hover:bg-sta-green-dark transition-colors lg:mx-8 mx-4 mt-6"
                @click="
                  () => {
                    production.slug = manualSlug;
                    changingSlug = false;
                  }
                "
              >
                Done
              </UiStaButton>
            </div>
          </template>
          <br />
          <error-helper :errors="errors" field-name="slug" />
        </p>
        <form-label :errors="errors" name="subtitle">
          Subtitle
          <template #control>
            <UiInputText v-model="production.subtitle" />
          </template>
        </form-label>
        <form-label :errors="errors" name="contactEmail" :required="true">
          Contact Email Address
          <template #control>
            <UiInputText v-model="production.contactEmail" />
          </template>
          <template #helper>
            This email will be shown to people equiring about accessibility and
            content warnings.
          </template>
        </form-label>
        <form-label :errors="errors" name="description" :required="true">
          Description
          <template #control>
            <rich-text-input v-model="production.description" />
          </template>
        </form-label>
        <form-label :errors="errors" name="warnings">
          Content Warnings
          <template #control>
            <div>
              <table class="w-full">
                <tr
                  v-for="contentWarning in production.contentWarnings"
                  :key="contentWarning.warning.id"
                >
                  <th>
                    {{ contentWarning.warning.shortDescription }}
                    <p>
                      <UiStaButton
                        icon="trash"
                        :small="true"
                        colour="rouge"
                        @click="updateWarnings(contentWarning.warning, false)"
                      >
                        Remove
                      </UiStaButton>
                    </p>
                  </th>
                  <td>
                    <UiInputTextArea
                      v-model="contentWarning.information"
                      class="w-full text-black"
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
              <UiStaButton
                class="bg-sta-green"
                icon="plus-circle"
                :small="true"
                @click="onAddWarning"
              >
                Add
              </UiStaButton>
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
            <UiInputText
              v-model="production.ageRating"
              type="number"
              min="4"
              max="18"
              @keypress.stop="
                if (!/^[0-9]$/i.test($event.key)) $event.preventDefault();
              "
            />
          </form-label>
          <form-label class="flex-grow" :errors="errors" name="facebookEvent">
            Facebook Event Link
            <UiInputText v-model="production.facebookEvent" />
          </form-label>
        </div>
      </div>
    </UiCard>
    <UiCard title="Society">
      <UiInputSelect
        placeholder="Select a society"
        class="mb-4"
        :model-value="production.society?.id || ''"
        :options="
          availableSocieties.map((society) => ({
            value: society.id,
            displayText: society.name
          }))
        "
        @update:model-value="
          production.society = availableSocieties.find(
            (society) => society.id === $event
          )
        "
      />

      <div
        v-if="production.society"
        class="flex items-center justify-center p-4 bg-sta-gray-dark rounded-lg space-x-8"
      >
        <img :src="production.society.logo.url" style="max-width: 100px" />
        <span class="text-xl font-semibold">{{ production.society.name }}</span>
      </div>
      <div v-else>
        <h4 class="font-bold text-lg">No Society Selected</h4>
      </div>
      <error-helper :errors="errors" field-name="society" />
    </UiCard>
    <UiCard title="Images">
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
                :model-value="production.featuredImage?.url"
                :required-ratio="16 / 9"
                :min-width="400"
                :ratio-flexability="0.13"
                @change="production.featuredImage = { file: $event }"
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
                :model-value="production.posterImage?.url"
                :required-ratio="1 / Math.sqrt(2)"
                :min-width="100"
                @change="production.posterImage = { file: $event }"
              />
            </template>
          </form-label>
        </div>
        <form-label :errors="errors" name="coverImage">
          Cover Image
          <template #helper>
            A cover image used on the homepage carousel. Should have a ratio of
            roughly 3:1, with at least 1200px width dimension. This image should
            <strong>not</strong> have any text or logos on it.
          </template>
          <template #control>
            <image-input
              :model-value="production.coverImage?.url"
              :required-ratio="3"
              :min-width="1200"
              @change="production.coverImage = { file: $event }"
            />
          </template>
        </form-label>
      </div>
    </UiCard>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid';
import kebabCase from 'lodash/kebabCase';
import ImageInput from '../../ui/Input/ImageInput.vue';
import FormLabel from '../../ui/FormLabel.vue';

import RichTextInput from '@/components/ui/Input/RichTextInput.vue';
import Errors from '~~/classes/Errors';

import imageUpload from '~~/services/imageUploadService';
import ErrorHelper from '@/components/ui/ErrorHelper.vue';
import { swal } from '@/utils/alerts';
import {
  WarningsDocument,
  AdminSocietiesIndexDocument
} from '@/graphql/codegen/operations';

export default {
  components: {
    FormLabel,
    ImageInput,
    RichTextInput,
    ErrorHelper
  },
  props: {
    errors: {
      type: Errors,
      default: null
    },
    production: {
      type: Object,
      required: true
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
      return this.production.slug || kebabCase(this.production.name);
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
                !this.production.contentWarnings
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
      // eslint-disable-next-line vue/no-mutating-props
      this.production.contentWarnings = include
        ? [...this.production.contentWarnings, { information, warning }]
        : this.production.contentWarnings.filter(
            (currentWarning) => currentWarning.warning.id !== warning.id
          );
    },
    async getInputData() {
      // Upload any new images
      const images = {
        coverImage: this.production.coverImage,
        featuredImage: this.production.featuredImage,
        posterImage: this.production.posterImage
      };

      for (const [key, imageNode] of Object.entries(images)) {
        if (!imageNode) {
          continue;
        }
        if (imageNode.id) {
          images[key] = imageNode.id;
        } else if (imageNode.file) {
          const image = await imageUpload(
            imageNode.file,
            key + `_${this.id ?? uuid()}.` + imageNode.file.name.split('.')[1]
          );
          images[key] = image ? image.global_id : null;
        } else {
          images[key] = null;
        }
      }

      const returnObject = {
        id: this.production.id,
        name: this.production.name,
        slug: this.production.slug,
        subtitle: this.production.subtitle,
        description: this.production.description,
        ageRating: this.production.ageRating,
        facebookEvent: this.production.facebookEvent,
        contactEmail: this.production.contactEmail,
        contentWarnings: (this.production.contentWarnings ?? []).map((cw) => ({
          id: cw.warning.id,
          information: cw.information
        })),
        society: this.production.society?.id,
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
