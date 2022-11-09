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

export type OrderShortType = {
  pk: number;
  number: number;
  date_begin: string;
  status_name: string;
  car_name: string;
  car_state_number: string;
  post_name: string;
  reason_name: string;
  note: string;
};

export type OrderWorkMechanics = {
  pk: number | null;
  mechanic: number;
  mechanic_short_fio?: string;
  time_minutes: number | null;
};

export type OrderWorkType = {
  pk?: number | null;
  work: number | null;
  work_name: string;
  work_category: number;
  quantity: number;
  time_minutes: number | null;
  note: string;
  mechanics: OrderWorkMechanics[] | null;
};

export interface TurnoverNestedOrderType extends TurnoverNestedType {
  material: number;
  warehouse: number;
  max_quantity?: number;
}

export type OrderType = {
  pk?: number;
  created?: string;
  updated?: string;
  number?: number;
  status: number;
  reason: number;
  date_begin: string;
  date_end: string | null;
  post: number | null;
  car: number;
  car_name?: string;
  driver: number | null;
  responsible: number | null;
  odometer: number | null;
  note: string;
  order_works: OrderWorkType[] | null;
  turnovers_from_order: TurnoverNestedOrderType[] | TurnoverNestedWriteType[] | null;
};

export type ReasonType = {
  pk?: number;
  name: string;
  type: number;
  delete_forbidden?: boolean;
};

export type EmployeeType = {
  pk: number;
  number_in_kadry: number;
  short_fio: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  type: number;
  position: string;
  date_dismissal: string;
};

export type EmployeeShortType = Pick<EmployeeType, "pk" | "short_fio" | "type">;

export type EmployeeWriteType = Pick<EmployeeType, "type">;

export type CarType = {
  pk: number;
  kod_mar_in_putewka: number;
  gos_nom_in_putewka: string;
  state_number: string;
  name: string;
  kod_driver: number;
  driver_pk: number;
  date_decommissioned: string;
  has_tag_material?: boolean;
};

export type CarShortType = Pick<CarType, "pk" | "state_number" | "name">;

export type CarWriteType = Pick<CarType, "name">;

export type CarTagType = Pick<CarType, "name">;

export type PostType = {
  pk?: number;
  name: string;
  delete_forbidden?: boolean;
};

export type WorkType = {
  pk: number | null;
  category: number;
  name: string;
  delete_forbidden?: boolean;
};

export type WorkCategoryType = {
  pk: number | null;
  name: string;
  work_count?: number;
};

export type WarehouseType = {
  pk?: number;
  name: string;
  delete_forbidden?: boolean;
};

export type UnitType = {
  pk?: number;
  name: string;
  is_precision_point: boolean;
  delete_forbidden?: boolean;
};

export type MaterialType = {
  pk: number | null;
  name: string;
  unit: number;
  unit_name?: string;
  unit_is_precision_point?: boolean;
  category: number;
  article_number: string | null;
  compatbility: string[];
  delete_forbidden?: boolean;
};

export type MaterialCategoryType = {
  pk: number | null;
  name: string;
  material_count?: number;
};

export type TurnoverType = {
  pk: number | null | undefined;
  type: number;
  date: string | undefined;
  is_correction?: boolean;
  note?: string;
  user_name?: string;
  material: number | null;
  material_name?: string;
  material_unit_name?: string;
  material_unit_is_precision_point?: boolean;
  warehouse: number | null;
  warehouse_name?: string;
  price: number;
  quantity: number;
  sum: number;
  order?: number | null;
  entrance?: number | null;
};

export type TurnoverNestedType = {
  pk: number | null;
  date: string | undefined;
  material: number | null;
  material_name?: string;
  material_unit_name?: string;
  material_unit_is_precision_point?: boolean;
  warehouse: number | null;
  warehouse_name?: string;
  price: number;
  quantity: number;
  sum: number;
};

export interface TurnoverNestedWriteType
  extends Pick<TurnoverNestedType, "pk" | "date" | "material" | "warehouse" | "price" | "quantity" | "sum"> {
  material: number;
  warehouse: number;
}

export type TurnoverMaterialType = {
  pk: number;
  type: number;
  date: string;
  is_correction: boolean;
  user_name: string;
  turnover_name: number | null;
  warehouse_name: string;
  price: number;
  quantity: number;
  quantity_with_unit: string;
  sum: number;
  order: number | null;
  entrance: number | null;
};

export type TurnoverMovingMaterialType = {
  material: number;
  date: string;
  warehouse_outgoing: number;
  warehouse_incoming: number;
  quantity: number;
  price: number;
  sum: number;
};

export type EntranceType = {
  pk: number | null;
  date: string;
  document_number: string;
  responsible: number;
  provider: string;
  note: string;
  turnovers_from_entrance: TurnoverNestedType[];
};

export type EntranceListType = Pick<EntranceType, "pk" | "date" | "document_number" | "provider" | "note">;

export type WarehousesAvailability = {
  warehouse: number;
  warehouse_name: string;
  quantity: number;
  prices?: PricesType;
};

export type MaterialRemainsType = {
  pk: number;
  name: string;
  category: number;
  category_name: string;
  unit_name: string;
  unit_is_precision_point: boolean;
  warehouse?: number;
  warehouse_name?: string;
  warehouses_availability?: WarehousesAvailability[];
  compatbility: string[];
  quantity: number;
  price: number;
  sum: number;
};

export type MaterialRemainsWarehouseType = {
  pk: number;
  name: string;
  category: number;
  unit_name: string;
  unit_is_precision_point: boolean;
  warehouse: number;
  warehouse_name: string;
  compatbility: string[];
  quantity: number;
  price: number;
  sum?: number;
};

export type PricesType = {
  average_price: number;
  last_price: number;
};

export type MaterialAvailabilityType = {
  pk: number;
  name: string;
  unit_name: string;
  unit_is_precision_point: boolean;
  warehouses_availability: WarehousesAvailability[];
  prices: PricesType;
  quantity: number;
};
