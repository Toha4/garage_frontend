import moment from "moment";
import { IFormOrderInputs } from "../components/interface";
import { TurnoverNestedWriteType, OrderType } from "../services/types";

const isSameDate = (date1: string | null, date2: moment.Moment | null): boolean => {
  if (date1 === null && date2 === null) {
    return true;
  } else if (date1 !== null && date2 !== null) {
    return date1 === date2.format("DD.MM.YYYY HH:mm");
  } else {
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
  );
};

export const formToOrderData = (form: IFormOrderInputs): OrderType => {
  return {
    status: form.status,
    reason: form.reason,
    date_begin: form.date_begin ? form.date_begin.format("DD.MM.YYYY HH:mm") : null,
    date_end: form.date_end ? form.date_end.format("DD.MM.YYYY HH:mm") : null,
    post: form.post,
    car: form.car === -1 ? null : form.car,
    driver: form.driver,
    responsible: form.responsible ? form.responsible : null,
    odometer: form.odometer,
    note: form.note,
    order_works: form.works,
    turnovers_from_order: form.materials
      ? form.materials.map((item) => {
          const order: TurnoverNestedWriteType = {
            pk: item.pk,
            date: item.date,
            material: item.material,
            warehouse: item.warehouse,
            price: item.price,
            quantity: item.quantity,
            sum: +(item.price * item.quantity).toFixed(2),
          };
          return order;
        })
      : [],
  };
};
