import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { ReasonType } from "../../services/types";
import ReasonService from "../../services/ReasonService";
import { IFormReasonInputs } from "../interface";
import InputForm from "./components/InputForm";
import RadioReasonForm from "./components/RadioReasonForm";

interface IReasonModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category: ReasonType) => void;
  onCancel: () => void;
}

const ReasonModalForm: React.FC<IReasonModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataReasonService = new ReasonService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormReasonInputs>({
    defaultValues: {
      type: undefined,
      name: "",
    },
  });

  React.useEffect(() => {
    register("name", { required: "Введите наименование причины!" });
    register("type", { required: "Выберите тип причины!" });

    if (action === ActionTypes.EDIT && pk) {
      const onDataLoaded = (data: ReasonType) => {
        setValue("name", data.name);
        setValue("type", data.type);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataReasonService.getReason(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormReasonInputs) => {
    const reasonData: ReasonType = {
      type: data.type,
      name: data.name,
    };

    const onSuccess = (data: ReasonType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      if (error.response.data?.name[0] === "Причина с таким Наименование уже существует.") {
        setError("name", { type: "custom", message: "Причина с таким наименованием уже существует!" });
      } else {
        alert(error.responseText);
      }
    };

    if (action === ActionTypes.EDIT && pk) {
      DataReasonService.updateReason(pk, reasonData).then(onSuccess).catch(onFailed);
    } else {
      DataReasonService.createReason(reasonData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новая причина" : "Редактирование причины"}
        width={450}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={action === ActionTypes.ADD ? "Добавить" : "Изменить"}
      >
        <Form layout="vertical">
          <Form.Item
            required
            validateStatus={errors.type ? "error" : "success"}
            help={errors.type ? errors.type.message : null}
          >
            <RadioReasonForm name="type" control={control} />
          </Form.Item>

          <Form.Item
            label="Наименование"
            required
            validateStatus={errors.name ? "error" : "success"}
            help={errors.name ? errors.name.message : null}
          >
            <InputForm name="name" control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReasonModalForm;
