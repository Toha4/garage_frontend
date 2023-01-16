import { TurnoverNestedType, TurnoverNestedWriteType } from "../types";

export type OrderShortType = {
  pk: number;
  number: number;
  date_begin: string;
  status: number;
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
  car: number | null;
  car_name?: string;
  car_task_count?: number;
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
