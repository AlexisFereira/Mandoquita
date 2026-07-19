export class SubcategoryNotFoundError extends Error {
  constructor(public id: string) {
    super(`Subcategory with id "${id}" was not found.`);
    this.name = "SubcategoryNotFoundError";
  }
}

export class SubcategoryAdminConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubcategoryAdminConflictError";
  }
}

export class SubcategoryDependenciesError extends Error {
  constructor(
    public dependencies: {
      productTypes: number;
      products: number;
    },
  ) {
    super("Subcategory has protected dependencies");
    this.name = "SubcategoryDependenciesError";
  }
}
