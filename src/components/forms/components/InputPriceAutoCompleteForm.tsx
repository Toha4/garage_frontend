import { AutoComplete } from "antd";
import React from "react";
import { Controller } from "react-hook-form";

interface IInputPriceForm {
  name: string;
  control: any;
  required?: boolean;
  disabled?: boolean;
  width?: string | number;
  prices_options?: { label: string; value: string }[];
  onChange?: (value: string) => void;
}

const InputPriceAutoCompleteForm: React.FC<IInputPriceForm> = ({
  name,
  control,
  disabled = false,
  width,
  prices_options,
  onChange,
}) => {
  const [price, setPrice] = React.useState<string>("");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AutoComplete
          style={{ width: width }}
          disabled={disabled}
          options={prices_options}
          {...field}
          onChange={(value) => {
            const reg = /^-?\d*(\.\d*)?$/;
            if (reg.test(value) || value === "") {
              setPrice(value);
              field.onChange(value);
            }
          }}
          onBlur={() => {
            const value = Number(price).toFixed(2);
            field.onChange(value);
            setPrice(value);
            if (onChange) onChange(value);
          }}
        />
      )}
    />
  );
};

export default InputPriceAutoCompleteForm;
