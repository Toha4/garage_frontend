import React from "react";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import moment from "moment";

interface IDateTimePickerForm {
  name: string;
  control: any;
  onChange?: (date: moment.Moment, dateString: string) => void;
  required?: boolean;
  width?: string | number | undefined;
}

const DateTimePickerForm: React.FC<IDateTimePickerForm> = ({
  name,
  control,
  onChange,
  required = false,
  width = undefined,
}) => {
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
          style={{ width: width }}
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

export default DateTimePickerForm;
