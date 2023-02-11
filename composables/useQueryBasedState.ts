import type { Ref } from 'vue';
const changingRouterPromise = ref<Promise<void> | undefined>();

/**
 * Creates a Vue ref that is inherently tied with a URL Query Parameter
 *
 * @param queryParameterKey The paramater key
 * @param identifierCallback Callback that returns a string identifier for the given instance/value
 * @param loaderCallback  Callback that loads the state given a string identified
 */

export default function <T>(
  parameterKey: string | Ref<string | undefined>,
  identifierCallback: (arg0: T) => string,
  loaderCallback: (identifier: string) => Promise<T | undefined>
) {
  const queryParameter = isRef(parameterKey)
    ? parameterKey
    : useQueryParam(parameterKey);

  const value = ref<T | undefined>();
  const loading = ref(false);

  if (queryParameter.value) {
    loading.value = true;
    loaderCallback(queryParameter.value).then((result) => {
      value.value = result;
      loading.value = false;
    });
  }

  watch(value, (newValue) => {
    queryParameter.value = newValue ? identifierCallback(newValue) : undefined;
  });

  return { value, loading: loading };
}
