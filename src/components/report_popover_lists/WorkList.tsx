import { Button, List } from "antd";
import React from "react";
import { hoursFormatter } from "../../helpers/utils";
import { ReportOrderWorksShort } from "../../services/types";

interface IWorkList {
  works: ReportOrderWorksShort[];
  handleOpenOrder: (order_pk: number) => void;
}

const WorkList: React.FC<IWorkList> = ({ works, handleOpenOrder }) => {
  return (
    <List
      size="small"
      dataSource={works}
      locale={{ emptyText: "Работы не найдены" }}
      renderItem={(item) => (
        <List.Item key={`${item.order_pk}-${item.work_name}`}>
          <div>
            <Button
              size="small"
              type="link"
              onClick={() => handleOpenOrder(item.order_pk)}
            >{`Заказ-наряд №${item.order_number}`}</Button>
            <span>{`- ${item.work_name} ${item.quantity} шт. - ${hoursFormatter(item.time_minutes)}`}</span>
          </div>
        </List.Item>
      )}
    />
  );
};

export default WorkList;
