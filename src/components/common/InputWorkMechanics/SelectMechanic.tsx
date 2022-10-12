import React from "react";
import { Select } from "antd";
import { EmployeeShortType, OrderWorkMechanics } from "../../../services/types";
import EmployeeService from "../../../services/EmployeeService";

const { Option } = Select;

interface ISelectMechanic {
  dateRequest?: moment.Moment;
  onSelect: (mechanic: OrderWorkMechanics) => void;
  excludeMechanics?: number[];
}

const SelectMechanic: React.FC<ISelectMechanic> = ({ dateRequest, onSelect, excludeMechanics }) => {
  const DataEmployeeService = new EmployeeService();

  const [mechanics, setMechanics] = React.useState<EmployeeShortType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: EmployeeShortType[]) => {
      setMechanics(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    let params: any = { type: 2 };
    if (dateRequest) {
      params.date_request = dateRequest.format("DD.MM.YYYY");
    }

    DataEmployeeService.getEmployees(params).then(onDataLoaded).catch(onError);
  }, []);

  const handleSelectMechanic = (pk: any) => {
    const short_fio = mechanics?.find((item) => pk === item.pk)?.short_fio;
    const newMechanic: OrderWorkMechanics = {
      pk: null,
      mechanic: pk,
      mechanic_short_fio: short_fio,
      time_minutes: null,
    };
    onSelect(newMechanic);
  };

  const filterdMechanics = mechanics?.filter((item) => !excludeMechanics?.includes(item.pk));

  return (
    <Select
      showSearch
      placeholder="Выберите"
      onChange={handleSelectMechanic}
      filterOption={(input, option) =>
        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
      }
      value={null}
      style={{ width: "135px" }}
    >
      {filterdMechanics?.map((employee, index) => (
        <Option key={index} value={employee.pk}>
          {employee.short_fio}
        </Option>
      ))}
    </Select>
  );
};

export default SelectMechanic;
