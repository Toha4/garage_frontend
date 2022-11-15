import { Button, List } from "antd";
import React from "react";
import { quantityFormatter } from "../../helpers/utils";
import { ReportTurnoverShortType } from "../../services/types";

interface IMaterialList {
  materials: ReportTurnoverShortType[];
  handleOpenOrder: (order_pk: number) => void;
  skipName?: boolean;
}

const MaterialList: React.FC<IMaterialList> = ({ materials, handleOpenOrder, skipName = false }) => {
  return (
    <List
      size="small"
      dataSource={materials}
      locale={{ emptyText: "Израсходованные материалы не найдены" }}
      renderItem={(item) => (
        <List.Item key={`${item.order_pk}-${item.warehouse_pk}-${item.material_name}`}>
          <div>
            <Button
              size="small"
              type="link"
              onClick={() => handleOpenOrder(item.order_pk)}
            >{`Заказ-наряд №${item.order_number}`}</Button>
            <span>{`- ${skipName ? "" : item.material_name} ${quantityFormatter(
              item.quantity,
              item.material_unit_is_precision_point,
              item.material_unit_name
            )} - ${item.sum.toFixed(2)} р.`}</span>
          </div>
        </List.Item>
      )}
    />
  );
};

export default MaterialList;
