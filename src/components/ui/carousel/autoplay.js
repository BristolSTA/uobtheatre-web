const mixin = {
  methods: {
    clearAutoPlayPause() {
      clearTimeout(this.autoplayTimeout);
      this.autoplayRemaining = null;
    },

    disableAutoPlay() {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    },

    restartAutoPlay() {
      this.disableAutoPlay();
      this.toggleAutoPlay();
    },

    toggleAutoPlay() {
      let enabled = this.carouselLength > 1 && this.autoplay;

      if (!this.autoplayInterval && enabled) {
        this.autoplayInterval = setInterval(() => {
          this.goToNext();
        }, this.autoplaySpeed);
      } else {
        this.disableAutoPlay();
      }
    },

    handleMouseUp() {
      this.isMouseDown = false;
      this.enableScroll();
    },

    handleMouseOver(element) {
      if (this.autoplay) {
        if (element === 'carousel' && this.pauseOnHover) {
          this.isAutoplayPaused = true;
        }
      }
    },

    handleMouseOut(element) {
      if (this.autoplay) {
        if (element === 'carousel' && this.pauseOnHover) {
          this.isAutoplayPaused = false;
        }
      }
    },
    handleFocus() {
      return null;
    },
  },
  watch: {
    // Watch current slide change
    currentProduction() {
      this.autoplayStartTimestamp = this.autoplay ? +new Date() : null;
    },

    isAutoplayPaused(nevValue) {
      if (nevValue) {
        // Store current slide remaining time and disable auto play mode
        this.remaining =
          this.autoplaySpeed - (+new Date() - this.autoplayStartTimestamp);
        this.disableAutoPlay();
        this.clearAutoPlayPause();
      } else {
        // Go to next after remaining time and rerun auto play mode
        this.autoplayTimeout = setTimeout(() => {
          this.clearAutoPlayPause();
          this.goToNext();
          this.toggleAutoPlay();
        }, this.remaining);
      }
    },

    autoplay() {
      this.toggleAutoPlay();
    },
  },
};

export default mixin;
