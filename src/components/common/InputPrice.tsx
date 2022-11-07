import { Input } from "antd";
import React from "react";

interface IInputPrice {
  value?: number;
  onChange?: (value: number | null) => void;
  precision?: number | undefined;
  onUpdateValue?: any;
  required?: boolean;
}

const InputPrice: React.FC<IInputPrice> = ({ value = 0.0, onChange, onUpdateValue, required = false }) => {
  const [price, setPrice] = React.useState(value.toFixed(2));

  const handleBlur = () => {
    setPrice(Number(price).toFixed(2));

    if (onChange) onChange(Number(price));
    if (onUpdateValue) onUpdateValue();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "") {
      setPrice(inputValue);
    }
  };

  return (
    <Input
      status={required && price === "0.00" ? "error" : undefined}
      value={price !== "0.00" ? price : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default InputPrice;
