import React, { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, Button } from "antd";
import DatePickerForm from "../../components/forms/components/DatePickerForm";

export type ReportFilterType = { [key: string]: string | number | number[] | undefined };

interface IReportMechanicsFilter {
  filter: ReportFilterType;
  setReportFilter: Dispatch<SetStateAction<ReportFilterType>>;
  updateTable: Dispatch<SetStateAction<boolean>>;
  onExportExcel: () => void;
  loadingData?: boolean;
  loadingExport?: boolean;
}

interface IFormInputs {
  date_begin: any;
  date_end: any;
}

const ReportMechanicsFilter: React.FC<IReportMechanicsFilter> = ({
  filter,
  setReportFilter,
  updateTable,
  onExportExcel,
  loadingData,
  loadingExport,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<IFormInputs>();

  React.useEffect(() => {
    register("date_begin", { required: true });
    register("date_end", { required: true });
  }, []);

  const setFilter = (data: IFormInputs) => {
    filter["date_begin"] = data.date_begin ? data.date_begin.format("DD.MM.YYYY") : null;
    filter["date_end"] = data.date_end ? data.date_end.format("DD.MM.YYYY") : null;
    setReportFilter(filter);
  };

  const submit: SubmitHandler<IFormInputs> = (data) => {
    setFilter(data);
    updateTable(true);
  };

  const exportExcel: SubmitHandler<IFormInputs> = (data) => {
    setFilter(data);
    onExportExcel();
  };

  return (
    <Form className="ant-advanced-search-form" name="advanced_search">
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Form.Item label="Период с" validateStatus={errors.date_begin ? "error" : "success"}>
          <DatePickerForm name="date_begin" control={control} />
        </Form.Item>
        <Form.Item label="по" validateStatus={errors.date_end ? "error" : "success"}>
          <DatePickerForm name="date_end" control={control} />
        </Form.Item>
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
          <Button
            className="ml-10"
            onClick={() => {
              handleSubmit(exportExcel)();
            }}
            loading={loadingExport}
          >
            В Excel
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ReportMechanicsFilter;
