import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import MaterialService from "../../../services/MaterialService";
import { MaterialCategoryType } from "../../../services/types";

const { Option } = Select;

interface ISelectMaterialCategoryForm {
  name: string;
  control: any;
  width?: string | number;
  placeholder?: string;
  allowClear?: boolean;
  mode?: "multiple" | undefined;
}

const SelectMaterialCategoryForm: React.FC<ISelectMaterialCategoryForm> = ({
  name,
  control,
  width,
  placeholder = "Выберите",
  allowClear = false,
  mode,
}) => {
  const DataMaterialService = new MaterialService();

  const [categoryes, setCategoryes] = React.useState<MaterialCategoryType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: MaterialCategoryType[]) => {
      setCategoryes(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataMaterialService.getMaterialCategoryes().then(onDataLoaded).catch(onError);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          showSearch
          allowClear={allowClear}
          mode={mode}
          style={{ width: width }}
          placeholder={placeholder}
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
          {...field}
        >
          {categoryes &&
            categoryes.map((category, _) => (
              <Option key={category.pk} value={category.pk}>
                {category.name}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectMaterialCategoryForm;
