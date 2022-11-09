import React from "react";
import { Button, Col, Form, Modal, Row } from "antd";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../../helpers/types";
import EntranceService from "../../../services/EntranceService";
import { EntranceType } from "../../../services/types";
import DatePickerForm from "../../forms/components/DatePickerForm";
import SelectEmployeeForm from "../../forms/components/SelectEmployeeForm";
import InputForm from "../../forms/components/InputForm";
import TextAreaForm from "../../forms/components/TextAreaForm";
import showConfirmDialog from "../../common/ConfirmDialog";
import { IFormEntranceInputs } from "../../interface";
import InputProviderForm from "../../forms/components/InputProviderForm";
import TableEntranceMaterialsForm from "./TableEntranceMaterialsForm";

interface IEntranceModalForm {
  entrance_pk: number | null;
  open: boolean;
  action: ActionTypes;
  readOnlyMode?: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

const EntranceModalForm: React.FC<IEntranceModalForm> = ({
  entrance_pk,
  open,
  action,
  handleOk,
  handleCancel,
  readOnlyMode,
}) => {
  const DataEntranceService = new EntranceService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<IFormEntranceInputs>({
    defaultValues: {
      date: null,
      document_number: "",
      responsible: undefined,
      provider: "",
      note: "",
      materials: [],
    },
  });

  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [entranceData, setEntranceData] = React.useState<EntranceType>();

  React.useEffect(() => {
    register("date", { required: "Выберите дату!" });
    register("document_number");
    register("responsible", { required: "Выберите кто оприходовал!" });
    register("provider");
    register("note");
    register("materials");

    if (action === ActionTypes.EDIT && entrance_pk) {
      const onDataLoaded = (data: EntranceType) => {
        setEntranceData(data);
        setOrderForm(data);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataEntranceService.getEntrance(entrance_pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const setOrderForm = (data: EntranceType) => {
    setValue("date", moment(data.date, "DD.MM.YYYY h:mm:"));
    setValue("document_number", data.document_number);
    setValue("responsible", data.responsible);
    setValue("provider", data.provider);
    setValue("note", data.note);
    setValue("materials", data.turnovers_from_entrance);
  };

  const getTitle = () => {
    return (
      <div>
        {(entranceData?.pk as unknown as boolean) ? (
          <span>{`Поступление ${entranceData?.date} ${entranceData?.provider && " от " + entranceData.provider}`}</span>
        ) : (
          <span>Новое поступление</span>
        )}
      </div>
    );
  };

  const onSubmit = (data: IFormEntranceInputs) => {
    if (isNewTurnovesMaterials(data)) {
      showConfirmDialog({
        title: "Добавленные материалы нельзя в дальнейшем удалить или редактировать",
        okText: "Продолжить",
        cancelText: "Назад",
        okType: "primary",
        onOk: () => {
          onSave(data);
        },
        onCancel: () => {},
      });
    } else {
      onSave(data);
    }
  };

  const onSave = (data: IFormEntranceInputs) => {
    setConfirmLoading(true);

    const date = data.date ? data.date.format("DD.MM.YYYY") : null;

    const entranceData: EntranceType = {
      pk: entrance_pk,
      date: date,
      document_number: data.document_number,
      responsible: data.responsible,
      provider: data.provider,
      note: data.note,
      turnovers_from_entrance: data.materials.map((material) => ({
        ...material,
        date: date,
        sum: parseFloat((material.quantity * material.price).toFixed(2)),
      })),
    };

    const onSuccess = (data: EntranceType) => {
      setConfirmLoading(false);
      handleOk();
    };

    const onFailed = (error: any) => {
      setConfirmLoading(false);
      alert(error);
    };

    if (action === ActionTypes.EDIT && entrance_pk) {
      DataEntranceService.updateEntrance(entrance_pk, entranceData).then(onSuccess).catch(onFailed);
    } else {
      DataEntranceService.createEntrance(entranceData).then(onSuccess).catch(onFailed);
    }
  };

  const onOk = () => {
    handleSubmit((data: IFormEntranceInputs) => onSubmit(data))();
  };

  const onCancel = () => {
    handleCancel();
  };

  const onRemoveEntrance = () => {
    showConfirmDialog({
      title: `Вы уверены, что хотите удалить поступление?`,
      onOk: () => {
        if (entranceData?.pk) {
          DataEntranceService.deleteEntrance(entranceData.pk)
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

  const isNewTurnovesMaterials = (data: IFormEntranceInputs): boolean => {
    let is_new_materials = false;

    if (data?.materials) {
      for (const material of data.materials) {
        if (material.pk === null) {
          is_new_materials = true;
        }
      }
    }
    return is_new_materials;
  };

  const dateRequestData = watch("date");

  let is_material_saved = false;
  if (entrance_pk !== null && entranceData?.turnovers_from_entrance) {
    for (const material of entranceData.turnovers_from_entrance) {
      if (material.pk !== null) {
        is_material_saved = true;
      }
    }
  }

  return (
    <Modal
      title={getTitle()}
      open={open}
      onCancel={onCancel}
      maskClosable={false}
      width={900}
      footer={
        !readOnlyMode
          ? [
              <Button
                danger
                key="delete"
                type="primary"
                style={{
                  display: !is_material_saved ? "inherit" : "none",
                  float: "left",
                }}
                onClick={onRemoveEntrance}
              >
                Удалить
              </Button>,
              <Button key="submit" type="primary" loading={confirmLoading} onClick={() => onOk()}>
                {entrance_pk ? "Изменить" : "Добавить"}
              </Button>,
            ]
          : [
              <span
                style={{
                  display: readOnlyMode ? "inherit" : "none",
                  float: "left",
                  color: "red",
                }}
              >
                Редактирование возможно только открыв из раздела "Поступления"
              </span>,
              <Button key="close" onClick={onCancel}>
                Закрыть
              </Button>,
            ]
      }
    >
      <Form layout="vertical" disabled={readOnlyMode}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Дата" required validateStatus={errors.date ? "error" : "success"}>
              <DatePickerForm name="date" control={control} required disable={is_material_saved} width={"199px"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="№ документа">
              <InputForm name="document_number" control={control} maxLength={64} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Поставщик">
              <InputProviderForm name="provider" control={control} maxLength={128} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Кто оприходовал" required validateStatus={errors.responsible ? "error" : "success"}>
              <SelectEmployeeForm name="responsible" control={control} type={3} dateRequest={dateRequestData} />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label="Примечание">
              <TextAreaForm name="note" rows={1} control={control} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Form.Item>
        <TableEntranceMaterialsForm name="materials" readOnlyMode={readOnlyMode} control={control} />
      </Form.Item>
    </Modal>
  );
};

export default EntranceModalForm;
