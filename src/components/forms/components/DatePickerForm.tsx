import React from "react";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import moment from "moment";

interface ISelectStatus {
  name: string;
  control: any;
  onChange?: (date: moment.Moment, dateString: string) => void;
  required?: boolean;
}

const DatePickerForm: React.FC<ISelectStatus> = ({ name, control, onChange, required = false }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          allowClear={!required}
          placeholder="Выберите дату"
          showTime={{ format: "HH:mm" }}
          format="DD.MM.YYYY HH:mm"
          {...field}
          onChange={(date: any, dateString: string) => {
            if (onChange) onChange(date, dateString);
            field.onChange(date, dateString);
          }}
        />
      )}
    />
  );
};

export default DatePickerForm;
