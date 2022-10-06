import React from "react";
import { InputNumber } from "antd";
import { Controller } from "react-hook-form";

interface IInputNumberForm {
  name: string;
  control: any;
  required?: boolean;
  controls?: boolean;
  placeholder?: string;
  min?: number;
}

const InputNumberForm: React.FC<IInputNumberForm> = ({
  name,
  control,
  required = false,
  controls = true,
  placeholder = "",
  min=0
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputNumber
          required={required}
          controls={controls}
          placeholder={placeholder}
          min={min}
          style={{ width: "100%" }}
          {...field}
        />
      )}
    />
  );
};

export default InputNumberForm;
