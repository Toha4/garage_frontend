import React, { Dispatch, SetStateAction } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form, Button, Input, Checkbox } from "antd";
import { ITableParams } from "../../components/interface";
import SelectMaterialCategoryForm from "../../components/forms/components/SelectMaterialCategoryForm";
import SelectWarehouseForm from "../../components/forms/components/SelectWarehouseForm";
import SelectСompatbilityForm from "../../components/forms/components/SelectСompatbilityForm";

interface IRemainsFilter {
  tableParams: ITableParams;
  setTableParams: Dispatch<SetStateAction<ITableParams>>;
  updateTable: Dispatch<SetStateAction<boolean>>;
}

interface IFormInputs {
  general_search: string;
  category: number[] | undefined;
  warehouse: number | undefined;
  compatbility: string[] | undefined;
  hide_empty: boolean;
}

const RemainsFilter: React.FC<IRemainsFilter> = ({ tableParams, setTableParams, updateTable }) => {
  const { register, handleSubmit, setValue, control } = useForm<IFormInputs>();

  React.useEffect(() => {
    register("general_search");
    register("category");
    register("warehouse");
    register("compatbility");
    register("hide_empty");

    setValueDefalt();
  }, []);

  const setValueDefalt = () => {
    setValue("general_search", "");
    setValue("category", undefined);
    setValue("warehouse", undefined);
    setValue("compatbility", undefined);
    setValue("hide_empty", true);
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    tableParams.pagination = {};

    tableParams.search["general_search"] = data.general_search;
    tableParams.search["category"] = data.category;
    tableParams.search["warehouse"] = data.warehouse;
    tableParams.search["compatbility"] = data.compatbility?.join(",");
    tableParams.search["hide_empty"] = String(data.hide_empty);
    setTableParams(tableParams);
    updateTable(true);
  };

  const onResetFilter = () => {
    setValueDefalt();
    handleSubmit(onSubmit)();
  };

  return (
    <Form className="ant-advanced-search-form" name="advanced_search">
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Form.Item>
          <Controller
            name="general_search"
            control={control}
            render={({ field }) => (
              <Input
                style={{ width: 200 }}
                allowClear
                placeholder="Поиск"
                onPressEnter={() => {
                  handleSubmit(onSubmit)();
                }}
                {...field}
              />
            )}
          />
        </Form.Item>
        <Form.Item>
          <SelectMaterialCategoryForm
            name="category"
            width={220}
            placeholder="Все категории"
            allowClear
            control={control}
          />
        </Form.Item>
        <Form.Item>
          <SelectWarehouseForm name="warehouse" width={160} placeholder="Все склады" allowClear control={control} />
        </Form.Item>
        <Form.Item>
          <SelectСompatbilityForm name="compatbility" width="160px" placeholder="Совместимость" control={control} />
        </Form.Item>
        <Form.Item>
          <Controller
            name="hide_empty"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleSubmit(onSubmit)();
                }}
              >
                Наличие
              </Checkbox>
            )}
          />
        </Form.Item>

        <div className="mt-10 ml-10">
          <Button
            type="primary"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Применить
          </Button>
          <Button type="link" size="small" onClick={onResetFilter}>
            Сбросить
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default RemainsFilter;
