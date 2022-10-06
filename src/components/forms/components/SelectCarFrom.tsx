import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import CarService from "../../../services/CarService";
import { CarShortType } from "../../../services/types";

const { Option } = Select;

interface ISelectCar {
  name: string;
  control: any;
  onChange?: (value: any, option: any) => void;
}

const SelectCarForm: React.FC<ISelectCar> = ({ name, control, onChange }) => {
  const DataCarService = new CarService();

  const [cars, setCar] = React.useState<CarShortType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: CarShortType[]) => {
      setCar(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataCarService.getCars().then(onDataLoaded).catch(onError);
  }, []);

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
