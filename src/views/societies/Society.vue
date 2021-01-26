<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div
      v-if="!society"
      class="justify-center py-20 text-xl font-semibold text-center text-white"
    >
      Loading Society...
    </div>
    <template v-else>
      <div
        id="splashscreen"
        :style="{
          'background-image': banner,
        }"
      >
        <div class="flex items-center bg-black bg-opacity-40">
          <div class="container px-4 lg:w-2/3">
            <div class="text-4xl font-semibold">{{ society.name }}</div>
          </div>
        </div>
      </div>

      <div class="mt-4 md:my-8 md:container md:flex md:space-x-4">
        <div class="mx-4 md:mx-0 md:w-1/2">
          <div v-if="society.logo_image" class="flex justify-center p-2">
            <img
              :src="society.logo_image"
              :alt="`${society.name} logo`"
              class="w-32"
              ref="society_logo"
            />
          </div>
          <div class="m-2 text-center md:text-left">
            <p>{{ society.description }}</p>
            <br />
            <p><strong>Website: </strong>www.{{ society.slug }}.com</p>
            <p><strong>Contact: </strong>president@{{ society.slug }}.com</p>
          </div>
        </div>

        <div class="w-full px-1 py-2 md:p-2 md:w-1/2 bg-sta-gray-dark">
          <h2 class="flex justify-center mb-2 text-2xl">Productions</h2>
          <table class="w-full table-auto">
            <!-- wait for graphql integration -->
            <tr class="bg-sta-gray-light">
              <td class="px-4 py-2 text-xl font-semibold">Trash</td>
              <td class="px-4 text-right">
                <div
                  class="px-3 py-1.5 my-1 text-sm text-center font-semibold btn btn-orange"
                >
                  Book Now
                </div>
                <!-- router link here -->
              </td>
            </tr>
            <tr class="bg-sta-gray">
              <td class="px-4 py-2 text-xl font-semibold">Another show</td>
              <td class="px-4 text-right">November 2018</td>
            </tr>
            <tr class="bg-sta-gray-light">
              <td class="px-4 py-2 text-xl font-semibold">Another one</td>
              <td class="px-4 text-right">November 2017</td>
            </tr>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
#splashscreen {
  background-size: cover;
  background-position: center;
  > div {
    min-height: 240px;
  }
}
</style>

<script>
import { societyService } from '@/services';
import { handle404Mixin, runPromiseWithLoading } from '@/utils';

export default {
  name: 'scoiety-page',
  mixins: handle404Mixin,

  metaInfo() {
    const societyName = this.scoeity ? this.scoeity.name : 'Loading...';
    return {
      title: `${societyName}`,
    };
  },
  data() {
    return {
      society: null,
    };
  },
  created() {
    runPromiseWithLoading(
      societyService
        .fetchSocietyBySlug(this.$route.params.societySlug)
        .then((data) => (this.society = data))
        .catch(this.handle404)
    );
  },
  computed: {
    banner() {
      return this.society ? `url("${this.society.banner_image}")` : null;
    },
  },
};
</script>
