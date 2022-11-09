import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { MaterialCategoryType } from "../../services/types";
import MaterialService from "../../services/MaterialService";
import { IFormMaterialCategoryInputs } from "../interface";
import InputForm from "./components/InputForm";

interface IMaterialCategoryModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category: MaterialCategoryType) => void;
  onCancel: () => void;
}

const MaterialCategoryModalForm: React.FC<IMaterialCategoryModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataMaterialService = new MaterialService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormMaterialCategoryInputs>({
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    register("name", { required: "Введите наименование категории!" });

    if (pk) {
      const onDataLoaded = (data: MaterialCategoryType) => {
        setValue("name", data.name);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataMaterialService.getMaterialCategory(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormMaterialCategoryInputs) => {
    const materialCategoryData: MaterialCategoryType = {
      pk: pk,
      name: data.name,
    };

    const onSuccess = (data: MaterialCategoryType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      if (error.response.data?.name && error.response.data?.name[0] === "Категория материалов с таким Наименование уже существует.") {
        setError("name", { type: "custom", message: "Категория с таким наименованием уже существует!" });
      } else {
        alert(error.responseText);
      }
    };

    if (action === ActionTypes.EDIT && pk) {
      DataMaterialService.updateMaterialCategory(pk, materialCategoryData).then(onSuccess).catch(onFailed);
    } else {
      DataMaterialService.createMaterialCategory(materialCategoryData).then(onSuccess).catch(onFailed);
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

export default MaterialCategoryModalForm;
