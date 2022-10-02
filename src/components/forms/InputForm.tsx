import React from "react";
import { Input } from "antd";
import { Controller } from "react-hook-form";

interface IInputForm {
  name: string;
  control: any;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const InputForm: React.FC<IInputForm> = ({ name, control, required = false, disabled = false, placeholder = "" }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Input required={required} disabled={disabled} placeholder={placeholder} {...field} />}
    />
  );
};

export default InputForm;
