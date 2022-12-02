import React from "react";
import { Button, Col, Form, Modal, Row, Tabs } from "antd";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../../helpers/types";
import UserContext from "../../../helpers/UserContext";
import OrderService from "../../../services/OrderService";
import CarService from "../../../services/CarService";
import { CarType, OrderType } from "../../../services/types";
import SelectOrderStatusForm from "../../forms/components/SelectOrderStatusForm";
import DateTimePickerForm from "../../forms/components/DateTimePickerForm";
import SelectEmployeeForm from "../../forms/components/SelectEmployeeForm";
import SelectReasonForm from "../../forms/components/SelectReasonForm";
import SelectPostForm from "../../forms/components/SelectPostFrom";
import SelectCarForm from "../../forms/components/SelectCarFrom";
import InputForm from "../../forms/components/InputForm";
import TextAreaForm from "../../forms/components/TextAreaForm";
import InputNumberForm from "../../forms/components/InputNumberForm";
import showConfirmDialog from "../../common/ConfirmDialog";
import { Status } from "../../../helpers/constants";
import { IFormOrderInputs } from "../../interface";
import { formToOrderData, hasChangeOrderForm } from "../../../helpers/formUtils";
import TableOrderWorksForm from "./TableOrderWorksForm";
import TableOrderMaterialsForm from "./TableOrderMaterialsForm";

interface IOrderModalForm {
  orderPk: number | null;
  open: boolean;
  actionForm: ActionTypes;
  readOnlyMode?: boolean;
  handleOk: () => void;
  handleCancel: (update: boolean) => void;
}

