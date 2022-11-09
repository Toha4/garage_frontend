import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { WorkCategoryType } from "../../services/types";
import WorkService from "../../services/WorkService";
import { IFormWorkCategoryInputs } from "../interface";
import InputForm from "./components/InputForm";

interface IWorkCategoryModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category: WorkCategoryType) => void;
  onCancel: () => void;
}

const WorkCategoryModalForm: React.FC<IWorkCategoryModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataWorkService = new WorkService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormWorkCategoryInputs>({
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    register("name", { required: "Введите наименование категории!" });

    if (pk) {
      const onDataLoaded = (data: WorkCategoryType) => {
        setValue("name", data.name);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataWorkService.getWorkCategory(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormWorkCategoryInputs) => {
    const workCategoryData: WorkCategoryType = {
      pk: pk,
      name: data.name,
    };

    const onSuccess = (data: WorkCategoryType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      if (
        error.response.data?.name &&
        error.response.data?.name[0] === "Категория работ с таким Наименование уже существует."
      ) {
        setError("name", { type: "custom", message: "Категория с таким наименованием уже существует!" });
      } else {
        alert(error.responseText);
      }
    };

    if (action === ActionTypes.EDIT && pk) {
      DataWorkService.updateWorkCategory(pk, workCategoryData).then(onSuccess).catch(onFailed);
    } else {
      DataWorkService.createWorkCategory(workCategoryData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новая категория" : "Редактирование категории"}
        width={450}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={action === ActionTypes.ADD ? "Добавить" : "Изменить"}
      >
        <Form layout="vertical">
          <Form.Item
            label="Наименование"
            required
            validateStatus={errors.name ? "error" : "success"}
            help={errors.name ? errors.name.message : null}
          >
            <InputForm name="name" maxLength={32} control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WorkCategoryModalForm;
