import React from "react";
import { Button, Table, Tag } from "antd";
import UserContext from "../../helpers/UserContext";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import { OrderShortType, ResultResursePagation } from "../../services/types";
import OrderService from "../../services/OrderService";
import { ITableParams } from "../../components/interface";
import OrdersFilter from "./OrdersFilter";
import { ActionTypes } from "../../helpers/types";
import OrderModalForm from "../../components/modals/OrderModal";
import { Status } from "../../helpers/constants";
import EmployeeNotesModal from "../../components/modals/EmployeeNotesModal";

const TableParamsDefault: ITableParams = {
  pagination: {current: 1, pageSize: 50,},
  sortField: undefined,
  sortOrder: undefined,
  filters: {},
  search: {},
};

const OrdersPage: React.FC = () => {
  const user = React.useContext(UserContext);
  const edit_mode: boolean = user ? user.edit_access : false;

  const DataOrderService = new OrderService();

  const [dataSource, setDataSource] = React.useState<OrderShortType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tableParams, setTableParams] = React.useState<ITableParams>(TableParamsDefault);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<number[]>([]);
  const [update, setUpdate] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalAction, setModalAction] = React.useState<ActionTypes>(ActionTypes.ADD);
  const [employeeNotesModalOpen, setEmployeeNotesModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<OrderShortType>) => {
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

      DataOrderService.getOrders({
        page: tableParams.pagination?.current,
        page_size: tableParams.pagination?.pageSize,
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

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<OrderShortType> | SorterResult<OrderShortType>[]
  ) => {
    const _sorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setTableParams({
      ...tableParams,
      pagination: pagination,
      filters: filters,
      sortField: _sorter.columnKey,
      sortOrder: _sorter.order,
    });
    setUpdate(true);
  };

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

  const handleCancel = (update: boolean = false) => {
    if (update) setUpdate(true);
    showModal();
  };

  const showEmployeeNotesModal = () => {
    setEmployeeNotesModalOpen((prevModalOpen) => !prevModalOpen);
  };

  const handleOpenEmployeeNotes = () => {
    showEmployeeNotesModal();
  };

  const getStatusTagColor = (order_status: number) => {
    switch (order_status) {
      case Status.COMPLETED: {
        return "success";
      }
      case Status.WORK: {
        return "warning";
      }
      default: {
        return "default";
      }
    }
  };

  const columns: ColumnsType<OrderShortType> = [
    {
      title: "№",
      key: "number",
      dataIndex: "number",
      width: 90,
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Дата начала работ",
      key: "date_begin",
      dataIndex: "date_begin",
      width: 140,
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Статус",
      key: "status",
      dataIndex: "status_name",
      width: 110,
      sorter: true,
      showSorterTooltip: false,
      render: (text, record) => <Tag color={getStatusTagColor(record.status)}>{text}</Tag>,
    },
    {
      title: "Марка и модель",
      key: "car_name",
      dataIndex: "car_name",
      sorter: true,
      showSorterTooltip: false,
      width: 190,
    },
    {
      title: "Гос. №",
      key: "car_state_number",
      dataIndex: "car_state_number",
      sorter: true,
      showSorterTooltip: false,
      width: 110,
    },
    {
      title: "Пробег",
      key: "odometer",
      dataIndex: "odometer",
      width: 100,
    },
    {
      title: "Пост",
      key: "post",
      dataIndex: "post_name",
      sorter: true,
      showSorterTooltip: false,
      width: 120,
    },
    {
      title: "Причина",
      key: "reason",
      dataIndex: "reason_name",
      width: 230,
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Примечание",
      key: "note",
      dataIndex: "note",
    },
  ];

  const pk = [...selectedRowKeys].pop();
  const index = dataSource.findIndex((item) => pk === item.pk);

  return (
    <>
      {modalOpen && (
        <OrderModalForm
          orderPk={modalAction === ActionTypes.EDIT ? dataSource[index].pk : null}
          open={modalOpen}
          actionForm={modalAction}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}
      {employeeNotesModalOpen && (
        <EmployeeNotesModal open={employeeNotesModalOpen} onCancel={() => showEmployeeNotesModal()} />
      )}

      <Button disabled={!edit_mode} type="primary" style={{ margin: "10px" }} onClick={handleAdd}>
        Добавить заказ-наряд
      </Button>
      <Button style={{ margin: "10px", float: "right" }} onClick={handleOpenEmployeeNotes}>
        Заметки по работникам
      </Button>
      <OrdersFilter tableParams={tableParams} setTableParams={setTableParams} updateTable={setUpdate} />
      <Table
        bordered
        rowKey={(record) => record.pk}
        rowClassName={(record: OrderShortType, index) =>
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
        onChange={handleTableChange}
        loading={loading}
        pagination={{ ...tableParams.pagination }}
        scroll={{
          y: "calc(100vh - 310px)",
          scrollToFirstRowOnChange: true,
        }}
        locale={{ emptyText: "Заказ-наряды не найдены" }}
      />
    </>
  );
};

export default OrdersPage;
