import { FilterValue, SortOrder, TablePaginationConfig } from "antd/lib/table/interface";
import { TurnoverNestedOrderType, OrderWorkType, TurnoverNestedType } from "../services/types";

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
  materials: TurnoverNestedOrderType[] | null;
}

export interface IFormCarInputs {
  name: string;
  state_number: string;
  date_decommissioned: any;
}

export interface IFormEmployeeInputs {
  first_name: string;
  last_name: string;
  patronymic: string;
  position: string;
  type: number;
  date_dismissal: any;
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

export interface IFormMaterialInputs {
  unit: number;
  category: number;
  name: string;
  article_number: string | null;
  compatbility: string[];
}

export interface IFormMaterialCategoryInputs {
  name: string;
}

export interface IFormWarehouseInputs {
  name: string;
}

export interface IFormEntranceInputs {
  date: any;
  document_number: string;
  responsible: number;
  provider: string;
  note: string;
  materials: TurnoverNestedType[];
}

export interface IFormCorrectionTurnoverInputs {
  type: number;
  warehouse: number;
  quantity: number;
  price: number;
  sum: number | string;
  note: string;
}

export interface IFormMovingTurnoverInputs {
  warehouse_outgoing: number;
  warehouse_incoming: number;
  quantity: number;
  price: number | string;
  sum: number | string;
}

export interface IEmployeeNoteInputs {
  date: any;
  employee: number;
  note: string;
}

export interface ICarTaskInputs {
  car: number;
  description: string;
  materials: string;
  is_completed: boolean;
  date_completed: any;
}
