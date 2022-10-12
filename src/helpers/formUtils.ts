import moment from "moment";
import { IFormOrderInputs } from "../components/interface";
import { OrderType } from "../services/types";

const isSameDate = (date1: string | null, date2: moment.Moment | null): boolean => {
  if (date1 === null && date2 === null) {
    return true;
  }
  else if (date1 !== null && date2 !== null) {
    return date1 === date2.format("DD.MM.YYYY HH:mm");
  }
  else {
    return false;
  }
};

export const hasChangeOrderForm = (data: OrderType, form: IFormOrderInputs): boolean => {
  return !(
    data.status === form.status &&
    data.reason === form.reason &&
    isSameDate(data.date_begin, form.date_begin) &&
    isSameDate(data.date_end, form.date_end) &&
    data.post === form.post &&
    data.car === form.car &&
    data.driver === form.driver && 
    data.responsible === form.responsible &&
    data.odometer === form.odometer &&
    data.note === form.note &&
    JSON.stringify(data.order_works) === JSON.stringify(form.works)
  )
};

export const formToOrderData = (form: IFormOrderInputs): OrderType => {
  return {
    status: form.status,
    reason: form.reason,
    date_begin: form.date_begin ? form.date_begin.format("DD.MM.YYYY HH:mm") : null,
    date_end: form.date_end ? form.date_end.format("DD.MM.YYYY HH:mm") : null,
    post: form.post,
    car: form.car,
    driver: form.driver,
    responsible: form.responsible,
    odometer: form.odometer,
    note: form.note,
    order_works: form.works,
  };
};