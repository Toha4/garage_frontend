import React from "react";
import { Button, Checkbox, Input, Modal, Space, Table } from "antd";
import { CarType } from "../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { EditOutlined } from "@ant-design/icons";
import CarService from "../../../services/CarService";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import CarModalForm from "../../forms/CarModalForm";

interface ICarsModal {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
}

const CarsModal: React.FC<ICarsModal> = ({ open, onOk, onCancel }) => {
  const DataCarService = new CarService();

  const [dataSource, setDataSource] = React.useState<CarType[]>([]);
  const [updateData, setUpdateData] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [skipDecommissioned, setSkipDecommissioned] = React.useState<boolean>(true);
  const [editPk, setEditPk] = React.useState<number | null>(null);
  const [modalFormOpen, setModalFormOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = (result: CarType[]) => {
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
      const general_search = search.length >= 2 ? search : null;
      const show_decommissioned = !skipDecommissioned;

      DataCarService.getCars({ general_search, show_decommissioned })
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
    setSkipDecommissioned(value);
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

  const columns: ColumnsType<CarType> = [
    {
      title: "Гос. номер",
      dataIndex: "state_number",
      key: "state_number",
      width: 120,
    },
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
          <Button className="action-button" type="link" onClick={() => handleEditPost(record.pk)}>
            <EditOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Список транспортных средств"
      open={open}
      onCancel={onCancel}
      width={600}
      footer={[
        <span key="hepler" style={{ float: "left" }}>
          Данные автоматически обновляются из программы Путевки
        </span>,
        <Button key="close" type="default" onClick={onCancel}>
          Закрыть
        </Button>,
      ]}
    >
      {modalFormOpen && editPk && (
        <CarModalForm pk={editPk} open={modalFormOpen} onOk={handleOkForm} onCancel={handleCancelForm} />
      )}

      <div style={{ display: "flex", alignItems: "center" }}>
        <Input placeholder="Поиск" allowClear onChange={onChangeSearch} />
        <Checkbox
          className="ml-10"
          style={{ width: "240px" }}
          checked={skipDecommissioned}
          onChange={onChangeShowDecommissioned}
        >
          Скрыть списанные
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

export default CarsModal;
