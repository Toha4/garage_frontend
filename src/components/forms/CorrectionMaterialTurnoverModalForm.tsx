import React from "react";
import { Form, Modal, Space } from "antd";
import { useForm } from "react-hook-form";
import { MaterialCategoryType, PricesType, TurnoverType, WarehousesAvailability } from "../../services/types";
import TurnoverService from "../../services/TurnoverService";
import { IFormCorrectionTurnoverInputs } from "../interface";
import InputForm from "./components/InputForm";
import SelectTypeTurnoverForm from "./components/SelectTypeTurnoverForm";
import SelectWarehouseForm from "./components/SelectWarehouseForm";
import InputNumberForm from "./components/InputNumberForm";
import InputPriceAutoCompleteForm from "./components/InputPriceAutoCompleteForm";
import TextAreaForm from "./components/TextAreaForm";
import moment from "moment";
import showConfirmDialog from "../common/ConfirmDialog";

interface ICorrectionMaterialTurnoverModalForm {
  materialId: number;
  materialName: string;
  unit_name: string;
  unit_is_precision_point: boolean;
  warehousesAvailability: WarehousesAvailability[];
  prices: PricesType;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const CorrectionMaterialTurnoverModalForm: React.FC<ICorrectionMaterialTurnoverModalForm> = ({
  materialId,
  materialName,
  unit_name,
  unit_is_precision_point,
  warehousesAvailability,
  prices,
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
  } = useForm<IFormCorrectionTurnoverInputs>({
    defaultValues: {
      type: undefined,
      warehouse: undefined,
      quantity: 0.0,
      price: 0.0,
      sum: 0.0,
      note: "",
    },
  });

  React.useEffect(() => {
    register("type", { required: "Выберите тип!" });
    register("warehouse", { required: "Выберите склад!" });
    register("quantity", {
      validate: (value) => {
        if (value > 0) return true;
        return "Количество должно быть больше 0";
      },
    });
    register("price", {
      validate: (value) => {
        if (value > 0) return true;
        return "Цена должна быть больше 0";
      },
    });
    register("sum");
    register("note", { required: "Напишите причину корректировки!" });
  }, []);

  const warehousesAvailabilityId = warehousesAvailability.map((item) => item.warehouse);

  const onSubmit = (data: IFormCorrectionTurnoverInputs) => {
    const turnoverData: TurnoverType = {
      pk: null,
      type: Number(data.type),
      is_correction: true,
      date: moment().format("DD.MM.YYYY"),
      material: materialId,
      warehouse: data.warehouse,
      quantity: data.quantity,
      price: Number(data.price),
      sum: Number(data.sum),
      note: data.note,
    };

    const onSuccess = (data: MaterialCategoryType) => {
      onOk();
    };
    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    showConfirmDialog({
      title: `Корректировку нельзя в дальнейшем удалить или редактировать`,
      okText: "Продолжить",
      cancelText: "Назад",
      okType: "primary",
      onOk: () => {
        DataTurnoverService.createReason(turnoverData).then(onSuccess).catch(onFailed);
      },
      onCancel: () => {},
    });
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  const handleChangeType = (value: any, option: any) => {
    if (value == 2 && !warehousesAvailabilityId.includes(watch("warehouse"))) {
      resetField("warehouse");
    }
  };

  const calcSum = () => {
    const sum = watch("quantity") * watch("price");
    setValue("sum", sum.toFixed(2));
  };

  const activeOptionWarehouse = watch("type") == 2 ? warehousesAvailabilityId : undefined;

  let maxQuantity: number | undefined = undefined;
  if (watch("type") == 2 && watch("warehouse") > 0) {
    maxQuantity = warehousesAvailability.find((item) => item.warehouse === watch("warehouse"))?.quantity || 0.0;
  }

  let priceOption: { label: string; value: string }[] = [];
  if (prices.last_price > 0.0) {
    priceOption.push({
      label: `${prices.last_price.toFixed(2)} - последняя цена`,
      value: prices.last_price.toFixed(2),
    });
  }
  if (watch("type") == 2 && prices.average_price > 0.0) {
    priceOption.push({
      label: `${prices.average_price.toFixed(2)} - средняя цена`,
      value: prices.average_price.toFixed(2),
    });
  }

  return (
    <>
      <Modal
        title={`Корректировка "${materialName}"`}
        width={750}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Применить"
      >
        <Form layout="vertical">
          <Space>
            <Form.Item
              label="Тип"
              required
              validateStatus={errors.type ? "error" : "success"}
              help={errors.type ? errors.type.message : null}
            >
              <SelectTypeTurnoverForm name="type" width="95px" control={control} onChange={handleChangeType} />
            </Form.Item>
            <Form.Item
              label="Склад"
              required
              validateStatus={errors.warehouse ? "error" : "success"}
              help={errors.warehouse ? errors.warehouse.message : null}
            >
              <SelectWarehouseForm
                name="warehouse"
                width="185px"
                activeOptions={activeOptionWarehouse}
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
            <Form.Item
              label="Цена"
              required
              validateStatus={errors.price ? "error" : "success"}
              help={errors.price ? errors.price.message : null}
            >
              <InputPriceAutoCompleteForm
                name="price"
                width="200px"
                prices_options={priceOption}
                onChange={(_) => calcSum()}
                control={control}
              />
            </Form.Item>
            <Form.Item label="Сумма">
              <InputForm name="sum" disabled width="110px" control={control} />
            </Form.Item>
          </Space>
          <Form.Item
            label="Примечание"
            required
            validateStatus={errors.note ? "error" : "success"}
            help={errors.note ? errors.note.message : null}
          >
            <TextAreaForm name="note" control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CorrectionMaterialTurnoverModalForm;
