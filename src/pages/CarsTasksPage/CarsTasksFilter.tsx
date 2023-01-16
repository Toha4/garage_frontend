import React, { Dispatch, SetStateAction } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form, Button, Input, Checkbox } from "antd";
import { ITableParams } from "../../components/interface";
import SelectCarForm from "../../components/forms/components/SelectCarForm";

interface ICarsTasksFilter {
  tableParams: ITableParams;
  setTableParams: Dispatch<SetStateAction<ITableParams>>;
  updateTable: Dispatch<SetStateAction<boolean>>;
}

interface IFormInputs {
  general_search: string;
  car: number | undefined;
  show_completed: boolean;
}

const DefaultValue: IFormInputs = {
  general_search: "",
  car: undefined,
  show_completed: false,
};

const CarsTasksFilter: React.FC<ICarsTasksFilter> = ({ tableParams, setTableParams, updateTable }) => {
  const { register, handleSubmit, watch, reset, control } = useForm<IFormInputs>();

  React.useEffect(() => {
    register("general_search");
    register("car");
    register("show_completed");

    setValueDefault();
  }, []);

  const setValueDefault = () => {
    reset(DefaultValue);
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    tableParams.pagination = {};

    tableParams.search["general_search"] = data.general_search;
    tableParams.search["car"] = data.car;
    tableParams.search["show_completed"] = String(data.show_completed);
    setTableParams(tableParams);
    updateTable(true);
  };

  const onResetFilter = () => {
    setValueDefault();
    handleSubmit(onSubmit)();
  };

  const showResetButton = JSON.stringify(DefaultValue) != JSON.stringify(watch());

  return (
    <Form className="ant-advanced-search-form" name="advanced_search">
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Form.Item>
          <Controller
            name="general_search"
            control={control}
            render={({ field }) => (
              <Input
                style={{ width: 300 }}
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
          <SelectCarForm width="120px" name="car" placeholder="Выбрать ТС" allowClear control={control} />
        </Form.Item>
        <Form.Item>
          <Controller
            name="show_completed"
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
                Показывать выполненные
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
          {showResetButton && (
            <Button type="link" size="small" onClick={onResetFilter}>
              Сбросить
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};

export default CarsTasksFilter;
