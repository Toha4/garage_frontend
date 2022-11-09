import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { EmployeeType, EmployeeWriteType } from "../../services/types";
import EmployeeService from "../../services/EmployeeService";
import { IFormEmployeeInputs } from "../interface";
import InputForm from "./components/InputForm";
import DatePickerForm from "./components/DatePickerForm";
import moment from "moment";
import SelectEmployeeTypeForm from "./components/SelectEmployeeTypeForm";

interface IEmployeeModalForm {
  pk: number;
  open: boolean;
  onOk: (category: EmployeeType) => void;
  onCancel: () => void;
}

const EmployeeModalForm: React.FC<IEmployeeModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataEmployeeService = new EmployeeService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormEmployeeInputs>({
    defaultValues: {
      first_name: "",
      last_name: "",
      patronymic: "",
      position: "",
      type: undefined,
      date_dismissal: undefined,
    },
  });

  React.useEffect(() => {
    register("first_name");
    register("last_name");
    register("patronymic");
    register("position");
    register("type", { required: "Выберите тип работника!" });
    register("date_dismissal");

    if (pk) {
      const onDataLoaded = (data: EmployeeType) => {
        setValue("first_name", data.first_name);
        setValue("last_name", data.last_name);
        setValue("patronymic", data.patronymic);
        setValue("position", data.position);
        setValue("type", data.type);
        setValue("date_dismissal", data.date_dismissal ? moment(data.date_dismissal, "DD.MM.YYYY h:mm:") : undefined);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataEmployeeService.getEmployee(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormEmployeeInputs) => {
    const employeeData: EmployeeWriteType = {
      type: data.type,
    };

    const onSuccess = (data: EmployeeType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    DataEmployeeService.updateEmployee(pk, employeeData).then(onSuccess).catch(onFailed);
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={"Редактирование работника"}
        width={450}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={"Изменить"}
      >
        <Form layout="vertical">
          <Form.Item label="Имя">
            <InputForm name="first_name" disabled control={control} />
          </Form.Item>
          <Form.Item label="Фамилия">
            <InputForm name="last_name" disabled control={control} />
          </Form.Item>
          <Form.Item label="Отчество">
            <InputForm name="patronymic" disabled control={control} />
          </Form.Item>
          <Form.Item label="Должность">
            <InputForm name="position" disabled control={control} />
          </Form.Item>
          <Form.Item
            label="Тип работника"
            required
            validateStatus={errors.type ? "error" : "success"}
            help={errors.type ? errors.type.message : null}
          >
            <SelectEmployeeTypeForm name="type" control={control} />
          </Form.Item>
          <Form.Item label="Дата увольнения">
            <DatePickerForm name="date_dismissal" placeholder="" disable control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeModalForm;
