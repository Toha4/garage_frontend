import { FilterValue, SortOrder, TablePaginationConfig } from "antd/lib/table/interface";
import { type } from "os";
import { OrderWorkType } from "../services/types";

export interface ITableParams {
  pagination?: TablePaginationConfig;
  sortField?: React.Key;
  sortOrder?: SortOrder;
  filters?: Record<string, FilterValue | null>;
  search: { [key: string]: string | number | number[] | undefined };
}

export interface IFormOrderInputs {
  status: number;
  date_begin: any;
  date_end: any;
  responsible: number | null;
  driver: number | null;
  reason: number;
  post: number | null;
  car: number;
  car_name: string;
  odometer: number | null;
  note: string;
  works: OrderWorkType[] | null;
}

export interface IFormWorkInputs {
  category: number;
  name: string;
}

export interface IFormWorkCategoryInputs {
  name: string;
}

export interface IFormReasonInputs {
  type: number;
  name: string;
}

export interface IFormPostInputs {
  name: string;
}