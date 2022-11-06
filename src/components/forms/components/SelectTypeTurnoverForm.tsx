import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import { TurnoverTypesNames } from "../../../helpers/constants";

const { Option } = Select;

interface ISelectTypeTurnoverForm {
  name: string;
  control: any;
  onChange?: (value: any, option: any) => void;
  width?: string | number;
}

const SelectTypeTurnoverForm: React.FC<ISelectTypeTurnoverForm> = ({ name, control, onChange, width }) => {
  const type_options: any = [];
  for (const [key, value] of Object.entries(TurnoverTypesNames)) {
    if (value !== "Корректировка") {
      type_options.push(
        <Option key={key} value={key}>
          {value}
        </Option>
      );
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          style={{ width: width }}
          {...field}
          onChange={(value: any, option: any) => {
            if (onChange) onChange(value, option);
            field.onChange(value, option);
          }}
          value={field.value?.toString()}
        >
          {type_options}
        </Select>
      )}
    />
  );
};

export default SelectTypeTurnoverForm;
