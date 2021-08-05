<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div
      v-if="banner"
      id="splashscreen"
      :style="{
        'background-image': banner,
      }"
    >
      <div class="flex items-center bg-black bg-opacity-40">
        <h1 class="container px-4 text-h1 lg:w-2/3">
          {{ society.name }}
        </h1>
      </div>
    </div>
    <h1 v-else class="container py-8 text-left text-h1">
      {{ society.name }}
    </h1>

    <div class="mt-4 md:my-8 md:container md:flex md:space-x-6">
      <div class="mx-4 md:mx-0 md:w-1/2">
        <div v-if="society.logo.url" class="flex justify-center py-2">
          <img
            ref="society-logo"
            :src="society.logo.url"
            :alt="`${society.name} logo`"
            class="w-32"
          />
        </div>
        <div class="w-full m-2 text-center md:text-left">
          <p>{{ society.description }}</p>
          <!-- <br /> TODO: Implement society contacts
            <p><strong>Website: </strong>www.{{ society.slug }}.com</p>
            <p><strong>Contact: </strong>president@{{ society.slug }}.com</p> -->
        </div>
      </div>

      <div
        v-if="productions.length"
        ref="production-list"
        class="w-full px-1 py-2 md:p-2 md:w-1/2 bg-sta-gray-dark"
      >
        <h2 class="flex justify-center mb-2 text-2xl">Productions</h2>
        <table class="w-full table-auto">
          <tbody>
            <tr
              v-for="(production, index) in productions"
              :key="index"
              class="odd:bg-sta-gray-light even:bg-sta-gray"
            >
              <td class="px-4 py-2 text-xl font-semibold hover:text-gray-300">
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
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  async asyncData({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query society($slug: String!) {
          society(slug: $slug) {
            name
            description
            slug
            logo {
              url
            }
            banner {
              url
            }
            productions {
              edges {
                node {
                  name
                  end
                  isBookable
                  slug
                }
              }
            }
          }
        }
      `,
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
      return this.society.productions.edges.map((edge) => edge.node)
    },
  },
}
</script>

<style scoped lang="scss">
#splashscreen {
  background-size: cover;
  background-position: center;
  > div {
    min-height: 30vh;
  }
}
</style>
