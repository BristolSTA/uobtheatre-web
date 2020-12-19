export default class {
  constructor(name, pageComponent, routeOptions = {}) {
    this.name = name;
    this.pageComponent = pageComponent;
    this.routeOptions = routeOptions;
  }

  generateRoute() {
    return Object.assign(
      {
        component: this.pageComponent,
        name:
          this.routeOptions.name ?? 'production.book.' + this.routeOptions.path,
        meta: {
          stage: this,
        },
      },
      this.routeOptions
    );
  }

  getRouteName() {
    return this.generateRoute().name;
  }
}
