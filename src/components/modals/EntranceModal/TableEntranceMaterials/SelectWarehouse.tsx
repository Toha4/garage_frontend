import { Select } from "antd";
import React from "react";
import { WarehouseType } from "../../../../services/types";

const { Option } = Select;

interface ISelectWarehouse {
  value?: number;
  onChange?: (value: number, option: any) => void;
  onUpdateValue?: any;
  required?: boolean;
  warehouses: WarehouseType[];
}

const SelectWarehouse: React.FC<ISelectWarehouse> = ({ value, onChange, onUpdateValue, required, warehouses }) => {
  const handleChange = (value: any, option: any) => {
    if (onChange) onChange(value, option);
    if (onUpdateValue) onUpdateValue();
  };

  return (
    <Select
      placeholder="Выберите"
      status={required && !value ? "error" : undefined}
      value={value}
      onChange={handleChange}
    >
      {warehouses.map((warehouse, _) => (
        <Option key={warehouse.pk} value={warehouse.pk}>
          {warehouse.name}
        </Option>
      ))}
    </Select>
  );
};

export default SelectWarehouse;
