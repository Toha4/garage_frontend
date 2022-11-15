import React from "react";
import { Button, Input, Modal, Space, Table } from "antd";
import { EmployeeNoteType, ResultResursePagation } from "../../services/types";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EmployeeNoteService from "../../services/EmployeeNoteService";
import { ITableParams } from "../interface";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import showConfirmDialog from "../common/ConfirmDialog";
import EmployeeNoteModalForm from "../forms/EmployeeNoteModalForm";

interface IEmployeeNotesModal {
  open: boolean;
  onCancel: () => void;
}

const TableParamsDefault: ITableParams = {
  pagination: {},
  sortField: undefined,
  sortOrder: undefined,
  filters: undefined,
  search: {},
};

const EmployeeNotesModal: React.FC<IEmployeeNotesModal> = ({ open, onCancel }) => {
  const DataEmployeeNoteService = new EmployeeNoteService();

  const [dataSource, setDataSource] = React.useState<EmployeeNoteType[]>([]);
  const [tableParams, setTableParams] = React.useState<ITableParams>(TableParamsDefault);
  const [updateData, setUpdateData] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [editPk, setEditPk] = React.useState<number | null>(null);
  const [modalFormOpen, setModalFormOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<EmployeeNoteType>) => {
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
    };

    const onFinally = () => {
      setUpdateData(false);
      setLoading(false);
    };

    if (updateData) {
      setUpdateData(true);
      const general_search = search.length >= 2 ? search : null;

      DataEmployeeNoteService.getEmployeeNotes({
        general_search: general_search,
        page: tableParams.pagination?.current,
        sortField: tableParams.sortField,
        sortOrder: tableParams.sortOrder,
      })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [updateData]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<EmployeeNoteType> | SorterResult<EmployeeNoteType>[]
  ) => {
    const _sorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setTableParams({
      ...tableParams,
      pagination: pagination,
      sortField: _sorter.columnKey,
      sortOrder: _sorter.order,
    });
    setUpdateData(true);
  };

  const showFormModal = () => {
    setModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const onChangeSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);
    setUpdateData(true);
  };

  const handleEditNote = (pk: number | null) => {
    setEditPk(pk || null);
    showFormModal();
  };

  const handleOkForm = () => {
    setUpdateData(true);
    showFormModal();
  };

  const handleCancelForm = () => {
    showFormModal();
  };

  const showFormWorkModal = () => {
    setModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const handleAddNotes = () => {
    setEditPk(null);
    showFormWorkModal();
  };

  const handleDeleteNote = (record: EmployeeNoteType) => {
    showConfirmDialog({
      title: `Вы уверены, что хотите удалить запись от ${record.date} - ${record.employee_short_fio}?`,
      onOk: () => {
        if (record?.pk) {
          DataEmployeeNoteService.deleteEmployeeNote(record.pk)
            .then(() => {
              setUpdateData(true);
            })
            .catch((error) => {
              alert(error);
            });
        }
      },
      onCancel: () => {},
    });
  };

  const columns: ColumnsType<EmployeeNoteType> = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "ФИО",
      dataIndex: "employee_short_fio",
      key: "employee_short_fio",
      width: 120,
    },
    {
      title: "Заметка",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Действия",
      dataIndex: "action",
      key: "action",
      width: 90,
      render: (_, record) => (
        <Space size={5}>
          <Button className="action-button" type="link" onClick={() => handleEditNote(record.pk)}>
            <EditOutlined />
          </Button>
          <Button className="action-button" type="link" onClick={() => handleDeleteNote(record)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Список заметок по работникам"
      open={open}
      onCancel={onCancel}
      width={750}
      footer={[
        <Button key="close" type="default" onClick={onCancel}>
          Закрыть
        </Button>,
      ]}
    >
      {modalFormOpen && (
        <EmployeeNoteModalForm pk={editPk} open={modalFormOpen} onOk={handleOkForm} onCancel={handleCancelForm} />
      )}

      <div style={{ display: "flex", alignItems: "center" }}>
        <Input placeholder="Поиск" allowClear onChange={onChangeSearch} />
        <Button type="primary" className="ml-10" onClick={handleAddNotes}>
          Добавить заметку
        </Button>
      </div>

      <div className="mt-10">
        <Table
          className="table-handbook"
          size="small"
          rowKey={(record) => `${record.pk}`}
          columns={columns}
          dataSource={dataSource}
          onChange={handleTableChange}
          pagination={{ ...tableParams.pagination, showSizeChanger: false }}
          scroll={{ y: 450 }}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default EmployeeNotesModal;
