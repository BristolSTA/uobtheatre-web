<template>
  <div
    id="carousel"
    class="relative text-white"
    @mouseover="handleMouseOver('carousel')"
    @mouseout="handleMouseOut('carousel')"
    @focusin="() => null"
    @focusout="() => null"
  >
    <transition-group
      tag="div"
      class="relative w-full overflow-hidden"
      :style="{ height: vheight + 'vh' }"
      name="slide"
    >
      <div
        v-for="index in [currentProduction]"
        v-bind:key="index"
        class="absolute top-0 bottom-0 left-0 right-0"
        ref="carousel"
      >
        <div
          :style="{
            'background-image': bannerBackgorund(bannerProductions[index]),
          }"
        >
          <div
            class="flex items-center bg-black bg-opacity-40"
            :style="{ height: vheight + 'vh' }"
          >
            <router-link
              class="container px-4 md:pl-12 lg:pl-4 lg:w-2/3"
              :to="{
                name: 'production',
                params: { productionSlug: bannerProductions[index].slug },
              }"
            >
              <div class="text-2xl">
                {{ bannerProductions[index].society.name }}
              </div>
              <div class="text-h1">{{ bannerProductions[index].name }}</div>
              <div class="text-2xl">
                {{ bannerProductions[index].start | dateFormat('d MMMM') }} -
                {{ bannerProductions[index].end | dateFormat('d MMMM y') }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </transition-group>
    <template v-if="this.carouselLength > 1">
      <div class="absolute flex justify-center w-full bottom-2">
        <ul class="flex items-center p-0 space-x-3 whitespace-nowrap">
          <li v-for="n in carouselLength" :key="n">
            <button
              class="carouel-indicator cursor-pointer transition-colors duration-500 w-2.5 h-2.5 rounded-full focus:outline-none border-white border hover:bg-white"
              :class="[
                n - 1 == currentProduction ? 'bg-white' : 'bg-transparent',
              ]"
              @click="goTo(n - 1), enableAutoPlay()"
              @keypress="goTo(n - 1)"
            ></button>
          </li>
        </ul>
      </div>
      <div
        class="absolute top-0 left-0 invisible w-32 h-full md:w-24 lg:w-32 md:visible"
      >
        <button
          id="prevBtn"
          class="w-full h-full text-4xl transition-colors duration-300 cursor-pointer focus:outline-none hover:bg-opacity-30 hover:bg-black"
          @click="goToPrev()"
          @keypress="goToPrev()"
        >
          <font-awesome-icon icon="chevron-left" />
        </button>
      </div>
      <div
        class="absolute top-0 right-0 invisible w-32 h-full md:w-24 lg:w-32 md:visible"
      >
        <button
          id="nextBtn"
          class="w-full h-full text-4xl transition-colors duration-300 cursor-pointer focus:outline-none hover:bg-opacity-30 hover:bg-black"
          @click="goToNext()"
          @keypress="goToNext()"
        >
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { displayStartEnd } from '@/utils';

export default {
  name: 'production-carousel',
  props: {
    bannerProductions: {
      required: true,
    },
    vheight: {
      default: 50,
    },
    autoplay: {
      default: true,
    },
    autoplaySpeed: {
      default: 5000,
    },
    pauseOnHover: {
      default: true,
    },
  },
  data() {
    return {
      currentProduction: 0,
      displayStartEnd: displayStartEnd,
      autoplayInterval: null,
    };
  },
  mounted() {
    this.enableAutoPlay();
  },
  beforeDestroy() {
    this.disableAutoPlay();
  },
  computed: {
    carouselLength() {
      return this.bannerProductions.length;
    },
  },
  methods: {
    bannerBackgorund(bannerProduction) {
      return `url("${bannerProduction.coverImage.url}")`;
    },
    goTo(currentProduction) {
      this.currentProduction = currentProduction;
    },
    goToPrev() {
      if (this.currentProduction == 0) {
        this.goTo(this.carouselLength - 1);
      } else this.goTo(this.currentProduction - 1);
    },
    goToNext() {
      if (this.currentProduction == this.carouselLength - 1) {
        this.goTo(0);
      } else this.goTo(this.currentProduction + 1);
    },
    disableAutoPlay() {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    },
    enableAutoPlay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
      if (this.carouselLength > 1 && this.autoplay) {
        this.autoplayInterval = setInterval(() => {
          this.goToNext();
        }, this.autoplaySpeed);
      }
    },
    handleMouseOver(element) {
      if (this.autoplay) {
        if (element === 'carousel' && this.pauseOnHover) {
          this.disableAutoPlay();
        }
      }
    },
    handleMouseOut(element) {
      if (this.autoplay) {
        if (element === 'carousel' && this.pauseOnHover) {
          this.enableAutoPlay();
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.slide-enter-active {
  transition: opacity 0.8s cubic-bezier(0.5, 0, 0.5, 1);
}

.slide-leave-active {
  transition: opacity 0.8s cubic-bezier(0.5, 0, 0.5, 1) 0.9s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}
</style>
