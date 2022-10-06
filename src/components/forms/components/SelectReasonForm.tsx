import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import ReasonService from "../../../services/ReasonService";
import { ReasonType } from "../../../services/types";

const { Option } = Select;

interface ISelectStatus {
  name: string;
  control: any;
}

const SelectReasonForm: React.FC<ISelectStatus> = ({ name, control }) => {
  const DataReasonService = new ReasonService();

  const [reasons, setReasons] = React.useState<ReasonType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: ReasonType[]) => {
      setReasons(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataReasonService.getReasons().then(onDataLoaded).catch(onError);
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
          {reasons &&
            reasons.map((reason, index) => (
              <Option key={index} value={reason.pk}>
                {reason.name}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectReasonForm;
