import { Tabs, Typography } from "antd";
import React from "react";
import WarehouseEntrancePage from "../WarehouseEntrancePage";
import WarehouseRemainsPage from "../WarehouseRemainsPage";

const { Text } = Typography;

const WarehousePage: React.FC = () => {
  const items = [
    {
      label: (
        <Text className="ml-15 mr-15" strong>
          Материалы
        </Text>
      ),
      key: "warehouse-remains",
      children: <WarehouseRemainsPage />,
    },
    {
      label: (
        <Text className="ml-15 mr-15" strong>
          Поступления
        </Text>
      ),
      key: "warehouse-entrance",
      children: <WarehouseEntrancePage />,
    },
  ];

  return (
    <>
      <Tabs type="card" destroyInactiveTabPane items={items} />
    </>
  );
};

export default WarehousePage;
