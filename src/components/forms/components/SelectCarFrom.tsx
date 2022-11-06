import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import CarService from "../../../services/CarService";
import { CarShortType } from "../../../services/types";

const { Option } = Select;

interface ISelectCarForm {
  name: string;
  control: any;
  onChange?: (value: any, option: any) => void;
  dateRequest?: moment.Moment;
}

const SelectCarForm: React.FC<ISelectCarForm> = ({ name, control, onChange, dateRequest }) => {
  const DataCarService = new CarService();

  const [cars, setCar] = React.useState<CarShortType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: CarShortType[]) => {
      setCar(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    let params = {};
    if (dateRequest) {
      params = { date_request: dateRequest.format("DD.MM.YYYY") };
    }

    DataCarService.getCars(params).then(onDataLoaded).catch(onError);
  }, [dateRequest]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          showSearch
          placeholder="Выберите"
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
          {...field}
          onChange={(value: any, option: any) => {
            if (onChange) onChange(value, option);
            field.onChange(value, option);
          }}
        >
          {cars &&
            cars.map((car, _) => (
              <Option key={car.pk} value={car.pk}>
                {car.state_number}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectCarForm;
