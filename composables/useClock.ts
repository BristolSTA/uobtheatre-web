import { DateTime } from 'luxon';

export const useClock = (intervalSeconds = 1) => {
  const now = ref(DateTime.now());
  let timer: ReturnType<typeof setTimeout>;

  onMounted(() => {
    timer = setInterval(
      () => (now.value = DateTime.now()),
      intervalSeconds * 1000
    );
  });
  onUnmounted(() => clearInterval(timer));

  return now;
};
