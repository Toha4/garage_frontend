import { InputNumber } from "antd";
import React from "react";

interface IInputNumberUnit {
  value?: number;
  onChange?: (value: number | null) => void;
  style?: any;
  precision?: number | undefined;
  onUpdateValue?: any;
  required?: boolean;
  unit?: string;
  max?: number;
}

const InputNumberUnit: React.FC<IInputNumberUnit> = ({
  value = 0,
  onChange,
  style,
  precision,
  onUpdateValue,
  unit,
  required = false,
  max,
}) => {
  const handleBlur = () => {
    if (onUpdateValue) onUpdateValue();
  };

  const unitValue = unit ? unit : "";
  const isNumber = value && value > 0 ? true : false;

  return (
    <InputNumber
      style={style}
      status={required && !isNumber ? "error" : undefined}
      min={0}
      max={max}
      value={isNumber ? value : undefined}
      precision={precision}
      parser={(value) => Number(value?.replace(/[^.\d]/g, ""))}
      onChange={onChange}
      onBlur={handleBlur}
      addonAfter={<div style={{ width: "14px" }}> {unitValue}</div>}
    />
  );
};

export default InputNumberUnit;
