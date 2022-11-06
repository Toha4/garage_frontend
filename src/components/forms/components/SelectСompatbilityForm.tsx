import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import CarService from "../../../services/CarService";
import { CarTagType } from "../../../services/types";

const { Option } = Select;

interface ISelectСompatbilityForm {
  name: string;
  control: any;
  width?: string | number;
  placeholder?: string;
  onChange?: (value: any, option: any) => void;
}

const SelectСompatbilityForm: React.FC<ISelectСompatbilityForm> = ({
  name,
  control,
  width,
  placeholder = "Выберите",
  onChange,
}) => {
  const DataCarService = new CarService();

  const [carsTags, setCarsTags] = React.useState<CarTagType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: CarTagType[]) => {
      setCarsTags(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataCarService.getCarsTags().then(onDataLoaded).catch(onError);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          style={{ width: width }}
          mode="multiple"
          showSearch
          placeholder={placeholder}
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
          {...field}
          onChange={(value: any, option: any) => {
            field.onChange(value, option);
            if (onChange) onChange(value, option);
          }}
        >
          {carsTags &&
            carsTags.map((car, _) => (
              <Option key={car.name} value={car.name}>
                {car.name}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectСompatbilityForm;
