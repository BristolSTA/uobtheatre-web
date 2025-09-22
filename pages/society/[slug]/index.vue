<template>
  <LayoutInfoPage :title="society?.name" :banner="banner">
    <template #sidebar>
      <div class="p-4">
        <div
          v-if="society.logo.url"
          class="flex justify-center h-40 w-40 md:w-60 md:h-60"
        >
          <img
            ref="society-logo"
            :src="society.logo.url"
            :alt="`${society.name} logo`"
          />
        </div>
      </div>
      <div
        v-if="society.website || society.contact"
        class="flex justify-center w-full lg:w-3/4 px-4 pb-4"
      >
        <div>
          <h2 class="text-sta-orange text-3xl font-semibold text-center">
            Society Information
          </h2>
          <table class="table-auto mt-2">
            <tbody>
              <tr v-if="society.website">
                <th class="align-top pr-2">Website:</th>
                <td class="align-top">
                  <a
                    :href="society.website"
                    target="_blank"
                    title="Opens in a new tab"
                    class="text-sta-orange hover:text-sta-orange-dark"
                  >
                    {{ society.website }}
                  </a>
                </td>
              </tr>
              <tr v-if="society.contact">
                <th class="align-top pr-2">Contact:</th>
                <td class="align-top">
                  <a
                    :href="`mailto:${society.contact}`"
                    target="_blank"
                    title="Opens in a new tab"
                    class="text-sta-orange hover:text-sta-orange-dark"
                  >
                    {{ society.contact }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template #default>
      <div v-if="bannerProductions.length">
        <!-- Upcoming Shows Carousel -->
        <h1 class="text-3xl font-semibold text-center mb-2">
          Upcoming Productions
        </h1>
        <UiCarousel :carousel-items="bannerProductions">
          <template #default="slotProps">
            <div class="flex items-center h-full bg-black bg-opacity-40">
              <NuxtLink
                class="container px-4 md:pl-12 lg:pl-4 lg:w-2/3"
                :to="`/production/${slotProps.carouselItem.text.slug}`"
              >
                <div class="text-2xl">
                  {{ slotProps.carouselItem.text.society.name }}
                </div>
                <div class="text-h1">
                  {{ slotProps.carouselItem.text.name }}
                </div>
                <div class="text-2xl">
                  {{
                    displayStartEnd(
                      slotProps.carouselItem.text.start,
                      slotProps.carouselItem.text.end,
                      'd MMMM'
                    )
                  }}
                </div>
              </NuxtLink>
            </div>
          </template>
        </UiCarousel>
      </div>
      <div v-if="society.description" class="mt-4">
        <!-- Description -->
        <h1 class="text-3xl font-semibold text-center mb-2">Description</h1>
        <tip-tap-output :html="society.description" />
      </div>
      <div v-if="pastProductions.length" class="mx-4 mt-4">
        <!-- Past Shows -->
        <div ref="production-list" class="flex-none container">
          <div class="w-full bg-sta-gray-dark">
            <h2 class="flex justify-center mb-2 text-2xl">Past Productions</h2>
            <table class="table-auto w-full">
              <tbody>
                <tr
                  v-for="(production, index) in pastProductions"
                  :key="index"
                  class="even:bg-sta-gray odd:bg-sta-gray-light"
                >
                  <td
                    class="pl-4 py-2 hover:text-gray-300 text-xl font-semibold"
                  >
                    <NuxtLink :to="`/production/${production.slug}`">
                      {{ production.name }}
                    </NuxtLink>
                  </td>
                  <td class="px-4 text-right">
                    {{ dateFormat(production.end, 'MMMM y') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </LayoutInfoPage>
</template>

<script>
import SocietyDetailQuery from '@/graphql/queries/SocietyDetail.gql';
import TipTapOutput from '~~/components/ui/UiTipTapOutput.vue';
import { dateFormat } from '@/utils/datetime';
import LayoutInfoPage from '@/components/layout/LayoutInfoPage.vue';

export default defineNuxtComponent({
  components: { TipTapOutput, LayoutInfoPage },
  async asyncData() {
    const { data } = await useAsyncQuery({
      query: SocietyDetailQuery,
      variables: {
        slug: useRoute().params.slug
      }
    });

    const society = data.value.society;
    if (!society) {
      throw createSafeError({
        statusCode: 404,
        message: 'This society does not exist'
      });
    }

    const upcomingProductions = society.productions
      ? society.productions.edges.map((edge) => edge.node)
      : [];

    const bannerProductions = upcomingProductions
      .filter((production) => production?.coverImage)
      .map((production) => {
        return {
          id: production.id,
          displayImage: production.coverImage,
          text: {
            slug: production.slug,
            name: production.name,
            start: production.start,
            end: production.end,
            society: production.society
          }
        };
      })
      .slice(0, 4);

    return {
      society,
      bannerProductions
    };
  },
  data() {
    return {
      society: null
    };
  },
  computed: {
    banner() {
      return this.society?.banner?.url
        ? `url("${this.society.banner.url}")`
        : null;
    },
    productions() {
      return this.society.productions.edges
        .map((edge) => edge.node)
        .filter((production) => production.end);
    },
    pastProductions() {
      return this.productions.filter(
        (production) => new Date(production.end) < new Date()
      );
    }
  },
  methods: {
    dateFormat
  }
});
</script>
