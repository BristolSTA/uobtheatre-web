import useNavStore, { Breadcrumb } from '@/store/nav';
import { Ref, ComputedRef, isRef } from 'vue';

export const defineBreadcrumbs = (
  breadcrumbGenerator:
    | ComputedRef<Breadcrumb[]>
    | Ref<Breadcrumb[]>
    | Breadcrumb[]
    | undefined
) => {
  const navStore = useNavStore();

  const breadcrumbs = isRef(breadcrumbGenerator)
    ? breadcrumbGenerator
    : ref(breadcrumbGenerator);

  watch(breadcrumbs, setBreadcrumbs);

  function setBreadcrumbs(breadcrumbsRef: Breadcrumb[] | undefined) {
    navStore.breadcrumbs = breadcrumbsRef;
  }

  setBreadcrumbs(breadcrumbs.value);

  return { breadcrumbs };
};
