import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { CarType, CarWriteType } from "../../services/types";
import CarService from "../../services/CarService";
import { IFormCarInputs } from "../interface";
import InputForm from "./components/InputForm";
import DatePickerForm from "./components/DatePickerForm";
import moment from "moment";
import showConfirmDialog from "../common/ConfirmDialog";

interface ICarModalForm {
  pk: number;
  open: boolean;
  onOk: (category: CarType) => void;
  onCancel: () => void;
}

const CarModalForm: React.FC<ICarModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataCarService = new CarService();

  const [carData, setCarData] = React.useState<CarType>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormCarInputs>({
    defaultValues: {
      name: "",
      state_number: "",
      date_decommissioned: undefined,
    },
  });

  React.useEffect(() => {
    register("name", { required: "Введите наименование ТС!" });
    register("state_number");
    register("date_decommissioned");

    if (pk) {
      const onDataLoaded = (data: CarType) => {
        setValue("name", data.name);
        setValue("state_number", data.state_number);
        setValue(
          "date_decommissioned",
          data.date_decommissioned ? moment(data.date_decommissioned, "DD.MM.YYYY h:mm:") : undefined
        );

        setCarData(data);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataCarService.getCar(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormCarInputs) => {
    if (carData?.name !== data.name && carData?.has_tag_material) {
      showConfirmDialog({
        title: "Обновить наименование в совместимости материалов?",
        content: `У всех материалов в совместимости "${carData?.name}" будет изменен на "${data.name}"`,
        okText: "Да",
        cancelText: "Нет",
        okType: "primary",
        onOk: () => {
          onSave(data, true);
        },
        onCancel: () => {
          onSave(data, false);
        },
      });
    } else {
      onSave(data, false);
    }
  };

  const onSave = (data: IFormCarInputs, change_tags_in_material: boolean) => {
    const carData: CarWriteType = {
      name: data.name,
    };

    const onSuccess = (data: CarType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    DataCarService.updateCar(pk, carData, { change_tags_in_material }).then(onSuccess).catch(onFailed);
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={"Редактирование ТС"}
        width={450}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={"Изменить"}
      >
        <Form layout="vertical">
          <Form.Item
            label="Наименование"
            required
            validateStatus={errors.name ? "error" : "success"}
            help={errors.name ? errors.name.message : null}
          >
            <InputForm name="name" maxLength={64} control={control} />
          </Form.Item>
          <Form.Item label="Гос. номер">
            <InputForm name="state_number" disabled control={control} />
          </Form.Item>
          <Form.Item label="Дата списания">
            <DatePickerForm name="date_decommissioned" placeholder="" disable control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CarModalForm;
