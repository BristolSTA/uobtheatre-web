export default function useRealScreenHeight() {
  onMounted(() => {
    computeWindowHeight();
    document.addEventListener('resize', computeWindowHeight);
  });

  onUnmounted(() =>
    document.removeEventListener('resize', computeWindowHeight)
  );

  const windowHeight = ref(0);

  function computeWindowHeight() {
    windowHeight.value = window.innerHeight;
  }

  return windowHeight;
}
