import React from "react";
import { Button, Popover, Table } from "antd";
import WorksModal from "../../handbooks/WorksModal";
import { OrderWorkType, WorkType } from "../../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { EditableCell, EditableRow } from "./EditTable";
import { convertValueToDuration } from "../../../common/InputTimeDuration";
import InputTimeDuratiomHelper from "../../../common/InputTimeDuration/InputTimeDuratiomHelper";
import showConfirmDialog from "../../../common/ConfirmDialog";
import InputWorkMechanicsHelper from "../../../common/InputWorkMechanics/InputWorkMechanicsHelper";

interface ITableOrderWorks {
  value: OrderWorkType[];
  onChange: (...event: any[]) => void;
  editMode: boolean;
  dateRequest?: moment.Moment;
}

const TableOrderWorks: React.FC<ITableOrderWorks> = ({ value, onChange, editMode, dateRequest }) => {
  const [openWorksModal, setOpenWorksModal] = React.useState(false);

  const handleAddWork = (works: WorkType[] | undefined) => {
    if (works) {
      const addedOrderWorks: OrderWorkType[] = [];

      for (const work of works) {
        // Если такой работы еще нету в заказ-наряде то добавляем
        if (value.findIndex((item) => work.pk === item.work) === -1) {
          addedOrderWorks.push({
            pk: null,
            work: work.pk,
            work_name: work.name,
            work_category: work.category,
            quantity: 1,
            time_minutes: 0,
            note: "",
            mechanics: [],
          });
        }
      }

      onChange([...value, ...addedOrderWorks]);
    }
  };

  const handleRemoveOrderWork = (work: number | null) => {
    const index = value.findIndex((item) => work === item.work);
    if (index >= 0) {
      showConfirmDialog({
        title: `Вы уверены, что хотите удалить работу "${value[index].work_name}"?`,
        onOk: () => {
          value.splice(index, 1);
          onChange(value);
        },
        onCancel: () => {},
      });
    }
  };

  const handleChange = (record: OrderWorkType) => {
    const index = value.findIndex((item) => record.work === item.work);
    if (index >= 0) {
      value[index] = record;
    }
    onChange(value);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns: ColumnsType<OrderWorkType> = [
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: 30,
      render: (_, record) =>
        editMode && (
          <Button className="action-button" type="link" onClick={() => handleRemoveOrderWork(record.work || null)}>
            <CloseOutlined />
          </Button>
        ),
    },
    {
      title: "Наименование",
      dataIndex: "work_name",
      key: "work_name",
      width: 220,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      width: 65,
      onCell: (record) => ({
        record,
        editable: editMode,
        type: "quantity",
        dataIndex: "quantity",
        title: "",
        handleChange: handleChange,
      }),
    },
    {
      title: () => (
        <div>
          <span>Затраченно времени </span>
          <Popover content={InputTimeDuratiomHelper} title="Общее затраченное время на работу">
            <QuestionCircleOutlined />
          </Popover>
        </div>
      ),
      dataIndex: "time_minutes",
      key: "time_minutes",
      width: 95,
      onCell: (record) => ({
        record,
        editable: editMode,
        type: "time_minutes",
        dataIndex: "time_minutes",
        title: "",
        handleChange: handleChange,
      }),
      render: (_, record) => <span>{convertValueToDuration(record.time_minutes)}</span>,
    },
    {
      title: () => (
        <div>
          <span>Кто выполнил </span>
          <Popover content={InputWorkMechanicsHelper} title="Работники выполняющие работу">
            <QuestionCircleOutlined />
          </Popover>
        </div>
      ),
      dataIndex: "mechanics",
      key: "mechanics",
      width: 220,
      onCell: (record) => ({
        record,
        editable: editMode,
        type: "mechanics",
        dataIndex: "mechanics",
        title: "",
        handleChange: handleChange,
        dateRequest: dateRequest,
      }),
      render: (_, record) => (
        <ul style={{ marginBottom: "0px", listStyleType: "none" }}>
          {record.mechanics?.map((mechanic) => (
            <li key={mechanic.mechanic}>
              {`${mechanic.mechanic_short_fio} ${mechanic.time_minutes ? "- " : ""} ${convertValueToDuration(
                mechanic.time_minutes
              )}`}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Примечание",
      dataIndex: "note",
      key: "note",
      onCell: (record) => ({
        record,
        editable: editMode,
        type: "note",
        dataIndex: "note",
        title: "",
        handleChange: handleChange,
      }),
    },
  ];

  const disableWorksKeys: string[] = value?.map((orderWork) => `W-${orderWork.work}`);

  return (
    <>
      {openWorksModal && (
        <WorksModal
          open={openWorksModal}
          selectMode
          onCancel={() => setOpenWorksModal(false)}
          onOk={handleAddWork}
          disableWorksKeys={disableWorksKeys}
        />
      )}
      <Button type="primary" size="small" disabled={!editMode} onClick={() => setOpenWorksModal(true)}>
        Добавить работу
      </Button>

      <Table
        className="table-order-works mt-10"
        size="small"
        components={components}
        rowClassName={() => "editable-row"}
        columns={columns}
        dataSource={value}
        rowKey={(record) => `${record.work}`}
        pagination={false}
        scroll={{ y: 160 }}
        locale={{
          emptyText: "Нет добавленных работ",
        }}
      />
    </>
  );
};

export default TableOrderWorks;
