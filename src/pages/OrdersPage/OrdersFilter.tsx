import React, { Dispatch, SetStateAction } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form, Button, Select, Input, DatePicker } from "antd";
import { ITableParams } from "../../components/interface";
import { ReasonTypeNames, StatusNames } from "../../helpers/constants";
import SelectCarForm from "../../components/forms/components/SelectCarForm";

const { Option } = Select;

interface IOrdersFilter {
  tableParams: ITableParams;
  setTableParams: Dispatch<SetStateAction<ITableParams>>;
  updateTable: Dispatch<SetStateAction<boolean>>;
}

interface IFormInputs {
  general_search: string;
  car: number | undefined;
  reason_type: number | undefined;
  statuses: number[] | undefined;
  date_begin: any;
  date_end: any;
}

const DefaultValue: IFormInputs = {
  general_search: "",
  car: undefined,
  reason_type: undefined,
  statuses: undefined,
  date_begin: undefined,
  date_end: undefined,
};

const OrdersFilter: React.FC<IOrdersFilter> = ({ tableParams, setTableParams, updateTable }) => {
  const { register, handleSubmit, reset, control, watch } = useForm<IFormInputs>();

  React.useEffect(() => {
    register("general_search");
    register("car");
    register("reason_type");
    register("statuses");
    register("date_begin");
    register("date_end");

    setValueDefalt();
  }, []);

  const setValueDefalt = () => {
    reset(DefaultValue);
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    tableParams.pagination = {};

    tableParams.search["general_search"] = data.general_search;
    tableParams.search["car"] = data.car;
    tableParams.search["reason_type"] = data.reason_type;
    tableParams.search["statuses"] = data.statuses;
    tableParams.search["date_begin"] = data.date_begin?.format("DD.MM.YYYY");
    tableParams.search["date_end"] = data.date_end?.format("DD.MM.YYYY");
    setTableParams(tableParams);
    updateTable(true);
  };

  const onResetFilter = () => {
    setValueDefalt();
    handleSubmit(onSubmit)();
  };

  const reason_types_options: any = [];
  for (const [key, value] of Object.entries(ReasonTypeNames)) {
    reason_types_options.push(
      <Option key={key} value={key}>
        {value}
      </Option>
    );
  }

  const status_options: any = [];
  for (const [key, value] of Object.entries(StatusNames)) {
    status_options.push(
      <Option key={key} value={key}>
        {value}
      </Option>
    );
  }

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
                style={{ width: 220 }}
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
            name="reason_type"
            control={control}
            render={({ field }) => (
              <Select allowClear placeholder="Тип" style={{ width: 120 }} {...field}>
                {reason_types_options}
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item>
          <Controller
            name="statuses"
            control={control}
            render={({ field }) => (
              <Select allowClear mode="multiple" placeholder="Статус" style={{ width: 200 }} {...field}>
                {status_options}
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item>
          <Controller
            name="date_begin"
            control={control}
            render={({ field }) => <DatePicker allowClear={true} placeholder="Дата с" format="DD.MM.YYYY" {...field} />}
          />
        </Form.Item>
        <Form.Item>
          <Controller
            name="date_end"
            control={control}
            render={({ field }) => (
              <DatePicker allowClear={true} placeholder="Дата по" format="DD.MM.YYYY" {...field} />
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
            Поиск
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

export default OrdersFilter;
