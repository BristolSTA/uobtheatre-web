import type { Ref } from 'vue';
const changingRouterPromise = ref<Promise<void> | undefined>();

export default function (parameterKey: string): Ref<string | undefined> {
  const router = useRouter();
  const route = useRoute();

  const initialValue = route.query[parameterKey];

  const value = ref<string | undefined>(
    !initialValue || Array.isArray(initialValue) ? undefined : initialValue
  );

  watch(value, (newValue) => {
    if (changingRouterPromise.value)
      return changingRouterPromise.value.then(() => updateRouter(newValue));

    updateRouter(newValue);
  });

  function updateRouter(value: string | undefined) {
    changingRouterPromise.value = new Promise(async (resolve) => {
      const { [parameterKey]: val, ...queryWithoutParameter } = route.query;

      if (value)
        await router.replace({
          query: {
            ...queryWithoutParameter,
            [parameterKey]: value
          }
        });
      else await router.replace({ query: queryWithoutParameter });

      changingRouterPromise.value = undefined;
      resolve();
    });
  }
  return value;
}
