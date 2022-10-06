import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import { StatusNames } from "../../../helpers/constants";

const { Option } = Select;

interface ISelectStatus {
  name: string;
  control: any;
}

const SelectOrderStatusForm: React.FC<ISelectStatus> = ({ name, control }) => {
  const status_options: any = [];
  for (const [key, value] of Object.entries(StatusNames)) {
    status_options.push(
      <Option key={key} value={key}>
        {value}
      </Option>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select {...field} value={field.value?.toString()}>
          {status_options}
        </Select>
      )}
    />
  );
};

export default SelectOrderStatusForm;
