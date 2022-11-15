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
