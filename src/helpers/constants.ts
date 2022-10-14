export const ReasonTypes = {
  TO: 1,
  REPAIR: 2,
  OTHER: 3,
};

export const ReasonTypeNames = {
  [ReasonTypes.TO]: "ТО",
  [ReasonTypes.REPAIR]: "Ремонт",
  [ReasonTypes.OTHER]: "Прочее",
};

export const Status = {
  REQUEST: 1,
  WORK: 2,
  COMPLETED: 3,
};

export const StatusNames = {
  [Status.REQUEST]: "Заявка",
  [Status.WORK]: "В работе",
  [Status.COMPLETED]: "Выполнен",
};