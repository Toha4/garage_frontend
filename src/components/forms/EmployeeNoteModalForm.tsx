import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { EmployeeNoteType } from "../../services/types";
import EmployeeNoteService from "../../services/EmployeeNoteService";
import { IEmployeeNoteInputs } from "../interface";
import moment from "moment";
import DatePickerForm from "./components/DatePickerForm";
import SelectEmployeeForm from "./components/SelectEmployeeForm";
import TextAreaForm from "./components/TextAreaForm";

interface IEmployeeNoteModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category: EmployeeNoteType) => void;
  onCancel: () => void;
}

const EmployeeNoteModalForm: React.FC<IEmployeeNoteModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataEmployeeNoteService = new EmployeeNoteService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
    control,
  } = useForm<IEmployeeNoteInputs>({
    defaultValues: {
      date: moment(),
      employee: undefined,
      note: "",
    },
  });

  React.useEffect(() => {
    register("date", { required: "Введите дату!" });
    register("employee", { required: "Введите работника!" });
    register("note", { required: "Введите запись!" });

    if (pk) {
      const onDataLoaded = (data: EmployeeNoteType) => {
        setValue("date", moment(data.date, "DD.MM.YYYY"));
        setValue("employee", data.employee);
        setValue("note", data.note);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataEmployeeNoteService.getEmployeeNote(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IEmployeeNoteInputs) => {
    const employeeNoteData: EmployeeNoteType = {
      pk: pk,
      date: data.date ? data.date.format("DD.MM.YYYY") : null,
      employee: data.employee,
      note: data.note,
    };

    const onSuccess = (data: EmployeeNoteType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    if (action === ActionTypes.EDIT && pk) {
      DataEmployeeNoteService.updateEmployeeNote(pk, employeeNoteData).then(onSuccess).catch(onFailed);
    } else {
      DataEmployeeNoteService.createEmployeeNote(employeeNoteData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  const dateRequestData = watch("date");

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новая заметка" : "Редактирование заметки"}
        width={450}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={action === ActionTypes.ADD ? "Добавить" : "Изменить"}
      >
        <Form layout="vertical">
          <Form.Item label="Дата" required validateStatus={errors.date ? "error" : "success"}>
            <DatePickerForm name="date" control={control} required width={"160px"} />
          </Form.Item>
          <Form.Item label="Работник" required validateStatus={errors.employee ? "error" : "success"}>
            <SelectEmployeeForm name="employee" control={control} type={2} dateRequest={dateRequestData} />
          </Form.Item>
          <Form.Item label="Текст" required>
            <TextAreaForm name="note" rows={2} control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeNoteModalForm;
