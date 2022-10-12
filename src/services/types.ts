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

export type CarType = {
  pk: number;
  kod_mar_in_putewka: number;
  gos_nom_in_putewka: string;
  state_number: string;
  name: string;
  kod_driver: number;
  driver_pk: number;
  date_decommissioned: string;
};

export type CarShortType = Pick<CarType, "pk" | "state_number" | "name">;

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

