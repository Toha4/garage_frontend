import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { MaterialType } from "../../services/types";
import MaterialService from "../../services/MaterialService";
import { IFormMaterialInputs } from "../interface";
import InputForm from "./components/InputForm";
import SelectMaterialCategoryForm from "./components/SelectMaterialCategoryForm";
import SelectUnitForm from "./components/SelectUnitForm";
import SelectСompatbilityForm from "./components/SelectСompatbilityForm";

interface IMaterialModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category_pk_update: number) => void;
  onCancel: () => void;
}

const MaterialModalForm: React.FC<IMaterialModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataMaterialService = new MaterialService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormMaterialInputs>({
    defaultValues: {
      unit: undefined,
      category: undefined,
      name: "",
      article_number: null,
      compatbility: [],
    },
  });

  React.useEffect(() => {
    register("unit", { required: "Выберите единицу измерения!" });
    register("category", { required: "Выберите категорию!" });
    register("name", { required: "Введите наименование работы!" });
    register("article_number");
    register("compatbility");

    if (action === ActionTypes.EDIT && pk) {
      const onDataLoaded = (data: MaterialType) => {
        setValue("unit", data.unit);
        setValue("category", data.category);
        setValue("name", data.name);
        setValue("article_number", data.article_number);
        setValue("compatbility", data.compatbility);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataMaterialService.getMaterial(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormMaterialInputs) => {
    const materialData: MaterialType = {
      pk: pk,
      unit: data.unit,
      category: data.category,
      name: data.name,
      article_number: data.article_number?.length !== 0 ? data.article_number : null,
      compatbility: data.compatbility,
    };

    const onSuccess = (data: MaterialType) => {
      onOk(data.category);
    };

    const onFailed = (error: any) => {
      let is_error_processed = false;

      if (
        error.response.data?.name &&
        error.response.data?.name[0] === "Материал с таким Наименование уже существует."
      ) {
        setError("name", { type: "custom", message: "Материал с таким наименованием уже существует!" });
        is_error_processed = true;
      }
      if (
        error.response.data?.article_number &&
        error.response.data?.article_number[0] === "Материал с таким Код (Артикул) уже существует."
      ) {
        setError("article_number", { type: "custom", message: "Материал с таким кодом (артукулом) уже существует!" });
        is_error_processed = true;
      }

      if (!is_error_processed) {
        alert(error.responseText);
      }
    };

    if (action === ActionTypes.EDIT && pk) {
      DataMaterialService.updateMaterial(pk, materialData).then(onSuccess).catch(onFailed);
    } else {
      DataMaterialService.createMaterial(materialData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новый материал" : "Редактирование материала"}
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
            <InputForm name="name" maxLength={128} control={control} />
          </Form.Item>
          <Form.Item
            label="Код (артикул)"
            validateStatus={errors.article_number ? "error" : "success"}
            help={errors.article_number ? errors.article_number.message : null}
          >
            <InputForm name="article_number" maxLength={32} control={control} />
          </Form.Item>
          <Form.Item
            label="Категория"
            required
            validateStatus={errors.category ? "error" : "success"}
            help={errors.category ? errors.category.message : null}
          >
            <SelectMaterialCategoryForm name="category" control={control} />
          </Form.Item>
          <Form.Item
            label="Единица измерения"
            required
            validateStatus={errors.unit ? "error" : "success"}
            help={errors.unit ? errors.unit.message : null}
          >
            <SelectUnitForm name="unit" control={control} />
          </Form.Item>
          <Form.Item label="Cовместимость c ТС">
            <SelectСompatbilityForm name="compatbility" control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MaterialModalForm;
