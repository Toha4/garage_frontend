import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { WorkType } from "../../services/types";
import WorkService from "../../services/WorkService";
import { IFormWorkInputs } from "../interface";
import InputForm from "./components/InputForm";
import SelectCategoryForm from "./components/SelectCategoryFrom";

interface IWorkModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category_pk_update: number) => void;
  onCancel: () => void;
}

const WorkModalForm: React.FC<IWorkModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataWorkService = new WorkService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormWorkInputs>({
    defaultValues: {
      category: undefined,
      name: "",
    },
  });

  React.useEffect(() => {
    register("category", { required: "Выберите категорию!" });
    register("name", { required: "Введите наименование работы!" });

    if (action === ActionTypes.EDIT && pk) {
      const onDataLoaded = (data: WorkType) => {
        setValue("category", data.category);
        setValue("name", data.name);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataWorkService.getWork(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormWorkInputs) => {
    const workData: WorkType = {
      pk: pk,
      category: data.category,
      name: data.name,
    };

    const onSuccess = (data: WorkType) => {
      onOk(data.category);
    };

    const onFailed = (error: any) => {
      if (error.response.data?.name[0] === "Работа с таким Наименование уже существует.") {
        setError("name", { type: 'custom', message: "Работа с таким наименованием уже существует!" })
      }
      else {
        alert(error.responseText);
      }      
    };

    if (action === ActionTypes.EDIT && pk) {
      DataWorkService.updateWork(pk, workData).then(onSuccess).catch(onFailed);
    } else {
      DataWorkService.createWork(workData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новая работа" : "Редактирование работы"}
        width={450}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={action === ActionTypes.ADD ? "Добавить" : "Изменить"}
      >
        <Form layout="vertical">
          <Form.Item
            label="Категория"
            required
            validateStatus={errors.category ? "error" : "success"}
            help={errors.category ? errors.category.message : null}
          >
            <SelectCategoryForm name="category" control={control} />
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

export default WorkModalForm;
