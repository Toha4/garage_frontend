import React, { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Form, Button, Select } from "antd";
import DatePickerForm from "../../components/forms/components/DatePickerForm";
import SelectCarForm from "../../components/forms/components/SelectCarForm";

const { Option } = Select;

export type ReportFilterType = { [key: string]: string | number | number[] | undefined };

interface IReportCarDetailFilter {
  filter: ReportFilterType;
  setReportFilter: Dispatch<SetStateAction<ReportFilterType>>;
  onUpdate: () => void;
  loadingData?: boolean;
}

interface IFormInputs {
  car: number;
  type_period: number;
  date_begin: any;
  date_end: any;
}

const PeriodType = {
  ALL: 1,
  PERIOD: 2,
};

const ReportCarDetailFilter: React.FC<IReportCarDetailFilter> = ({
  filter,
  setReportFilter,
  onUpdate,
  loadingData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormInputs>({
    defaultValues: {
      car: undefined,
      type_period: PeriodType.ALL,
      date_begin: undefined,
      date_end: undefined,
    },
  });

  React.useEffect(() => {
    register("car", { required: true });
    register("type_period", { required: true });
    register("date_begin");
    register("date_end");
  }, []);

  const setFilter = (data: IFormInputs) => {
    if (data.type_period === PeriodType.PERIOD && !data.date_begin && !data.date_end) {
      setError("date_begin", { type: "custom", message: "Выберите период!" });
      setError("date_end", { type: "custom", message: "Выберите период!" });
      return;
    }

    filter["car"] = data.car;
    if (data.type_period === PeriodType.PERIOD) {
      filter["date_begin"] = data.date_begin ? data.date_begin.format("DD.MM.YYYY") : undefined;
      filter["date_end"] = data.date_end ? data.date_end.format("DD.MM.YYYY") : undefined;
    } else {
      filter["date_begin"] = undefined;
      filter["date_end"] = undefined;
    }

    setReportFilter(filter);
    onUpdate();
  };

  const submit: SubmitHandler<IFormInputs> = (data) => {
    setFilter(data);
  };

  const show_period = watch("type_period") === 2;

  return (
    <Form className="ant-advanced-search-form" name="advanced_search">
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Form.Item label="Гос №" validateStatus={errors.car ? "error" : "success"}>
          <SelectCarForm width="120px" name="car" allowClear control={control} />
        </Form.Item>
        <Form.Item label="Период" validateStatus={errors.type_period ? "error" : "success"}>
          <Controller
            name="type_period"
            control={control}
            render={({ field }) => (
              <Select {...field} style={{ width: "120px" }}>
                <Option key={"1"} value={PeriodType.ALL}>
                  Все время
                </Option>
                <Option key={"2"} value={PeriodType.PERIOD}>
                  Выбрать
                </Option>
              </Select>
            )}
          />
        </Form.Item>

        {show_period && (
          <>
            <Form.Item label="с" validateStatus={errors.date_begin ? "error" : "success"}>
              <DatePickerForm name="date_begin" control={control} />
            </Form.Item>
            <Form.Item label="по" validateStatus={errors.date_end ? "error" : "success"}>
              <DatePickerForm name="date_end" control={control} />
            </Form.Item>
          </>
        )}
        <div className="mt-10 ml-10">
          <Button
            type="primary"
            onClick={() => {
              handleSubmit(submit)();
            }}
            loading={loadingData}
          >
            Сформировать
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ReportCarDetailFilter;
