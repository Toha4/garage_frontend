import React from "react";
import { Button, Checkbox, Input, Modal, Space, Table } from "antd";
import { EmployeeType } from "../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { EditOutlined } from "@ant-design/icons";
import EmployeeService from "../../../services/EmployeeService";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { EmployeeTypesNames } from "../../../helpers/constants";
import EmployeeModalForm from "../../forms/EmployeeModalForm";

interface IEmployeesModal {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
}

const EmployeesModal: React.FC<IEmployeesModal> = ({ open, onOk, onCancel }) => {
  const DataEmployeeService = new EmployeeService();

  const [dataSource, setDataSource] = React.useState<EmployeeType[]>([]);
  const [updateData, setUpdateData] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [skipDismissal, setSkipDismissal] = React.useState<boolean>(true);
  const [editPk, setEditPk] = React.useState<number | null>(null);
  const [modalFormOpen, setModalFormOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = (result: EmployeeType[]) => {
      setDataSource(result);
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
      const fio_search = search.length >= 2 ? search : null;
      const show_dismissal = !skipDismissal;

      DataEmployeeService.getEmployees({ fio_search, show_dismissal })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [updateData]);

  const showFormModal = () => {
    setModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const onChangeSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);
    setUpdateData(true);
  };

  const onChangeShowDecommissioned = (e: CheckboxChangeEvent) => {
    const value = e.target.checked;
    setSkipDismissal(value);
    setUpdateData(true);
  };

  const handleEditPost = (pk: number | undefined) => {
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

  const columns: ColumnsType<EmployeeType> = [
    {
      title: "ФИО",
      dataIndex: "short_fio",
      key: "short_fio",
    },
    {
      title: "Тип работника",
      dataIndex: "type",
      key: "type",
      width: 160,
      render: (_, record) => EmployeeTypesNames[record.type],
    },
    {
      title: "Действия",
      dataIndex: "action",
      key: "action",
      width: 90,
      render: (_, record) => (
        <Space size={5}>
          <Button className="action-button" type="link" onClick={() => handleEditPost(record.pk)}>
            <EditOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Список работников"
      open={open}
      onCancel={onCancel}
      width={600}
      footer={[
        <span key="hepler" style={{ float: "left" }}>
          Данные автоматически обновляются из программы Кадры
        </span>,
        <Button key="close" type="default" onClick={onCancel}>
          Закрыть
        </Button>,
      ]}
    >
      {modalFormOpen && editPk && (
        <EmployeeModalForm pk={editPk} open={modalFormOpen} onOk={handleOkForm} onCancel={handleCancelForm} />
      )}

      <div style={{ display: "flex", alignItems: "center" }}>
        <Input placeholder="Поиск" allowClear onChange={onChangeSearch} />
        <Checkbox
          className="ml-10"
          style={{ width: "240px" }}
          checked={skipDismissal}
          onChange={onChangeShowDecommissioned}
        >
          Скрыть уволенных
        </Checkbox>
      </div>

      <div className="mt-10">
        <Table
          className="table-handbook"
          size="small"
          rowKey={(record) => `${record.pk}`}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 450 }}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default EmployeesModal;
