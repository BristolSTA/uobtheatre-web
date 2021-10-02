<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div
      v-if="banner"
      ref="banner"
      class="bg-center bg-cover min-h-25vh 2xl:min-h-40vh"
      :style="{
        'background-image': banner,
      }"
    ></div>
    <div>
      <h1 class="container pt-8 text-left text-h1">
        {{ society.name }}
      </h1>
    </div>
    <div
      class="flex-wrap justify-around mt-4  md:my-8 md:container md:flex md:space-x-6"
    >
      <div
        v-if="society.logo.url"
        class="flex justify-center h-40 py-2 mx-4  md:py-0 md:h-60 md:w-60 md:mx-0"
      >
        <img
          ref="society-logo"
          :src="society.logo.url"
          :alt="`${society.name} logo`"
        />
      </div>

      <div
        v-if="productions.length"
        ref="production-list"
        class="flex-none px-1 md:w-1/2"
      >
        <div class="p-2 bg-sta-gray-dark">
          <h2 class="flex justify-center mb-2 text-2xl">Productions</h2>
          <table class="w-full table-auto">
            <tbody>
              <tr
                v-for="(production, index) in productions"
                :key="index"
                class="odd:bg-sta-gray-light even:bg-sta-gray"
              >
                <td class="py-2 pl-4 text-xl font-semibold hover:text-gray-300">
                  <NuxtLink :to="`/production/${production.slug}`">
                    {{ production.name }}
                  </NuxtLink>
                </td>
                <td v-if="production.isBookable" class="px-4 text-right">
                  <NuxtLink
                    class="
                      px-3
                      py-1.5
                      my-1
                      text-sm text-center
                      font-semibold
                      btn btn-orange
                    "
                    :to="`/production/${production.slug}/book`"
                  >
                    Book Now
                  </NuxtLink>
                </td>
                <td v-else class="px-4 text-right">
                  {{ production.end | dateFormat('MMMM y') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="px-2 m-2 text-center md:text-left"
        :class="[productions.length ? 'pt-4' : 'md:w-2/3']"
      >
        <tip-tap-output :html="society.description" />
        <div v-if="society.website">
          <strong>Website: </strong>
          <a
            :href="encodeURIComponent(society.website)"
            target="_blank"
            title="Opens in a new tab"
            class="text-sta-orange hover:text-sta-orange-dark"
          >
            {{ society.website }}
          </a>
        </div>
        <div v-if="society.website">
          <strong>Contact: </strong>
          <a
            :href="`mailto:${society.contact}`"
            target="_blank"
            title="Opens in a new tab"
            class="text-sta-orange hover:text-sta-orange-dark"
          >
            {{ society.contact }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocietyDetailQuery from '@/graphql/queries/SocietyDetail.gql'
import TipTapOutput from '@/components/ui/TipTapOutput.vue'

export default {
  components: { TipTapOutput },
  async asyncData({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: SocietyDetailQuery,
      variables: {
        slug: params.slug,
      },
    })

    const society = data.society
    if (!society)
      return error({
        statusCode: 404,
        message: 'This society does not exists',
      })
    return {
      society,
    }
  },
  data() {
    return {
      society: null,
    }
  },
  head() {
    const societyName = this.society ? this.society.name : 'Loading...'
    return {
      title: `${societyName}`,
    }
  },
  computed: {
    banner() {
      return this.society.banner.url
        ? `url("${this.society.banner.url}")`
        : null
    },
    productions() {
      return this.society.productions.edges
        .map((edge) => edge.node)
        .filter((production) => production.end)
    },
  },
}
</script>
