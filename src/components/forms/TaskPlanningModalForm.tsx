import React from "react";
import { Button, Checkbox, Form, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { CarTaskType, CarTaskUpdateType } from "../../services/types";
import CarTaskService from "../../services/CarTaskService";
import { ICarTaskInputs } from "../interface";
import moment from "moment";
import SelectCarForm from "./components/SelectCarForm";
import TextAreaForm from "./components/TextAreaForm";
import DatePickerForm from "./components/DatePickerForm";
import showConfirmDialog from "../common/ConfirmDialog";

interface ICarTaskModalForm {
  pk: number | null;
  open: boolean;
  car?: number;
  order?: number;
  onOk: () => void;
  onCancel: () => void;
}

const CarTaskModalForm: React.FC<ICarTaskModalForm> = ({ pk, open, car, order, onOk, onCancel }) => {
  const CarTaskServiceService = new CarTaskService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm<ICarTaskInputs>({
    defaultValues: {
      car: car,
      description: "",
      materials: "",
      is_completed: false,
      date_completed: undefined,
    },
  });

  React.useEffect(() => {
    register("car", { required: "Введите ТС!" });
    register("description", { required: "Введите описание!" });
    register("materials");
    register("is_completed");
    register("date_completed");

    if (pk) {
      const onDataLoaded = (data: CarTaskType) => {
        setValue("car", data.car);
        setValue("description", data.description);
        setValue("materials", data.materials);
        setValue("is_completed", data.is_completed);
        setValue("date_completed", data.date_completed ? moment(data.date_completed, "DD.MM.YYYY h:mm:") : null);
      };

      const onError = (error: any) => {
        alert(error);
      };

      CarTaskServiceService.getCarTask(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: ICarTaskInputs) => {
    const taskPlanningData: CarTaskType = {
      pk: pk,
      order: order,
      car: data.car,
      description: data.description,
      materials: data.materials,
      is_completed: data.is_completed,
      date_completed: data.date_completed ? data.date_completed.format("DD.MM.YYYY") : null,
    };

    const onSuccess = (data: CarTaskType) => {
      onOk();
    };

    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    if (action === ActionTypes.EDIT && pk) {
      CarTaskServiceService.updateCarTask(pk, taskPlanningData as CarTaskUpdateType)
        .then(onSuccess)
        .catch(onFailed);
    } else {
      CarTaskServiceService.createCarTask(taskPlanningData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  const handleRemoveTask = () => {
    showConfirmDialog({
      title: `Вы уверены, что хотите удалить задачу?`,
      onOk: () => {
        if (pk) {
          CarTaskServiceService.deleteCarTask(pk)
            .then(() => {
              onOk();
            })
            .catch((error) => {
              alert(error);
            });
        }
      },
      onCancel: () => {},
    });
  };

  const showDateCompleted = watch("is_completed");

  const showRemoveButton = action === ActionTypes.EDIT && !watch("is_completed") && !order;
  const disableCarSelect = car !== undefined;

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новая задача" : "Редактирование задачи"}
        width={450}
        open={open}
        onCancel={onCancel}
        footer={[
          <Button
            danger
            key="delete"
            type="primary"
            style={{
              display: showRemoveButton ? "inherit" : "none",
              float: "left",
            }}
            onClick={handleRemoveTask}
          >
            Удалить
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {action === ActionTypes.ADD ? "Добавить" : "Изменить"}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="ТС" required validateStatus={errors.car ? "error" : "success"}>
            <SelectCarForm name="car" control={control} dateRequest={moment()} disabled={disableCarSelect} />
          </Form.Item>
          <Form.Item label="Описание" required>
            <TextAreaForm name="description" rows={2} control={control} />
          </Form.Item>
          <Form.Item label="Материалы">
            <TextAreaForm name="materials" rows={2} control={control} />
          </Form.Item>
          {pk && (
            <Form.Item>
              <Form.Item style={{ display: "inline-block" }}>
                <Controller
                  name="is_completed"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);

                        if (e.target.checked === true) {
                          setValue("date_completed", moment());
                        } else {
                          setValue("date_completed", undefined);
                        }
                      }}
                    >
                      Выполнена
                    </Checkbox>
                  )}
                />
              </Form.Item>
              {showDateCompleted && (
                <Form.Item style={{ display: "inline-block" }}>
                  <DatePickerForm name="date_completed" control={control} disable />
                </Form.Item>
              )}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default CarTaskModalForm;
