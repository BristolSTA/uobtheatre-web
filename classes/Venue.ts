// Venue:
// id (String),
// name (String),
// slug (String)

export default class ProductionPerformances {
  id?: string;
  name?: string;
  slug?: string;

  constructor(id?: string, name?: string, slug?: string) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }
}
