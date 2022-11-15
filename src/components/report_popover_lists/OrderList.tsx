import { Button, List } from "antd";
import React from "react";
import { ReportOrderShortType } from "../../services/types";

interface IOrderList {
  orders: ReportOrderShortType[];
  handleOpenOrder: (order_pk: number) => void;
}

const OrderList: React.FC<IOrderList> = ({ orders, handleOpenOrder }) => {
  return (
    <List
      size="small"
      dataSource={orders}
      renderItem={(item) => (
        <List.Item key={item.pk}>
          <div>
            <Button
              size="small"
              type="link"
              onClick={() => handleOpenOrder(item.pk)}
            >{`Заказ-наряд №${item.number}`}</Button>
            <span>{`от ${item.date_begin}`}</span>
          </div>
        </List.Item>
      )}
    />
  );
};

export default OrderList;
