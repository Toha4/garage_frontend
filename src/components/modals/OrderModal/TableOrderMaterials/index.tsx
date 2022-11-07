import React from "react";
import { Button, Table } from "antd";
import { TurnoverNestedOrderType, MaterialRemainsWarehouseType } from "../../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { CloseOutlined } from "@ant-design/icons";
import { EditableCell, EditableRow } from "./EditTable";
import showConfirmDialog from "../../../common/ConfirmDialog";
import RemainsMaterialsModal from "../../RemainsMaterialsModal";
import moment from "moment";
import TurnoverService from "../../../../services/TurnoverService";
import { quantityFormatter } from "../../../../helpers/utils";

interface ITableOrderMaterials {
  value: TurnoverNestedOrderType[];
  onChange: (...event: any[]) => void;
  editMode: boolean;
  defaultCompatbility?: string;
}

const TableOrderMaterials: React.FC<ITableOrderMaterials> = ({ value, onChange, editMode, defaultCompatbility }) => {
  const DataTurnoverService = new TurnoverService();

  const [openRemainsMaterialsModal, setOpenRemainsMaterialsModal] = React.useState<boolean>(false);

  const handleAddMaterial = (materials: MaterialRemainsWarehouseType[] | undefined) => {
    if (materials) {
      const addedOrderMaterials: TurnoverNestedOrderType[] = [];

      for (const material of materials) {
        // Если такой работы еще нету в заказ-наряде то добавляем
        if (value.findIndex((item) => material.id === item.material && material.warehouse === item.warehouse) === -1) {
          addedOrderMaterials.push({
            pk: null,
            date: moment().format("DD.MM.YYYY"),
            material: material.id,
            material_name: material.name,
            material_unit_name: material.unit_name,
            material_unit_is_precision_point: material.unit_is_precision_point,
            warehouse: material.warehouse,
            warehouse_name: material.warehouse_name,
            price: material.price,
            max_quantity: material.quantity,
            quantity: 0.0,
            sum: 0.0,
          });
        }
      }

      onChange([...value, ...addedOrderMaterials]);
    }
  };

  const handleRemoveOrderMaterial = (material: number, warehouse: number) => {
    const index = value.findIndex((item) => material === item.material && warehouse === item.warehouse);
    if (index >= 0) {
      const pk = value[index].pk;

      if (pk) {
        showConfirmDialog({
          title: `Вы уверены, что хотите удалить списание "${value[index].material_name}"?`,
          onOk: () => {
            DataTurnoverService.deleteTurnover(pk)
              .then(() => {
                value.splice(index, 1);
                onChange(value);
              })
              .catch((error) => {
                alert(error);
              });
          },
          onCancel: () => {},
        });
      } else {
        value.splice(index, 1);
        onChange(value);
      }
    }
  };

  const handleChange = (record: TurnoverNestedOrderType) => {
    const index = value.findIndex((item) => record.material === item.material && record.warehouse === item.warehouse);
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

  const columns: ColumnsType<TurnoverNestedOrderType> = [
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: 30,
      render: (_, record) =>
        editMode && (
          <Button
            className="action-button"
            type="link"
            onClick={() => handleRemoveOrderMaterial(record.material, record.warehouse)}
          >
            <CloseOutlined />
          </Button>
        ),
    },
    {
      title: "Наименование",
      dataIndex: "material_name",
      key: "material_name",
    },
    {
      title: "Склад",
      dataIndex: "warehouse_name",
      key: "warehouse_name",
      width: 140,
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      width: 110,
      onCell: (record) => ({
        record,
        editable: editMode && !record.pk,
        type: "quantity",
        dataIndex: "quantity",
        title: "",
        handleChange: handleChange,
      }),
      render: (text, record) =>
        record.pk ? (
          <div style={{ marginLeft: "9px" }}>
            {quantityFormatter(
              Number(record.quantity),
              record.material_unit_is_precision_point || false,
              record.material_unit_name || ""
            )}
          </div>
        ) : (
          text
        ),
    },
    {
      title: "Цена, руб",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (_, record) => <div style={{ marginLeft: "12px" }}>{record.price.toFixed(2)}</div>,
    },
    {
      title: "Сумма, руб",
      key: "sum",
      width: 100,
      render: (_, record) => (
        <div style={{ marginLeft: "12px" }}>
          {record.pk ? record.sum.toFixed(2) : (record.price * record.quantity).toFixed(2)}
        </div>
      ),
    },
  ];

  const disableMaterialsKeys: string[] = value?.map(
    (orderMaterial) => `M-${orderMaterial.material}-${orderMaterial.warehouse}`
  );

  return (
    <>
      {openRemainsMaterialsModal && (
        <RemainsMaterialsModal
          open={openRemainsMaterialsModal}
          onCancel={() => setOpenRemainsMaterialsModal(false)}
          onOk={handleAddMaterial}
          disableMaterialsKeys={disableMaterialsKeys}
          defaultCompatbility={defaultCompatbility}
        />
      )}
      <Button type="primary" size="small" disabled={!editMode} onClick={() => setOpenRemainsMaterialsModal(true)}>
        Добавить материал
      </Button>

      <Table
        className="table-order-works mt-10"
        size="small"
        components={components}
        rowClassName={() => "editable-row"}
        columns={columns}
        dataSource={value}
        rowKey={(record) => `${record.material}-${record.warehouse}`}
        pagination={false}
        scroll={{ y: 160 }}
        locale={{
          emptyText: "Нет списанных материалов",
        }}
      />
    </>
  );
};

export default TableOrderMaterials;
