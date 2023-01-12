import { defineStore } from 'pinia';

export interface Breadcrumb {
  text: string;
  path?: string;
}

export default defineStore('nav', {
  state: () => ({
    breadcrumbs: undefined as Breadcrumb[] | undefined
  })
});
