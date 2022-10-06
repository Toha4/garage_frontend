import React from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import WorkService from "../../../services/WorkService";
import { WorkCategoryType } from "../../../services/types";

const { Option } = Select;

interface ISelectCategory {
  name: string;
  control: any;
}

const SelectCategoryForm: React.FC<ISelectCategory> = ({ name, control }) => {
  const DataWorkService = new WorkService();

  const [categoryes, setCategoryes] = React.useState<WorkCategoryType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: WorkCategoryType[]) => {
      setCategoryes(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataWorkService.geWorktCategoryes().then(onDataLoaded).catch(onError);
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

export default SelectCategoryForm;
