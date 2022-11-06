import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import MaterialService from "../../../services/MaterialService";
import { UnitType } from "../../../services/types";

const { Option } = Select;

interface ISelectUnitForm {
  name: string;
  control: any;
}

const SelectUnitForm: React.FC<ISelectUnitForm> = ({ name, control }) => {
  const DataMaterialService = new MaterialService();

  const [units, setUnits] = React.useState<UnitType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: UnitType[]) => {
      setUnits(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataMaterialService.getUnits().then(onDataLoaded).catch(onError);
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
        >
          {units &&
            units.map((unit, _) => (
              <Option key={unit.pk} value={unit.pk}>
                {unit.name}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectUnitForm;
