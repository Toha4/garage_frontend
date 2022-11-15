import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import { ReasonTypeNames } from "../../../helpers/constants";

const { Option } = Select;

interface ISelectReasonTypeForm {
  name: string;
  control: any;
  placeholder?: string;
  width?: string | number;
}

const SelectReasonTypeForm: React.FC<ISelectReasonTypeForm> = ({ name, control, placeholder = "Выберите", width }) => {
  const reason_types_options: any = [];
  for (const [key, value] of Object.entries(ReasonTypeNames)) {
    reason_types_options.push(
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
        <Select placeholder={placeholder} style={{ width: width }} allowClear {...field}>
          {reason_types_options}
        </Select>
      )}
    />
  );
};

export default SelectReasonTypeForm;
