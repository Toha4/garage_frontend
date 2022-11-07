import React from "react";
import { Input } from "antd";
import { Controller } from "react-hook-form";

interface IInputForm {
  name: string;
  control: any;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  width?: string | number;
}

const InputForm: React.FC<IInputForm> = ({
  name,
  control,
  required = false,
  disabled = false,
  placeholder = "",
  maxLength = undefined,
  width,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          style={{ width: width || "100%" }}
          autoComplete="off"
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          {...field}
        />
      )}
    />
  );
};

export default InputForm;
