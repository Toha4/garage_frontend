import React from "react";
import { Button, Input, Modal, Space, Table } from "antd";
import { ReasonType } from "../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ReasonService from "../../../services/ReasonService";
import { ReasonTypeNames } from "../../../helpers/constants";
import ReasonModalForm from "../../forms/ReasonModalForm";
import showConfirmDialog from "../../common/ConfirmDialog";

interface IReasonsModal {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
}

const ReasonsModal: React.FC<IReasonsModal> = ({ open, onOk, onCancel }) => {
  const DataReasonService = new ReasonService();

  const [dataSource, setDataSource] = React.useState<ReasonType[]>([]);
  const [updateData, setUpdateData] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [editPk, setEditPk] = React.useState<number | null>(null);
  const [modalFormOpen, setModalFormOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = (result: ReasonType[]) => {
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
      const search_name = search.length >= 2 ? search : null;

      DataReasonService.getReasons({ search_name }).then(onDataLoaded).catch(onError).finally(onFinally);
    }
  }, [updateData]);

  const onChangeSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);
    setUpdateData(true);
  };

  const showFormModal = () => {
    setModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const handleAddReason = () => {
    setEditPk(null);
    showFormModal();
  };

  const handleEditReason = (pk: number | undefined) => {
    setEditPk(pk || null);
    showFormModal();
  };

  const handleDeleteReason = (pk: number | undefined) => {
    const name = dataSource.find((item) => pk === item.pk)?.name;

    showConfirmDialog({
      title: `Вы уверены, что хотите удалить причину "${name}"?`,
      onOk: () => {
        if (pk) {
          DataReasonService.deleteReason(pk)
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

  const columns: ColumnsType<ReasonType> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (_, record) => <span>{ReasonTypeNames[record.type]}</span>,
    },
    {
      title: "Действия",
      dataIndex: "action",
      key: "action",
      width: 90,
      render: (_, record) => (
        <Space size={5}>
          <Button className="action-button" type="link" onClick={() => handleEditReason(record.pk)}>
            <EditOutlined />
          </Button>
          {!record.delete_forbidden && (
            <Button className="action-button" type="link" onClick={() => handleDeleteReason(record.pk)}>
              <DeleteOutlined />
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Список причин"
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
        <ReasonModalForm pk={editPk} open={modalFormOpen} onOk={handleOkForm} onCancel={handleCancelForm} />
      )}

      <div style={{ display: "flex" }}>
        <Input placeholder="Поиск" allowClear onChange={onChangeSearch} />
        <Button className="ml-10" onClick={handleAddReason}>
          Добавить причину
        </Button>
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

export default ReasonsModal;