const OrderModalForm: React.FC<IOrderModalForm> = ({
  orderPk,
  open,
  actionForm,
  handleOk,
  handleCancel,
  readOnlyMode = false,
}) => {
  const user = React.useContext(UserContext);

  const DataOrderService = new OrderService();
  const DataCarService = new CarService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormOrderInputs>({
    defaultValues: {
      status: Status.REQUEST,
      date_begin: null,
      date_end: null,
      responsible: null,
      driver: null,
      post: null,
      odometer: null,
      note: "",
      works: [],
      materials: [],
    },
  });
  const [pk, setPk] = React.useState<number | null>(orderPk);
  const [action, setAction] = React.useState<ActionTypes>(actionForm);
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [orderData, setOrderData] = React.useState<OrderType>();
  const [saveFlag, setSaveFlag] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    register("status");
    register("date_begin", { required: "Выберите дату!" });
    register("date_end");
    register("responsible");
    register("driver");
    register("reason", { required: "Выберите причину!" });
    register("post");
    register("car", { required: "Выберите гос номер!" });
    register("car_name");
    register("odometer");
    register("note");
    register("works");
    register("materials");

    if (action === ActionTypes.EDIT && pk) {
      const onDataLoaded = (data: OrderType) => {
        data.car = data.car === null ? -1 : data.car;

        setOrderData(data);
        setOrderForm(data);
      };

      const onError = (error: any) => {
        alert(error);
      };

      const onFinaly = () => {
        setLoading(false);
      };

      DataOrderService.getOrder(pk).then(onDataLoaded).catch(onError).finally(onFinaly);
    } else {
      setLoading(false);
    }
  }, []);

  const setOrderForm = (data: OrderType) => {
    setValue("status", data.status);
    setValue("date_begin", moment(data.date_begin, "DD.MM.YYYY h:mm:"));
    setValue("date_end", data.date_end ? moment(data.date_end, "DD.MM.YYYY h:mm:") : null);
    setValue("responsible", data.responsible);
    setValue("driver", data.driver);
    setValue("reason", data.reason);
    setValue("post", data.post);
    setValue("car", data.car === null ? -1 : data.car);
    setValue("car_name", data.car_name || "");
    setValue("odometer", data.odometer);
    setValue("note", data.note);
    setValue("works", data.order_works);
    setValue("materials", data.turnovers_from_order);
  };

  const getTitle = () => {
    return (
      <div>
        {(orderData?.pk as unknown as boolean) ? (
          <span>
            <span>{`Заказ-наряд №${orderData?.number}`}</span>
            <span
              style={{ marginLeft: "20px", color: "#BFBFBF", fontSize: "12px" }}
            >{`создан: ${orderData?.created}`}</span>{" "}
          </span>
        ) : (
          <span>Новый заказ-наряд</span>
        )}
        <Button size="small" style={{ marginLeft: "30px" }} onClick={onPrint}>
          В Excel
        </Button>
      </div>
    );
  };

  const complotedValidation = (data: IFormOrderInputs) => {
    let is_error = false;

    if (data.status != Status.COMPLETED) {
      return is_error;
    }

    if (data.date_end === null || data.date_end === undefined) {
      setError("date_end", { type: "custom", message: "Заполните дату завершения!" });
      is_error = true;
    }

    if (data.responsible === null || data.responsible === undefined) {
      setError("responsible", { type: "custom", message: "Выберите ответственного!" });
      is_error = true;
    }

    return is_error;
  };

  const onSubmit = (data: IFormOrderInputs, withoutClose = false, callback?: any) => {
    if (complotedValidation(data)) {
      return;
    }

    setConfirmLoading(true);

    const orderData = formToOrderData(data);

    const onSuccess = (data: OrderType) => {
      setConfirmLoading(false);
      if (withoutClose) {
        setOrderData(data);
        setOrderForm(data);
        setSaveFlag(true);

        if (pk === null) {
          setPk(data.pk || null);
          setAction(ActionTypes.EDIT);
        }

        if (callback) callback();
      } else {
        handleOk();
      }
    };

    const onFailed = (error: any) => {
      setConfirmLoading(false);
      alert(error);
    };

    if (action === ActionTypes.EDIT && pk) {
      DataOrderService.updateOrder(pk, orderData).then(onSuccess).catch(onFailed);
    } else {
      DataOrderService.createOrder(orderData).then(onSuccess).catch(onFailed);
    }
  };

  const onOk = (withoutClose = false, callback?: any) => {
    handleSubmit((data: IFormOrderInputs) => onSubmit(data, withoutClose, callback))();
  };

  const onCancel = () => {
    if (orderData && hasChangeOrderForm(orderData, watch())) {
      showConfirmDialog({
        title: "В заказ-наряде были внесены изменения, сохранить?",
        onOk: () => {
          onOk();
        },
        onCancel: () => {
          handleCancel(saveFlag);
        },
      });
    } else {
      handleCancel(saveFlag);
    }
  };

  const onRemoveOrder = () => {
    showConfirmDialog({
      title: `Вы уверены, что хотите удалить заказ-наряд №${orderData?.number}?`,
      onOk: () => {
        if (orderData?.pk) {
          DataOrderService.deleteOrder(orderData.pk)
            .then(() => {
              handleOk();
            })
            .catch((error) => {
              alert(error);
            });
        }
      },
      onCancel: () => {},
    });
  };

  const onPrint = () => {
    const toExcel = () => {
      DataOrderService.exportToExcel({ pk })
        .then((data) => {
          const link = document.createElement("a");
          link.href = data.file;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
        })
        .catch((error) => {
          alert(error);
        });
    };

    if (pk) {
      onOk(true, toExcel);
    } else {
      toExcel();
    }
  };

  const onChangeDateEnd = (date: moment.Moment, dateString: string) => {
    if (date <= moment()) {
      setValue("status", Status.COMPLETED);
    }
  };

  const onChangeCar = (value: any, option: any) => {
    if (value === -1) {
      setValue("car_name", "");
      setValue("driver", null);
      setValue("odometer", null);
    } else {
      DataCarService.getCar(value)
        .then((data: CarType) => {
          setValue("car_name", data.name);
          setValue("driver", data.driver_pk);
        })
        .catch((error) => alert(error));
    }
  };

  const isShowRemoveButton = (): boolean => {
    return pk !== null && (user?.is_superuser || Number(watch("status")) === Status.REQUEST);
  };

  const edit_access = user ? user.edit_access : false;
  const is_superuser = user ? user.is_superuser : false;
  const editMode: boolean = (edit_access && orderData?.status !== Status.COMPLETED && !readOnlyMode) || is_superuser;

  const dateRequestData = watch("date_begin");
  const defaultCompatbility = watch("car_name");
  const withoutCar = watch("car") === -1;

  let is_decommissioned_materials = false;
  if (orderPk !== null && orderData?.turnovers_from_order) {
    for (const material of orderData.turnovers_from_order) {
      if (material.pk !== null) {
        is_decommissioned_materials = true;
      }
    }
  }

  return (
    <Modal
      title={getTitle()}
      open={open && !loading}
      onCancel={onCancel}
      maskClosable={false}
      width={900}
      footer={
        editMode
          ? [
              <Button
                danger
                key="delete"
                type="primary"
                disabled={is_decommissioned_materials}
                style={{
                  display: isShowRemoveButton() ? "inherit" : "none",
                  float: "left",
                }}
                onClick={onRemoveOrder}
              >
                Удалить
              </Button>,
              <Button key="save" type="primary" loading={confirmLoading} onClick={() => onOk(true)}>
                Сохранить
              </Button>,
              <Button key="submit" type="primary" loading={confirmLoading} onClick={() => onOk()}>
                Сохранить и выйти
              </Button>,
            ]
          : [
              <span
                style={{
                  display: readOnlyMode && orderData?.status !== Status.COMPLETED ? "inherit" : "none",
                  float: "left",
                  color: "red",
                }}
              >
                Редактирование возможно только открыв из модуля "Заказ-наряды"
              </span>,
              <Button key="close" onClick={onCancel}>
                Закрыть
              </Button>,
            ]
      }
    >
      <Form layout="vertical" disabled={!editMode}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Статус">
              <SelectOrderStatusForm name="status" control={control} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Дата начала" required validateStatus={errors.date_begin ? "error" : "success"}>
              <DateTimePickerForm name="date_begin" control={control} required width={"199px"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Дата завершения" validateStatus={errors.date_end ? "error" : "success"}>
              <DateTimePickerForm name="date_end" control={control} width={"199px"} onChange={onChangeDateEnd} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Ответственный" validateStatus={errors.responsible ? "error" : "success"}>
              <SelectEmployeeForm name="responsible" control={control} type={[3]} dateRequest={dateRequestData} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Гос. №" required validateStatus={errors.car ? "error" : "success"}>
              <SelectCarForm
                name="car"
                control={control}
                onChange={onChangeCar}
                dateRequest={dateRequestData}
                addWithoutCar
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Марка и модель">
              <InputForm
                name="car_name"
                control={control}
                disabled
                placeholder={withoutCar ? "-" : "Заполнится автоматически при выборе гос. №"}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Пробег">
              <InputNumberForm name="odometer" controls={false} disable={withoutCar} control={control} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Водитель">
              <SelectEmployeeForm
                name="driver"
                control={control}
                type={[1]}
                disable={withoutCar}
                dateRequest={dateRequestData}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Причина" required validateStatus={errors.reason ? "error" : "success"}>
              <SelectReasonForm name="reason" control={control} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Пост">
              <SelectPostForm name="post" control={control} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="Примечание">
              <TextAreaForm name="note" control={control} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Tabs defaultActiveKey="1" style={{ padding: "0px" }}>
        <Tabs.TabPane tab="Работы" key="1">
          <Form.Item>
            <TableOrderWorksForm name="works" control={control} editMode={editMode} dateRequest={dateRequestData} />
          </Form.Item>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Материалы" key="2">
          <Form.Item>
            <TableOrderMaterialsForm
              name="materials"
              control={control}
              editMode={editMode}
              defaultCompatbility={defaultCompatbility}
            />
          </Form.Item>
        </Tabs.TabPane>
        <Tabs.TabPane disabled tab="Диагностика" key="3">
          In development!
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default OrderModalForm;
