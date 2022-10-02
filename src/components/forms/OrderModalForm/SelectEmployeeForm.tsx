import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import EmployeeService from "../../../services/EmployeeService";
import { EmployeeShortType } from "../../../services/types";

const { Option } = Select;

interface ISelectStatus {
  name: string;
  control: any;
  type: number;
}

const SelectEmployeeForm: React.FC<ISelectStatus> = ({ name, control, type }) => {
  const DataEmployeeService = new EmployeeService();

  const [employees, setEmployee] = React.useState<EmployeeShortType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: EmployeeShortType[]) => {
      setEmployee(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataEmployeeService.getEmployees({ type }).then(onDataLoaded).catch(onError);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          allowClear
          showSearch
          placeholder="Выберите"
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
          {...field}
        >
          {employees &&
            employees.map((employee, index) => (
              <Option key={index} value={employee.pk}>
                {employee.short_fio}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectEmployeeForm;
