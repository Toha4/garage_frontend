import React from "react";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import moment from "moment";

interface IDatePickerForm {
  name: string;
  control: any;
  onChange?: (date: moment.Moment, dateString: string) => void;
  required?: boolean;
  width?: string | number | undefined;
  disable?: boolean;
  placeholder?: string;
}

const DatePickerForm: React.FC<IDatePickerForm> = ({
  name,
  control,
  onChange,
  required = false,
  width = undefined,
  disable,
  placeholder="Выберите дату"
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          allowClear={!required}
          placeholder={placeholder}
          format="DD.MM.YYYY"
          style={{ width: width }}
          disabled={disable}
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
