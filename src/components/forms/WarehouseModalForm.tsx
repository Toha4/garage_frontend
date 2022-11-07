import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { WarehouseType } from "../../services/types";
import WarehouseService from "../../services/WarehouseService";
import { IFormWarehouseInputs } from "../interface";
import InputForm from "./components/InputForm";

interface IWarehouseModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category: WarehouseType) => void;
  onCancel: () => void;
}

const WarehouseModalForm: React.FC<IWarehouseModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataWarehouseService = new WarehouseService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormWarehouseInputs>({
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    register("name", { required: "Введите наименование склада!" });

    if (action === ActionTypes.EDIT && pk) {
      const onDataLoaded = (data: WarehouseType) => {
        setValue("name", data.name);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataWarehouseService.getWarehouse(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormWarehouseInputs) => {
    const warehouseData: WarehouseType = {
      name: data.name,
    };

    const onSuccess = (data: WarehouseType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      if (error.response.data?.name[0] === "Склад с таким Наименование уже существует.") {
        setError("name", { type: "custom", message: "Склад с таким наименованием уже существует!" });
      } else {
        alert(error.responseText);
      }
    };

    if (action === ActionTypes.EDIT && pk) {
      DataWarehouseService.updateWarehouse(pk, warehouseData).then(onSuccess).catch(onFailed);
    } else {
      DataWarehouseService.createWarehouse(warehouseData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новый склад" : "Редактирование склада"}
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
            <InputForm name="name" control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WarehouseModalForm;
