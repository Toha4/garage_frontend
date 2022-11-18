import { OrderShortType, OrderWorkType } from "./orderTypes";
import { TurnoverType } from "./warehouseTypes";

export type EmployeeNoteType = {
  pk: number | null;
  employee: number;
  employee_short_fio?: string;
  date: string;
  note: string;
};

export interface ReportOrderShortType extends Pick<OrderShortType, "pk" | "number" | "date_begin"> {
  note: string;
}

export interface ReportOrderWorksShort extends Pick<OrderWorkType, "work_name" | "quantity" | "time_minutes"> {
  order_pk: number;
  order_number: number;
}

export interface ReportTurnoverShortType
  extends Pick<
    TurnoverType,
    "material_name" | "material_unit_name" | "material_unit_is_precision_point" | "quantity" | "sum"
  > {
  order_pk: number;
  order_number: number;
  warehouse_pk: number;
  material_name: string;
  material_unit_name: string;
  material_unit_is_precision_point: boolean;
}

export type ReportCarType = {
  pk: number;
  state_number: string;
  name: string;
  order_total: number;
  work_minutes_total: number;
  sum_total: number;
  orders: ReportOrderShortType[];
  works: ReportOrderWorksShort[];
  materials: ReportTurnoverShortType[];
};

export type ReportMechanicType = {
  pk: number;
  short_fio: string;
  work_minutes_total: number;
  repaired_cars_total: number;
  note_list: string[];
  works: ReportOrderWorksShort[];
};

export type ReportMaterialType = {
  pk: number;
  warehouse: number;
  warehouse_name: string;
  name: string;
  material_unit_name: string;
  material_unit_is_precision_point: boolean;
  used_quantity: number;
  used_sum: number;
  remains_quantity: number;
  turnovers: ReportTurnoverShortType[];
};

export type StatisticParamsType = {
  name_param: string;
  total: number | string;
  maintenance: number | string;
  other: number | string;
  repair: number | string;
};

export type ReportCarOrders = {
  pk: number;
  number: number;
  reason_name: string;
  date_begin: string;
  work_list: string[];
  work_minutes_total: number;
  material_list: string[];
  sum_total: number;
  note: number; 
};
