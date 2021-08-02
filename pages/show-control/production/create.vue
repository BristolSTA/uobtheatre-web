<template>
  <div class="container mx-auto">
    <h1 class="text-h1">Create a production</h1>
    <div class="space-y-2">
      <card title="Basic Details">
        <div class="space-y-4">
          <form-label>
            Name <required-star />
            <t-input v-model="production.name" placeholder="e.g. My Show" />
          </form-label>
          <form-label>
            Subtitle
            <t-input v-model="production.subtitle" />
          </form-label>
          <form-label>
            Description <required-star />
            <template #control>
              <rich-text-input v-model="production.description" />
            </template>
          </form-label>
          <form-label>
            Audience Warnings <required-star />
            <template #control>
              <div>
                TODO<br />

                <input type="checkbox" /> Warning 1<br />
                <input type="checkbox" /> Warning 2<br />
                <input type="checkbox" /> Warning 3<br />
              </div>
            </template>
          </form-label>
        </div>
      </card>
      <card title="Images">
        <div class="space-y-4">
          <div
            class="flex flex-wrap md:flex-nowrap md:space-x-4 justify-evenly"
          >
            <form-label>
              Feature Image <required-star />
              <template #helper>
                The main image used to promote your production across the site.
                It should have a ratio of roughly 16:9
              </template>
              <template #control>
                <image-input :value="production.featuredImage.url" />
              </template>
            </form-label>
            <form-label>
              Poster Image <required-star />
              <template #helper>
                A poster image for your production, portrait in standard "A"
                paper ratio (1√2).
              </template>
              <template #control>
                <image-input :value="production.posterImage.url" />
              </template>
            </form-label>
          </div>
          <form-label>
            Cover Image
            <template #helper>
              A cover image used on the homepage carousel. Should have a ratio
              of roughly 3:1, with at least 1200px width dimension
            </template>
            <template #control>
              <image-input :value="production.coverImage.url" />
            </template>
          </form-label>
        </div>
      </card>
      <card title="Performances"> </card>
    </div>
  </div>
</template>

<script>
import FormLabel from '@/components/ui/FormLabel.vue'
import FakeProduction from '@/tests/unit/fixtures/Production'
import Card from '@/components/ui/Card.vue'
import RequiredStar from '@/components/ui/Form/RequiredStar.vue'
import RichTextInput from '@/components/ui/Inputs/RichTextInput.vue'
import ImageInput from '@/components/ui/Inputs/ImageInput.vue'
export default {
  components: { FormLabel, Card, RequiredStar, RichTextInput, ImageInput },
  data() {
    return {
      production: FakeProduction({}, true),
    }
  },
}
</script>
