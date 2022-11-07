import { Button, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import React from "react";
import EntranceFilter from "./EntranceFilter";
import { ITableParams } from "../../components/interface";
import UserContext from "../../helpers/UserContext";
import EntranceService from "../../services/EntranceService";
import { EntranceListType, ResultResursePagation } from "../../services/types";
import EntranceMaterialTable from "./EntranceMaterialTable";
import { EditOutlined } from "@ant-design/icons";
import { FilterValue } from "antd/lib/table/interface";
import { ActionTypes } from "../../helpers/types";
import EntranceModalForm from "../../components/modals/EntranceModal";

const TableParamsDefault: ITableParams = {
  pagination: {},
  filters: {},
  search: {},
};

interface IEntranceTable extends EntranceListType {
  pk: number;
}

const WarehouseEntrancePage: React.FC = () => {
  const DataEntranceService = new EntranceService();

  const user = React.useContext(UserContext);
  const edit_mode: boolean = user ? user.edit_access : false;

  const [dataSource, setDataSource] = React.useState<IEntranceTable[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tableParams, setTableParams] = React.useState<ITableParams>(TableParamsDefault);
  const [update, setUpdate] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalAction, setModalAction] = React.useState<ActionTypes>(ActionTypes.ADD);
  const [editPk, setEditPk] = React.useState<number | null>(null);
  const [updateEntrance, setUpdateEntrance] = React.useState<number | null>(null);

  React.useEffect(() => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<IEntranceTable>) => {
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

      DataEntranceService.getEntrances({
        page: tableParams.pagination?.current,
        ...tableParams.filters,
        ...tableParams.search,
      })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>) => {
    setTableParams({
      ...tableParams,
      pagination: pagination,
      filters: filters,
    });
    setUpdate(true);
  };

  const showDialog = () => {
    setModalOpen((prevModalOpen) => !prevModalOpen);
  };

  const handleAddEntrance = () => {
    setEditPk(null);
    setModalAction(ActionTypes.ADD);
    showDialog();
  };

  const handleEditEntrance = (entrance_pk: number) => {
    setEditPk(entrance_pk);
    setModalAction(ActionTypes.EDIT);
    showDialog();
  };

  const handleOk = () => {
    showDialog();

    tableParams.pagination = {};
    setTableParams(tableParams);

    setUpdate(true);

    // Обновляем вложенную таблицу, если открыта
    setUpdateEntrance(editPk);
    setTimeout(() => setUpdateEntrance(null), 10);
  };

  const handleCancel = () => {
    showDialog();
  };

  const getNameEntrance = (record: IEntranceTable) => {
    return `${record.date} ${record.provider && " от " + record.provider} ${record.note && " (" + record.note + ")"}`;
  };

  const columns: ColumnsType<IEntranceTable> = [
    {
      title: "Наименование",
      key: "name",
      render: (_, record) => getNameEntrance(record),
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: (_, record) =>
        edit_mode && (
          <Button className="action-button" type="link" onClick={() => handleEditEntrance(record.pk)}>
            <EditOutlined />
          </Button>
        ),
    },
  ];

  const expandedRowRender = (record: IEntranceTable) => {
    return <EntranceMaterialTable entrance_pk={record.pk} update_pk={updateEntrance} />;
  };

  return (
    <>
      {modalOpen && (
        <EntranceModalForm
          entrance_pk={modalAction === ActionTypes.EDIT ? editPk : null}
          open={modalOpen}
          action={modalAction}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}

      <Button disabled={!edit_mode} type="primary" style={{ margin: "10px" }} onClick={handleAddEntrance}>
        Добавить поступление
      </Button>
      <EntranceFilter tableParams={tableParams} setTableParams={setTableParams} updateTable={setUpdate} />
      <Table
        rowKey={(record) => record.pk}
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
        loading={loading}
        pagination={{ ...tableParams.pagination, showSizeChanger: false }}
        scroll={{
          y: "calc(100vh - 310px)",
          scrollToFirstRowOnChange: true,
        }}
        locale={{ emptyText: "Поступления не найдены" }}
        expandedRowRender={expandedRowRender}
        showHeader={false}
        onRow={(record, rowIndex) => {
          return {
            style: { backgroundColor: "#fafafa" },
          };
        }}
      />
    </>
  );
};

export default WarehouseEntrancePage;
