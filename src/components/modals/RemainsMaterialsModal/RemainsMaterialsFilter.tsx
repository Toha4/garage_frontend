import React, { Dispatch, SetStateAction } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form, Input, Space } from "antd";
import SelectWarehouseForm from "../../forms/components/SelectWarehouseForm";
import SelectСompatbilityForm from "../../forms/components/SelectСompatbilityForm";

export interface IRemainsMaterialDataFilter {
  search_name: string;
  warehouse: number | undefined;
  compatbility: string[] | undefined;
}

interface IRemainsMaterialFilter {
  filter: IRemainsMaterialDataFilter;
  setFilter: Dispatch<SetStateAction<IRemainsMaterialDataFilter>>;
}

const RemainsMaterialFilter: React.FC<IRemainsMaterialFilter> = ({ filter, setFilter }) => {
  const { register, handleSubmit, setValue, control } = useForm<IRemainsMaterialDataFilter>();

  React.useEffect(() => {
    register("search_name");
    register("warehouse");
    register("compatbility");

    setValueDefalt();
  }, []);

  const setValueDefalt = () => {
    setValue("search_name", filter.search_name);
    setValue("warehouse", filter.warehouse);
    setValue("compatbility", filter.compatbility);
  };

  const onSubmit: SubmitHandler<IRemainsMaterialDataFilter> = (data) => {
    setFilter({ search_name: data.search_name, warehouse: data.warehouse, compatbility: data.compatbility });
  };

  return (
    <Form>
      <Space>
        <Form.Item>
          <Controller
            name="search_name"
            control={control}
            render={({ field }) => (
              <Input
                style={{ width: 300 }}
                autoComplete="off"
                allowClear
                placeholder="Поиск"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  handleSubmit(onSubmit)();
                }}
              />
            )}
          />
        </Form.Item>
        <Form.Item>
          <SelectСompatbilityForm
            name="compatbility"
            width="360px"
            placeholder="Совместимость"
            onChange={() => handleSubmit(onSubmit)()}
            control={control}
          />
        </Form.Item>
        <Form.Item>
          <SelectWarehouseForm
            name="warehouse"
            width="192px"
            placeholder="Все склады"
            allowClear
            onChange={() => handleSubmit(onSubmit)()}
            control={control}
          />
        </Form.Item>
      </Space>
    </Form>
  );
};

export default RemainsMaterialFilter;
