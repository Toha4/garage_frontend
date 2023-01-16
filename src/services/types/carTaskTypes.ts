export type CarTaskType = {
  pk: number | null;
  created?: string;
  car: number;
  description: string;
  materials: string;
  is_completed: boolean;
  date_completed: string | null;
  order?: number | null;
};

export interface CarTaskUpdateType {
  pk: number | null;
  car?: number;
  description?: string;
  materials?: string;
  is_completed?: boolean;
  date_completed?: string | null;
  order?: number;
}

export interface CarTaskListType extends CarTaskType {
  pk: number;
  car_name: string;
  order_number: number;
}
