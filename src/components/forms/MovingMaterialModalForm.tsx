import React from "react";
import { Form, Modal, Space } from "antd";
import { useForm } from "react-hook-form";
import { TurnoverMovingMaterialType } from "../../services/types";
import TurnoverService from "../../services/TurnoverService";
import { IFormMovingTurnoverInputs } from "../interface";
import InputForm from "./components/InputForm";
import SelectWarehouseForm from "./components/SelectWarehouseForm";
import InputNumberForm from "./components/InputNumberForm";
import moment from "moment";
import showConfirmDialog from "../common/ConfirmDialog";

interface IMovingMaterialModalForm {
  materialId: number;
  materialName: string;
  unit_name: string;
  unit_is_precision_point: boolean;
  warehouseOutgoing: number;
  maxQuantity: number;
  price: number;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const MovingMaterialModalForm: React.FC<IMovingMaterialModalForm> = ({
  materialId,
  materialName,
  unit_name,
  unit_is_precision_point,
  warehouseOutgoing,
  maxQuantity,
  price,
  open,
  onOk,
  onCancel,
}) => {
  const DataTurnoverService = new TurnoverService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormMovingTurnoverInputs>({
    defaultValues: {
      warehouse_outgoing: warehouseOutgoing,
      warehouse_incoming: undefined,
      quantity: 0.0,
      price: price.toFixed(2),
      sum: 0.0,
    },
  });

  React.useEffect(() => {
    register("warehouse_outgoing");
    register("warehouse_incoming", { required: "Выберите склад назначения!" });
    register("quantity", {
      validate: (value) => {
        if (value > 0) return true;
        return "Количество должно быть больше 0";
      },
    });
    register("price");
    register("sum");
  }, []);

  const onSubmit = (data: IFormMovingTurnoverInputs) => {
    const moving_data: TurnoverMovingMaterialType = {
      material: materialId,
      date: moment().format("DD.MM.YYYY"),
      warehouse_outgoing: data.warehouse_outgoing,
      warehouse_incoming: data.warehouse_incoming,
      quantity: data.quantity,
      price: Number(data.price),
      sum: Number(data.sum),
    };

    const onSuccess = () => {
      onOk();
    };
    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    showConfirmDialog({
      title: `Перемещение нельзя в дальнейшем удалить или редактировать`,
      okText: "Продолжить",
      cancelText: "Назад",
      okType: "primary",
      onOk: () => {
        DataTurnoverService.movingMaterial(moving_data).then(onSuccess).catch(onFailed);
      },
      onCancel: () => {},
    });
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  const calcSum = () => {
    const sum = watch("quantity") * Number(watch("price"));
    setValue("sum", sum.toFixed(2));
  };

  return (
    <>
      <Modal
        title={`Перемещение "${materialName}"`}
        width={750}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Применить"
      >
        <Form layout="vertical">
          <Space>
            <Form.Item label="Откуда">
              <SelectWarehouseForm name="warehouse_outgoing" width="185px" disable control={control} />
            </Form.Item>
            <Form.Item
              label="Куда"
              required
              validateStatus={errors.warehouse_incoming ? "error" : "success"}
              help={errors.warehouse_incoming ? errors.warehouse_incoming.message : null}
            >
              <SelectWarehouseForm
                disableOption={[warehouseOutgoing]}
                name="warehouse_incoming"
                width="185px"
                control={control}
              />
            </Form.Item>
            <Form.Item
              label={`Кол-во, ${unit_name}`}
              required
              validateStatus={errors.quantity ? "error" : "success"}
              help={errors.quantity ? errors.quantity.message : null}
            >
              <InputNumberForm
                name="quantity"
                width="95px"
                max={maxQuantity}
                precision={unit_is_precision_point ? 2 : 0}
                onChange={(_) => calcSum()}
                control={control}
              />
            </Form.Item>
            <Form.Item label="Цена">
              <InputForm name="price" width="110px" disabled control={control} />
            </Form.Item>
            <Form.Item label="Сумма">
              <InputForm name="sum" disabled width="110px" control={control} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default MovingMaterialModalForm;
