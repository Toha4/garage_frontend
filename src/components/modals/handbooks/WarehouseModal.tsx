import React from "react";
import { Button, Modal, Space, Table } from "antd";
import { WarehouseType } from "../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import WarehouseService from "../../../services/WarehouseService";
import WarehouseModalForm from "../../forms/WarehouseModalForm";
import showConfirmDialog from "../../common/ConfirmDialog";

interface IWarehouseModal {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
}

const WarehouseModal: React.FC<IWarehouseModal> = ({ open, onOk, onCancel }) => {
  const DataWarehouseService = new WarehouseService();

  const [dataSource, setDataSource] = React.useState<WarehouseType[]>([]);
  const [updateData, setUpdateData] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editPk, setEditPk] = React.useState<number | null>(null);
  const [modalFormOpen, setModalFormOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = (result: WarehouseType[]) => {
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
      DataWarehouseService.getWarehouses().then(onDataLoaded).catch(onError).finally(onFinally);
    }
  }, [updateData]);

  const showFormModal = () => {
    setModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const handleAddWarehouse = () => {
    setEditPk(null);
    showFormModal();
  };

  const handleEditWarehouse = (pk: number | undefined) => {
    setEditPk(pk || null);
    showFormModal();
  };

  const handleDeleteWarehouse = (pk: number | undefined) => {
    const name = dataSource.find((item) => pk === item.pk)?.name;

    showConfirmDialog({
      title: `Вы уверены, что хотите удалить склад "${name}"?`,
      onOk: () => {
        if (pk) {
          DataWarehouseService.deleteWarehouse(pk)
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

  const handleOkForm = () => {
    setUpdateData(true);
    showFormModal();
  };

  const handleCancelForm = () => {
    showFormModal();
  };

  const columns: ColumnsType<WarehouseType> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Действия",
      dataIndex: "action",
      key: "action",
      width: 90,
      render: (_, record) => (
        <Space size={5}>
          <Button className="action-button" type="link" onClick={() => handleEditWarehouse(record.pk)}>
            <EditOutlined />
          </Button>
          {!record.delete_forbidden && (
            <Button className="action-button" type="link" onClick={() => handleDeleteWarehouse(record.pk)}>
              <DeleteOutlined />
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Список складов"
      open={open}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="close" type="default" onClick={onCancel}>
          Закрыть
        </Button>,
      ]}
    >
      {modalFormOpen && (
        <WarehouseModalForm pk={editPk} open={modalFormOpen} onOk={handleOkForm} onCancel={handleCancelForm} />
      )}

      <Button onClick={handleAddWarehouse}>Добавить склад</Button>

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

export default WarehouseModal;
