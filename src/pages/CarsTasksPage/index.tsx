import React from "react";
import { Button, Checkbox, Table } from "antd";
import UserContext from "../../helpers/UserContext";
import { ColumnsType } from "antd/lib/table";
import { CarTaskListType, ResultResursePagation, CarTaskUpdateType, CarTaskType } from "../../services/types";
import CarTaskService from "../../services/CarTaskService";
import { ITableParams } from "../../components/interface";
import CarsTasksFilter from "./CarsTasksFilter";
import { ActionTypes } from "../../helpers/types";
import CarTaskModalForm from "../../components/forms/TaskPlanningModalForm";
import moment from "moment";

const TableParamsDefault: ITableParams = {
  pagination: {},
  sortField: undefined,
  sortOrder: undefined,
  filters: {},
  search: {},
};

const CarsTasksPage: React.FC = () => {
  const user = React.useContext(UserContext);
  const edit_mode: boolean = user ? user.edit_access : false;

  const CarTaskServiceService = new CarTaskService();

  const [dataSource, setDataSource] = React.useState<CarTaskListType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tableParams, setTableParams] = React.useState<ITableParams>(TableParamsDefault);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<number[]>([]);
  const [update, setUpdate] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalAction, setModalAction] = React.useState<ActionTypes>(ActionTypes.ADD);
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<CarTaskListType>) => {
      tableParams.pagination = {
        ...tableParams.pagination,
        pageSize: page_size,
        total: count,
        current: numbers.current,
      };

      setDataSource(results);
      setTableParams(tableParams);
    };

    const onError = () => {
      setDataSource([]);

      tableParams.pagination = {};
      setTableParams(tableParams);
    };

    const onFinally = () => {
      setUpdate(false);
      setLoading(false);
    };

    if (update) {
      setLoading(true);

      CarTaskServiceService.getCarsTasks({
        page: tableParams.pagination?.current,
        sortField: tableParams.sortField,
        sortOrder: tableParams.sortOrder,
        ...tableParams.filters,
        ...tableParams.search,
      })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const showModal = () => {
    setModalOpen((prevModalOpen) => !prevModalOpen);
  };

  const handleAdd = () => {
    setModalAction(ActionTypes.ADD);
    showModal();
  };

  const handleEdit = () => {
    setModalAction(ActionTypes.EDIT);
    showModal();
  };

  const handleOk = () => {
    showModal();

    tableParams.pagination = {};
    setTableParams(tableParams);

    setUpdate(true);
  };

  const handleCancel = () => {
    showModal();
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
      }
    };

    const onFailed = (error: any) => {
      alert(error.responseText);
    };

    CarTaskServiceService.updateCarTask(pk, taskPlanningData).then(onSuccess).catch(onFailed);
  };

  const handleExportExcel = () => {
    setLoadingExport(true);

    CarTaskServiceService.exportTasksExcel({
      page: tableParams.pagination?.current,
      sortField: tableParams.sortField,
      sortOrder: tableParams.sortOrder,
      ...tableParams.filters,
      ...tableParams.search,
    })
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
      })
      .finally(() => {
        setLoadingExport(false);
      });
  };

  const columns: ColumnsType<CarTaskListType> = [
    {
      title: "Дата",
      key: "created",
      dataIndex: "created",
      width: 110,
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "ТС",
      key: "car_name",
      dataIndex: "car_name",
      width: 300,
    },
    {
      title: "№ заказ-наряда",
      key: "order_number",
      dataIndex: "order_number",
      width: 110,
    },
    {
      title: "Описание",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Необходимые материалы",
      key: "materials",
      dataIndex: "materials",
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
    {
      title: "Дата выполнения",
      key: "date_completed",
      dataIndex: "date_completed",
      width: 120,
    },
  ];

  const pk = [...selectedRowKeys].pop();
  const index = dataSource.findIndex((item) => pk === item.pk);

  return (
    <>
      {modalOpen && (
        <CarTaskModalForm
          pk={modalAction === ActionTypes.EDIT ? dataSource[index].pk : null}
          open={modalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      )}

      <Button disabled={!edit_mode} type="primary" style={{ margin: "10px" }} onClick={handleAdd}>
        Добавить задачу
      </Button>
      <CarsTasksFilter
        tableParams={tableParams}
        setTableParams={setTableParams}
        updateTable={setUpdate}
        onExportExcel={handleExportExcel}
        loadingExport={loadingExport}
      />
      <Table
        bordered
        rowKey={(record) => record.pk}
        rowClassName={(record: CarTaskListType, index) =>
          selectedRowKeys.includes(record.pk) ? "ant-table-row-selected" : ""
        }
        columns={columns}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              if (selectedRowKeys.includes(record.pk)) {
                setSelectedRowKeys([]);
              } else {
                setSelectedRowKeys([record.pk]);
              }
            },
            onDoubleClick: (event) => {
              if (!selectedRowKeys.includes(record.pk)) {
                setSelectedRowKeys([record.pk]);
              }
              handleEdit();
            },
          };
        }}
        dataSource={dataSource}
        loading={loading}
        pagination={{ ...tableParams.pagination, showSizeChanger: false }}
        scroll={{
          y: "calc(100vh - 310px)",
          scrollToFirstRowOnChange: true,
        }}
        locale={{ emptyText: "Задачи не найдены" }}
      />
    </>
  );
};

export default CarsTasksPage;
