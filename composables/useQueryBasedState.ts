const changingRouterPromise = ref<Promise<void> | undefined>();

export default function <T>(
  queryParameterKey: string,
  identifierCallback: (arg0: T) => string,
  loaderCallback: (identifier: string) => Promise<T | undefined>
) {
  const router = useRouter();
  const route = useRoute();

  const value = ref<T | undefined>();
  const loading = ref(false);

  const initialValue = route.query[queryParameterKey];

  if (initialValue && !Array.isArray(initialValue)) {
    loading.value = true;
    loaderCallback(initialValue).then((result) => {
      value.value = result;
      loading.value = false;
    });
  }

  watch(value, (newValue) => {
    if (changingRouterPromise.value)
      return changingRouterPromise.value.then(() => updateRouter(newValue));

    updateRouter(newValue);
  });

  function updateRouter(object: T | undefined) {
    changingRouterPromise.value = new Promise(async (resolve) => {
      const { [queryParameterKey]: val, ...queryWithoutParameter } =
        route.query;

      if (object)
        await router.replace({
          query: {
            ...queryWithoutParameter,
            [queryParameterKey]: identifierCallback(object)
          }
        });
      else await router.replace({ query: queryWithoutParameter });

      changingRouterPromise.value = undefined;
      resolve();
    });
  }

  return { value, loading };
}
