<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div
      v-if="banner"
      ref="banner"
      class="min-h-25vh 2xl:min-h-40vh bg-cover bg-center"
      :style="{
        'background-image': banner,
      }"
    />
    <div>
      <h1 class="container pt-8 text-left text-h1">
        {{ society.name }}
      </h1>
    </div>
    <div
      class="flex-wrap justify-around mt-4 md:container md:flex md:my-8 md:space-x-6"
    >
      <div
        v-if="society.logo.url"
        class="flex justify-center mx-4 py-2 h-40 md:mx-0 md:py-0 md:w-60 md:h-60"
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
          <table class="table-auto w-full">
            <tbody>
              <tr
                v-for="(production, index) in productions"
                :key="index"
                class="even:bg-sta-gray odd:bg-sta-gray-light"
              >
                <td class="pl-4 py-2 hover:text-gray-300 text-xl font-semibold">
                  <NuxtLink :to="`/production/${production.slug}`">
                    {{ production.name }}
                  </NuxtLink>
                </td>
                <td v-if="production.isBookable" class="px-4 text-right">
                  <NuxtLink
                    class="btn btn-orange my-1 px-3 py-1.5 text-center text-sm font-semibold"
                    :to="`/production/${production.slug}/book`"
                  >
                    Book Now
                  </NuxtLink>
                </td>
                <td v-else class="px-4 text-right">
                  {{ production.end | dateFormat("MMMM y") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="m-2 px-2 text-center md:text-left"
        :class="[productions.length ? 'pt-4' : 'md:w-2/3']"
      >
        <tip-tap-output :html="society.description" />
        <div v-if="society.website">
          <strong>Website: </strong>
          <a
            :href="society.website"
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
import SocietyDetailQuery from "@/graphql/queries/SocietyDetail.gql";
import TipTapOutput from "@/components/ui/TipTapOutput.vue";

export default {
  components: { TipTapOutput },
  async asyncData({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: SocietyDetailQuery,
      variables: {
        slug: params.slug,
      },
    });

    const society = data.society;
    if (!society) {
      return error({
        statusCode: 404,
        message: "This society does not exists",
      });
    }
    return {
      society,
    };
  },
  data() {
    return {
      society: null,
    };
  },
  head() {
    const societyName = this.society ? this.society.name : "Loading...";
    return {
      title: `${societyName}`,
    };
  },
  computed: {
    banner() {
      return this.society.banner.url
        ? `url("${this.society.banner.url}")`
        : null;
    },
    productions() {
      return this.society.productions.edges
        .map((edge) => edge.node)
        .filter((production) => production.end);
    },
  },
};
</script>
