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
          <div v-if="society.logo.url" class="flex justify-center p-2">
            <img
              :src="society.logo.url"
              :alt="`${society.name} logo`"
              class="w-32"
              ref="society-logo"
            />
          </div>
          <div class="m-2 text-center md:text-left">
            <p>{{ society.description }}</p>
            <!-- <br />
            <p><strong>Website: </strong>www.{{ society.slug }}.com</p>
            <p><strong>Contact: </strong>president@{{ society.slug }}.com</p> -->
          </div>
        </div>

        <div
          ref="production-list"
          class="w-full px-1 py-2 md:p-2 md:w-1/2 bg-sta-gray-dark"
        >
          <h2 class="flex justify-center mb-2 text-2xl">Productions</h2>
          <table class="w-full table-auto">
            <tbody>
              <tr
                class="odd:bg-sta-gray-light even:bg-sta-gray"
                v-for="(production, index) in productions"
                :key="index"
              >
                <td class="px-4 py-2 text-xl font-semibold hover:text-gray-300">
                  <router-link
                    :to="{
                      name: 'production',
                      params: { productionSlug: production.slug },
                    }"
                  >
                    {{ production.name }}
                  </router-link>
                </td>
                <td class="px-4 text-right" v-if="production.isBookable">
                  <router-link
                    class="px-3 py-1.5 my-1 text-sm text-center font-semibold btn btn-orange"
                    :to="{
                      name: 'production.book',
                      params: { productionSlug: production.slug },
                    }"
                  >
                    Book Now
                  </router-link>
                </td>
                <td class="px-4 text-right" v-else>
                  {{ production.end | dateFormat('MMMM y') }}
                </td>
              </tr>
            </tbody>
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
import gql from 'graphql-tag';

import { createClient } from '@/vue-apollo';

export default {
  name: 'society',
  metaInfo() {
    const societyName = this.society ? this.society.name : 'Loading...';
    return {
      title: `${societyName}`,
    };
  },
  data() {
    return {
      society: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    const { apolloClient } = createClient();
    apolloClient
      .query({
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
          slug: to.params.societySlug,
        },
      })
      .then((result) => {
        let society = result.data.society;
        if (!society) return next({ name: '404' });
        return next((vm) => {
          vm.society = society;
        });
      });
  },
  computed: {
    banner() {
      return this.society ? `url("${this.society.banner.url}")` : null;
    },
    productions() {
      return this.society.productions.edges.map((edge) => edge.node);
    },
  },
};
</script>
