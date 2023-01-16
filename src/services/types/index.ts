export * from "./coreTypes";
export * from "./orderTypes";
export * from "./warehouseTypes";
export * from "./reportTypes";
export * from "./carTaskTypes";

type NumbersType = {
  current: number;
  previous: number;
  next: number;
};

export type ResultResursePagation<T> = {
  page_size: number;
  count: number;
  numbers: NumbersType;
  results: T[];
};
