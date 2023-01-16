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
  car_task_count?: number;
};

export type CarShortType = Pick<CarType, "pk" | "state_number" | "name">;

export type CarWriteType = Pick<CarType, "name">;

export type CarTagType = Pick<CarType, "name">;