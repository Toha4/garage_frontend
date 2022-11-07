import React, { Dispatch, SetStateAction } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form, Button, Input, DatePicker } from "antd";
import { ITableParams } from "../../components/interface";

interface IEntranceFilter {
  tableParams: ITableParams;
  setTableParams: Dispatch<SetStateAction<ITableParams>>;
  updateTable: Dispatch<SetStateAction<boolean>>;
}

interface IFormInputs {
  general_search: string;
  date_begin: any;
  date_end: any;
}

const EntranceFilter: React.FC<IEntranceFilter> = ({ tableParams, setTableParams, updateTable }) => {
  const { register, handleSubmit, setValue, control } = useForm<IFormInputs>();

  React.useEffect(() => {
    register("general_search");
    register("date_begin");
    register("date_end");

    setValueDefalt();
  }, []);

  const setValueDefalt = () => {
    setValue("general_search", "");
    setValue("date_begin", undefined);
    setValue("date_end", undefined);
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    tableParams.pagination = {};

    tableParams.search["general_search"] = data.general_search;
    tableParams.search["date_begin"] = data.date_begin?.format("DD.MM.YYYY");
    tableParams.search["date_end"] = data.date_end?.format("DD.MM.YYYY");
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
          <Button type="link" size="small" onClick={onResetFilter}>
            Сбросить
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default EntranceFilter;
