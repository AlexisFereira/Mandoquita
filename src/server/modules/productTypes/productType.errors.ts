export class ProductTypeNotFoundError extends Error {
  constructor(public name: string) {
    super(`ProductType with name "${name}" was not found.`);
    this.name = "ProductTypeNotFoundError";
  }
}

export class ProductTypeAdminConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductTypeAdminConflictError";
  }
}

export class ProductTypeDependenciesError extends Error {
  constructor(public productCount: number) {
    super("ProductType has protected products");
    this.name = "ProductTypeDependenciesError";
  }
}

