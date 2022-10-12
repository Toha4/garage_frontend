import React from "react";
import { Radio } from "antd";
import { Controller } from "react-hook-form";

interface IRadioReasonForm {
  name: string;
  control: any;
}

const RadioReasonForm: React.FC<IRadioReasonForm> = ({ name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Radio.Group {...field}>
          <Radio value={1}>ТО</Radio>
          <Radio value={2}>Ремонт</Radio>
          <Radio value={3}>Прочее</Radio>
        </Radio.Group>
      )}
    />
  );
};

export default RadioReasonForm;
