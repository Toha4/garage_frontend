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
  max?: number;
  precision?: number;
  width?: string | number;
  onChange?: (value: any) => void;
}

const InputNumberForm: React.FC<IInputNumberForm> = ({
  name,
  control,
  required = false,
  controls = true,
  placeholder = "",
  min = 0,
  max,
  precision,
  width,
  onChange,
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
          precision={precision}
          min={min}
          max={max}
          style={{ width: width || "100%" }}
          {...field}
          onChange={(value) => {
            field.onChange(value);
            if (onChange) onChange(value);
          }}
        />
      )}
    />
  );
};

export default InputNumberForm;
