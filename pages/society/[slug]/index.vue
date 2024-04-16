<template>
  <div class="h-full text-white bg-sta-gray">
    <Head>
      <Title>{{ society?.name ?? 'Loading...' }}</Title>
    </Head>
    <div
      v-if="banner"
      ref="banner"
      class="min-h-25vh 2xl:min-h-40vh bg-cover bg-center"
      :style="{
        'background-image': banner
      }"
    />
    <div
      class="container grid gap-4 p-4 grid-cols-1 lg:grid-cols-5"
      style="grid-template-rows: auto auto auto"
    >
      <div class="lg:col-start-1 lg:col-span-5 lg:row-start-1">
        <!-- Title -->
        <h1 class="container align-middle py-6 text-left text-h1">
          {{ society.name }}
        </h1>
      </div>
      <div class="lg:col-start-1 lg:col-span-3 lg:row-start-2">
        <div
          v-if="!bannerProductions.length"
          class="flex items-center bg-black bg-opacity-40"
          style="min-height: 20vh"
        >
          <div class="container px-4 text-white text-center text-2xl lg:w-2/3">
            No Upcoming Productions
          </div>
        </div>
        <UiCarousel
          v-else:
          :carousel-items="bannerProductions"
          :always-display-arrows="true"
        >
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
      <div
        class="lg:col-start-4 lg:col-span-2 lg:row-start-2 lg:row-span-2 lg:sticky lg:top-4"
      >
        <!-- Banner Information Section -->
        <div class="flex flex-col flex-wrap items-center justify-center">
          <div
            v-if="society.logo.url"
            class="flex justify-center h-40 w-40 pb-4 md:w-60 md:h-60"
          >
            <img
              ref="society-logo"
              :src="society.logo.url"
              :alt="`${society.name} logo`"
            />
          </div>
          <div class="flex justify-center w-full p-4 bg-sta-gray-light">
            <div>
              <h2 class="text-sta-orange text-3xl font-semibold">
                Society Info:
              </h2>
              <table class="table-auto">
                <tbody>
                  <tr>
                    <th class="align-top pb-2 pr-2">Website:</th>
                    <td v-if="society.website" class="align-top">
                      <a
                        :href="society.website"
                        target="_blank"
                        title="Opens in a new tab"
                        class="text-sta-orange hover:text-sta-orange-dark"
                      >
                        {{ society.website }}
                      </a>
                    </td>
                    <td v-else class="align-top">No Website Listed</td>
                  </tr>
                  <tr>
                    <th class="align-top pr-2">Contact:</th>
                    <td v-if="society.contact" class="align-top">
                      <a
                        :href="`mailto:${society.contact}`"
                        target="_blank"
                        title="Opens in a new tab"
                        class="text-sta-orange hover:text-sta-orange-dark"
                      >
                        {{ society.contact }}
                      </a>
                    </td>
                    <td v-else class="align-top">No Email Listed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:col-start-1 lg:col-span-3 lg:row-start-3">
        <!-- Description -->
        <UiTipTapOutput
          class="p-4 w-full text-justify lg:block"
          :html="society.description"
        />
      </div>
      <div
        v-if="pastProductions.length"
        class="lg:col-start-1 lg:col-span-3 lg:row-start-4"
      >
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
    </div>
  </div>
</template>

<script>
import SocietyDetailQuery from '@/graphql/queries/SocietyDetail.gql';
import TipTapOutput from '~~/components/ui/UiTipTapOutput.vue';
import { dateFormat } from '@/utils/datetime';

export default defineNuxtComponent({
  components: { TipTapOutput },
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
