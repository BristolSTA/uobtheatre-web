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
              <image-input :value="editingProduction.featuredImage.url" />
            </template>
          </form-label>
          <form-label>
            Poster Image <required-star />
            <template #helper>
              A poster image for your production, portrait in standard "A" paper
              ratio (1√2).
            </template>
            <template #control>
              <image-input :value="editingProduction.posterImage.url" />
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
            <image-input :value="editingProduction.coverImage.url" />
          </template>
        </form-label>
      </div>
    </card>
    <card title="Performances"> </card>
  </div>
</template>

<script>
import RichTextInput from '@/components/ui/Inputs/RichTextInput.vue'
import Card from '../ui/Card.vue'
import RequiredStar from '../ui/Form/RequiredStar.vue'
import FormLabel from '../ui/FormLabel.vue'
import ImageInput from '../ui/Inputs/ImageInput.vue'
export default {
  components: { FormLabel, ImageInput, Card, RequiredStar, RichTextInput },
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
    }
  },
}
</script>
