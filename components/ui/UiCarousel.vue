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
        v-for="index in [currentItem]"
        :key="index"
        ref="carousel"
        class="absolute top-0 bottom-0 left-0 right-0 bg-center"
        :class="[vheight == 100 ? 'bg-no-repeat bg-contain' : 'bg-cover']"
        :style="{
          'background-image': bannerBackgorund(carouselItems[index])
        }"
      >
        <slot :carousel-item="carouselItems[index]" />
      </div>
    </transition-group>
    <template v-if="carouselLength > 1">
      <div class="absolute flex justify-center w-full bottom-2">
        <ul class="flex items-center p-0 space-x-3 whitespace-nowrap">
          <li v-for="n in carouselLength" :key="n">
            <button
              class="carousel-indicator w-2.5 h-2.5 hover:bg-white border border-white rounded-full focus:outline-none cursor-pointer transition-colors duration-500"
              :class="[n - 1 == currentItem ? 'bg-white' : 'bg-transparent']"
              @click="goTo(n - 1), enableAutoPlay()"
              @keypress="goTo(n - 1)"
            />
          </li>
        </ul>
      </div>
      <div
        v-if="navArrows"
        class="absolute top-0 left-0 invisible w-32 h-full md:w-24 md:visible lg:w-32"
      >
        <button
          id="prevBtn"
          class="w-full h-full text-4xl transition-colors duration-300 cursor-pointer hover:bg-black hover:bg-opacity-30 focus:outline-none"
          @click="goToPrev()"
          @keypress="goToPrev()"
        >
          <font-awesome-icon icon="chevron-left" />
        </button>
      </div>
      <div
        v-if="navArrows"
        class="absolute top-0 right-0 invisible w-32 h-full md:w-24 md:visible lg:w-32"
      >
        <button
          id="nextBtn"
          class="w-full h-full text-4xl transition-colors duration-300 cursor-pointer hover:bg-black hover:bg-opacity-30 focus:outline-none"
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
export default {
  props: {
    carouselItems: {
      required: true,
      type: Array
    },
    navArrows: {
      default: true,
      type: Boolean
    },
    vheight: {
      default: 50,
      type: Number
    },
    autoplay: {
      default: true,
      type: Boolean
    },
    autoplaySpeed: {
      default: 5000,
      type: Number
    },
    pauseOnHover: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      currentItem: 0,
      autoplayInterval: null
    };
  },
  computed: {
    carouselLength() {
      return this.carouselItems.length;
    }
  },
  mounted() {
    this.enableAutoPlay();
  },
  beforeDestroy() {
    this.disableAutoPlay();
  },
  methods: {
    bannerBackgorund(carouselItem) {
      return `url("${carouselItem.displayImage.url}")`;
    },
    goTo(currentItem) {
      this.currentItem = currentItem;
    },
    goToPrev() {
      if (this.currentItem === 0) {
        this.goTo(this.carouselLength - 1);
      } else {
        this.goTo(this.currentItem - 1);
      }
    },
    goToNext() {
      if (this.currentItem === this.carouselLength - 1) {
        this.goTo(0);
      } else {
        this.goTo(this.currentItem + 1);
      }
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
    }
  }
};
</script>

<style scoped lang="postcss">
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
