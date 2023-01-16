import React from "react";
import { Button, Checkbox, Table } from "antd";
import {
  ResultResursePagation,
  CarTaskListType,
  CarTaskType,
  CarTaskUpdateType,
} from "../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { CloseOutlined } from "@ant-design/icons";
import showConfirmDialog from "../../common/ConfirmDialog";
import moment from "moment";
import CarTaskService from "../../../services/CarTaskService";
import { ActionTypes } from "../../../helpers/types";
import CarTaskModalForm from "../../forms/TaskPlanningModalForm";

interface ITableOrderTasks {
  order: number | null;
  car: number | null;
  editMode: boolean;
  onChangeTaskCount: () => void;
}

const TableOrderTasks: React.FC<ITableOrderTasks> = ({ order, car, editMode, onChangeTaskCount }) => {
  const DataTaskPlanningService = new CarTaskService();

  const [openTaskPlanningModal, setOpenTaskPlanningModal] = React.useState<boolean>(false);
  const [modalAction, setModalAction] = React.useState<ActionTypes>(ActionTypes.ADD);
  const [editPk, setEditPk] = React.useState<number | null>(null);

  const [dataSource, setDataSource] = React.useState<CarTaskListType[]>([]);
  const [update, setUpdate] = React.useState<boolean>(false);

  // Обновление при изменеии ТС
  React.useEffect(() => {
    if (car !== null && car > 0) {
      loadingData();
    }
  }, [car]);

  // Обновление при изменеии в самой таблице
  React.useEffect(() => {
    if (update === true) {
      loadingData();
    }
  }, [update]);

  const loadingData = () => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<CarTaskListType>) => {
      // В заказ-наряде отображаем только первые 50 задач по ТС
      setDataSource(results);
    };

    const onError = () => {
      setDataSource([]);
    };

    const onFinally = () => {
      setUpdate(false);
    };

    const params = { car: car, order_created: order ? order : undefined };

    DataTaskPlanningService.getCarsTasks(params).then(onDataLoaded).catch(onError).finally(onFinally);
  };

  const handleRemoveTask = (pk: number) => {
    if (pk) {
      const index = dataSource.findIndex((item) => pk === item.pk);

      showConfirmDialog({
        title: `Вы уверены, что хотите удалить задачу "${dataSource[index].description}"?`,
        onOk: () => {
          if (pk) {
            DataTaskPlanningService.deleteCarTask(pk)
              .then(() => {
                setUpdate(true);
                onChangeTaskCount();
              })
              .catch((error) => {
                alert(error);
              });
          }
        },
        onCancel: () => {},
      });
    }
  };

  const setCompletedTask = (pk: number, is_completed: boolean) => {
    const taskPlanningData: CarTaskUpdateType = {
      pk: pk,
      is_completed: is_completed,
      date_completed: is_completed ? moment().format("DD.MM.YYYY") : null,
    };

    const onSuccess = (data: CarTaskType) => {
      const index = dataSource.findIndex((item) => item.pk === pk);
      if (index >= 0) {
        dataSource[index] = {
          ...dataSource[index],
          is_completed: data.is_completed,
          date_completed: data.date_completed,
        } as CarTaskListType;

        setDataSource([...dataSource]);
        onChangeTaskCount();
      }
    };

    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    DataTaskPlanningService.updateCarTask(pk, taskPlanningData).then(onSuccess).catch(onFailed);
  };

  const showModal = () => {
    setOpenTaskPlanningModal((prevOpenTaskPlanningModal) => !prevOpenTaskPlanningModal);
  };

  const handleAdd = () => {
    setModalAction(ActionTypes.ADD);
    showModal();
  };

  const handleEdit = (pk: number) => {
    setEditPk(pk);
    setModalAction(ActionTypes.EDIT);
    showModal();
  };

  const handleOk = () => {
    showModal();
    setUpdate(true);

    onChangeTaskCount();
  };

  const handleCancel = () => {
    showModal();
  };

  const columns: ColumnsType<CarTaskListType> = [
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: 30,
      render: (_, record) =>
        editMode &&
        order &&
        order === record.order &&
        !record.is_completed && (
          <Button className="action-button" type="link" onClick={() => handleRemoveTask(record.pk)}>
            <CloseOutlined />
          </Button>
        ),
    },
    {
      title: "Дата",
      dataIndex: "created",
      key: "created",
      width: 110,
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Необходимые материалы",
      dataIndex: "materials",
      key: "materials",
    },
    {
      title: "Выполнена",
      key: "is_completed",
      dataIndex: "is_completed",
      width: 110,
      render: (text, record) => (
        <span>
          <Checkbox checked={record.is_completed} onChange={(e) => setCompletedTask(record.pk, e.target.checked)} />
        </span>
      ),
    },
  ];

  const disable_add_button = !editMode || car === null || order == null;

  return (
    <>
      {openTaskPlanningModal && (
        <CarTaskModalForm
          pk={modalAction === ActionTypes.EDIT ? editPk : null}
          open={openTaskPlanningModal}
          car={car ? car : undefined}
          order={order ? order : undefined}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      )}
      <Button type="primary" size="small" disabled={disable_add_button} onClick={handleAdd}>
        Добавить задачу
      </Button>

      <Table
        className="table-order-works mt-10"
        size="small"
        rowClassName={() => "editable-row"}
        onRow={(record, rowIndex) => {
          return {
            style: order && record.order === order ? { backgroundColor: "#cfe8fc" } : {},
            onDoubleClick: (event) => {
              if (order && record.order === order) {
                handleEdit(record.pk);
              }
            },
          };
        }}
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => `${record.description}`}
        pagination={false}
        scroll={{ y: 160 }}
        locale={{
          emptyText: "Нет задач",
        }}
      />
    </>
  );
};

export default TableOrderTasks;
