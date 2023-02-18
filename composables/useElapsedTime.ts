import { DateTime, Duration } from 'luxon';

export const useElapsedTime = (intervalSeconds = 1) => {
  const startTime = DateTime.now();
  const duration = ref(Duration.fromDurationLike({ milliseconds: 0 }));

  let timer: ReturnType<typeof setTimeout>;

  onMounted(() => {
    timer = setInterval(
      () => (duration.value = DateTime.now().diff(startTime)),
      intervalSeconds * 1000
    );
  });
  onUnmounted(() => clearInterval(timer));

  return readonly(duration);
};
