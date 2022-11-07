import React from "react";
import { Button, Table } from "antd";
import MaterialsModal from "../../handbooks/MaterialsModal";
import { TurnoverNestedType, MaterialType, WarehouseType } from "../../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { CloseOutlined } from "@ant-design/icons";
import { EditableCell, EditableRow } from "./EditTable";
import WarehouseService from "../../../../services/WarehouseService";
import UserContext from "../../../../helpers/UserContext";
import TurnoverService from "../../../../services/TurnoverService";
import showConfirmDialog from "../../../common/ConfirmDialog";
import { quantityFormatter } from "../../../../helpers/utils";

interface ITableEntranceMaterials {
  value: TurnoverNestedType[];
  onChange: (...event: any[]) => void;
  readOnlyMode?: boolean;
}

const TableEntranceMaterials: React.FC<ITableEntranceMaterials> = ({ value, onChange, readOnlyMode = false }) => {
  const DataWarehouseService = new WarehouseService();
  const DataTurnoverService = new TurnoverService();

  const user = React.useContext(UserContext);

  const [warehouses, setWarehouses] = React.useState<WarehouseType[]>([]);

  React.useEffect(() => {
    const onDataLoaded = (data: WarehouseType[]) => {
      setWarehouses(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataWarehouseService.getWarehouses().then(onDataLoaded).catch(onError);
  }, []);

  const [openMaterialsModal, setOpenMatrialsModal] = React.useState(false);

  const handleAddMaterial = (materials: MaterialType[] | undefined) => {
    if (materials) {
      const addedEntranceMaterial: TurnoverNestedType[] = [];

      for (const material of materials) {
        // Если такого материала еще нету в поступлении то добавляем
        if (value.findIndex((item) => material.pk === item.material) === -1) {
          addedEntranceMaterial.push({
            pk: null,
            date: undefined,
            material: material.pk,
            material_name: material.name,
            material_unit_name: material.unit_name,
            material_unit_is_precision_point: material.unit_is_precision_point,
            warehouse: null,
            price: 0.0,
            quantity: 0.0,
            sum: 0.0,
          });
        }
      }

      onChange([...value, ...addedEntranceMaterial]);
    }
  };

  const handleRemoveEntranceMaterial = (material: number | null) => {
    const index = value.findIndex((item) => material === item.material);
    if (index >= 0) {
      const pk = value[index].pk;

      if (pk && user?.is_superuser) {
        showConfirmDialog({
          title: `Вы уверены, что хотите удалить материал из оборотов? (ДЛЯ АДМИНИСТРАТОРОВ)`,
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

  const handleChange = (record: TurnoverNestedType) => {
    const index = value.findIndex((item) => record.material === item.material);
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

  const columns: ColumnsType<TurnoverNestedType> = [
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: 30,
      render: (_, record) =>
        (!record.pk || user?.is_superuser) &&
        !readOnlyMode && (
          <Button
            className="action-button"
            type="link"
            onClick={() => handleRemoveEntranceMaterial(record.material || null)}
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
      onCell: (record) => ({
        record,
        editable: !record.pk,
        type: "warehouse",
        dataIndex: "warehouse",
        title: "",
        handleChange: handleChange,
        warehouses: warehouses,
      }),
      render: (text, record) => (record.pk ? <div style={{ marginLeft: "11px" }}>{text}</div> : text),
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      width: 110,
      onCell: (record) => ({
        record,
        editable: !record.pk,
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
      onCell: (record) => ({
        record,
        editable: !record.pk,
        type: "price",
        dataIndex: "price",
        title: "",
        handleChange: handleChange,
      }),
      render: (text, record) =>
        record.pk ? <div style={{ marginLeft: "12px" }}>{record.price.toFixed(2)}</div> : text,
    },
    {
      title: "Сумма, руб",
      key: "sum",
      width: 100,
      render: (_, record) => <div style={{ marginLeft: "12px" }}>{(record.price * record.quantity).toFixed(2)}</div>,
    },
  ];

  const disableMaterialsKeys: string[] = value?.map((entranceMaterial) => `M-${entranceMaterial.material}`);

  return (
    <>
      {openMaterialsModal && (
        <MaterialsModal
          open={openMaterialsModal}
          selectMode
          onCancel={() => setOpenMatrialsModal(false)}
          onOk={handleAddMaterial}
          disableMaterialsKeys={disableMaterialsKeys}
        />
      )}
      <Button type="primary" size="small" disabled={readOnlyMode} onClick={() => setOpenMatrialsModal(true)}>
        Добавить материал
      </Button>

      <Table
        className="table-entrance-materials mt-10"
        size="small"
        components={components}
        rowClassName={() => "editable-row"}
        columns={columns}
        dataSource={value}
        rowKey={(record) => `${record.material}`}
        pagination={false}
        scroll={{ y: 160 }}
        locale={{
          emptyText: "Нет добавленных материалов",
        }}
      />
    </>
  );
};

export default TableEntranceMaterials;
