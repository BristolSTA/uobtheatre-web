<template>
  <div class="space-y-2">
    <UiCard title="Basic Details">
      <div class="space-y-4">
        <form-label :errors="errors" name="name" :required="true">
          Name
          <template #control>
            <UiInputText
              v-model="localProduction.name"
              placeholder="e.g. My Show"
            />
          </template>
        </form-label>
        <p v-if="computedSlug">
          <template v-if="!changingSlug">
            Your production will be at
            {{
              router.resolve({ path: `/productions/${computedSlug}` }).fullPath
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
              <form-label class="grow">
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
                    localProduction.slug = manualSlug;
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
            <UiInputText v-model="localProduction.subtitle" />
          </template>
        </form-label>
        <form-label :errors="errors" name="contactEmail" :required="true">
          Contact Email Address
          <template #control>
            <UiInputText v-model="localProduction.contactEmail" />
          </template>
          <template #helper>
            This email will be shown to people equiring about accessibility and
            content warnings.
          </template>
        </form-label>
        <form-label :errors="errors" name="description" :required="true">
          Description
          <template #control>
            <rich-text-input v-model="localProduction.description" />
          </template>
        </form-label>
        <form-label :errors="errors" name="shortDescription">
          Short Description
          <template #control>
            <UiInputText v-model="localProduction.shortDescription" />
          </template>
          <template #helper>
            This will be shown in place of the description on the front page.
          </template>
        </form-label>
        <form-label :errors="errors" name="warnings">
          Content Warnings
          <template #control>
            <div>
              <table class="w-full">
                <tr
                  v-for="contentWarning in localProduction.contentWarnings ||
                  []"
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
                @click="onAddWarning"
              >
                Add
              </UiStaButton>
            </div>
          </template>
        </form-label>
        <form-label :errors="errors" name="productionAlert">
          Production Alert
          <template #control>
            <UiInputText v-model="localProduction.productionAlert" />
          </template>
          <template #helper>
            A Production Alert is displayed alongside content warnings on a
            production's page and when a user is booking a ticket. Only use this
            field for information that is essential for users to view, but that
            cannot otherwise be conveyed through content warnings.
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
              v-model="localProduction.ageRating"
              type="number"
              min="4"
              max="18"
              @keypress.stop="
                if (!/^[0-9]$/i.test($event.key)) $event.preventDefault();
              "
            />
          </form-label>
          <form-label class="grow" :errors="errors" name="facebookEvent">
            Facebook Event Link
            <UiInputText v-model="localProduction.facebookEvent" />
          </form-label>
        </div>
      </div>
    </UiCard>
    <UiCard title="Society">
      <UiInputSelect
        placeholder="Select a society"
        class="mb-4"
        :model-value="localProduction.society?.id || ''"
        :options="
          availableSocieties.map((society) => ({
            value: society.id,
            displayText: society.name
          }))
        "
        @update:model-value="
          localProduction.society = availableSocieties.find(
            (society) => society.id === $event
          )
        "
      />

      <div
        v-if="localProduction.society"
        class="flex items-center justify-center p-4 bg-sta-gray-dark rounded-lg space-x-8"
      >
        <img :src="localProduction.society.logo.url" style="max-width: 100px" />
        <span class="text-xl font-semibold">{{
          localProduction.society.name
        }}</span>
      </div>
      <div v-else class="inline-flex items-center">
        <h4 class="font-bold text-lg">No Society Selected</h4>
        <required-star />
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
              should have a ratio of 16:9.
            </template>
            <template #control>
              <image-input
                :model-value="localProduction.featuredImage?.url"
                :required-ratio="16 / 9"
                :min-width="400"
                :ratio-flexability="0.13"
                @change="localProduction.featuredImage = { file: $event }"
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
                :model-value="localProduction.posterImage?.url"
                :required-ratio="1 / Math.sqrt(2)"
                :min-width="100"
                @change="localProduction.posterImage = { file: $event }"
              />
            </template>
          </form-label>
        </div>
        <form-label :errors="errors" name="coverImage">
          Cover Image
          <template #helper>
            A cover image used on the homepage carousel. Should have a ratio of
            3:1, with at least 1200px width dimension. This image should
            <strong>not</strong> have any text or logos on it – it will be used
            as a background with text on top.
          </template>
          <template #control>
            <image-input
              :model-value="localProduction.coverImage?.url"
              :required-ratio="3"
              :min-width="1200"
              @change="localProduction.coverImage = { file: $event }"
            />
          </template>
        </form-label>
      </div>
    </UiCard>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { v4 as uuid } from 'uuid';
import kebabCase from 'lodash/kebabCase';
import cloneDeep from 'lodash/cloneDeep';
import ImageInput from '../../ui/Input/ImageInput.vue';
import FormLabel from '../../ui/FormLabel.vue';
import RequiredStar from '~/components/ui/Form/RequiredStar.vue';
import RichTextInput from '@/components/ui/Input/RichTextInput.vue';
import Errors from '~~/classes/Errors';
import imageUpload from '~~/services/imageUploadService';
import ErrorHelper from '@/components/ui/ErrorHelper.vue';
import { swal } from '@/utils/alerts';
import {
  WarningsDocument,
  AdminSocietiesIndexDocument
} from '@/graphql/codegen/operations';

const props = defineProps({
  errors: {
    type: Errors,
    default: null
  },
  production: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:production']);

const router = useRouter();

const changingSlug = ref(false);
const manualSlug = ref(null);

const localProduction = ref(cloneDeep(props.production));

watch(
  localProduction,
  (newVal) => {
    emit('update:production', newVal);
  },
  { deep: true }
);

const { result: warningsResult } = useQuery(WarningsDocument);
const availableWarnings = computed(
  () => warningsResult.value?.warnings.edges.map((edge) => edge.node) || []
);

const { result: societiesResult } = useQuery(AdminSocietiesIndexDocument);
const availableSocieties = computed(
  () => societiesResult.value?.societies.edges.map((edge) => edge.node) || []
);

const computedSlug = computed(
  () => localProduction.value.slug || kebabCase(localProduction.value.name)
);

const onAddWarning = async () => {
  const { value: warningId } = await swal.fire({
    input: 'select',
    inputOptions: Object.fromEntries(
      availableWarnings.value
        .filter(
          (warning) =>
            !(localProduction.value.contentWarnings || [])
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

  const warning = availableWarnings.value.find(
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

  updateWarnings(
    warning,
    true,
    descriptorIndex ? warningDescriptors[descriptorIndex] : null
  );
};

const updateWarnings = (warning, include, information = null) => {
  const current = localProduction.value.contentWarnings || [];
  localProduction.value.contentWarnings = include
    ? [...current, { information, warning }]
    : current.filter(
        (currentWarning) => currentWarning.warning.id !== warning.id
      );
};

const getInputData = async () => {
  const images = {
    coverImage: localProduction.value.coverImage,
    featuredImage: localProduction.value.featuredImage,
    posterImage: localProduction.value.posterImage
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
        key +
          `_${localProduction.value.id ?? uuid()}.` +
          imageNode.file.name.split('.').at(-1)
      );
      images[key] = image ? image.global_id : null;
    } else {
      images[key] = null;
    }
  }

  const returnObject = {
    id: localProduction.value.id,
    name: localProduction.value.name,
    slug: localProduction.value.slug,
    subtitle: localProduction.value.subtitle,
    description: localProduction.value.description,
    ageRating: localProduction.value.ageRating
      ? parseInt(localProduction.value.ageRating, 10)
      : null,
    facebookEvent: localProduction.value.facebookEvent,
    contactEmail: localProduction.value.contactEmail,
    productionAlert: localProduction.value.productionAlert,
    contentWarnings: (localProduction.value.contentWarnings ?? []).map(
      (cw) => ({
        id: cw.warning.id,
        information: cw.information
      })
    ),
    society: localProduction.value.society?.id,
    ...images
  };

  if (!returnObject.id) {
    delete returnObject.id;
  }

  return returnObject;
};

defineExpose({ getInputData });
</script>
