import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import { WarehouseType } from "../../../services/types";
import WarehouseService from "../../../services/WarehouseService";

const { Option } = Select;

interface ISelectWarehouseForm {
  name: string;
  control: any;
  width?: string | number;
  placeholder?: string;
  allowClear?: boolean;
  activeOptions?: number[];
  disableOption?: number[];
  disable?: boolean;
  onChange?: (value: any, option: any) => void;
}

const SelectWarehouseForm: React.FC<ISelectWarehouseForm> = ({
  name,
  control,
  width,
  placeholder = "Выберите",
  allowClear,
  activeOptions,
  disableOption,
  disable,
  onChange,
}) => {
  const DataWarehouseService = new WarehouseService();

  const [warehouse, setWarehouse] = React.useState<WarehouseType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: WarehouseType[]) => {
      setWarehouse(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataWarehouseService.getWarehouses().then(onDataLoaded).catch(onError);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          allowClear={allowClear}
          disabled={disable}
          style={{ width: width }}
          placeholder={placeholder}
          {...field}
          onChange={(value: any, option: any) => {
            field.onChange(value, option);
            if (onChange) onChange(value, option);
          }}
        >
          {warehouse &&
            warehouse.map((warehouse, _) => (
              <Option
                key={warehouse.pk}
                disabled={
                  warehouse.pk &&
                  ((activeOptions && !activeOptions.includes(warehouse.pk)) ||
                    (disableOption && disableOption.includes(warehouse.pk)))
                }
                value={warehouse.pk}
              >
                {warehouse.name}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectWarehouseForm;
