import React from "react";
import { Button, Modal } from "antd";
import { MaterialCategoryType, MaterialRemainsWarehouseType } from "../../../services/types";
import MaterialService from "../../../services/MaterialService";
import Table, { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { quantityFormatter } from "../../../helpers/utils";
import RemainsMaterialFilter, { IRemainsMaterialDataFilter } from "./RemainsMaterialsFilter";

interface IRemainsMaterialsModal {
  open: boolean;
  onOk?: (material?: MaterialRemainsWarehouseType[]) => void;
  onCancel: () => void;
  disableMaterialsKeys?: React.Key[];
  defaultCompatbility?: string;
}

export interface IMaterialTable extends MaterialRemainsWarehouseType {
  key: React.Key;
}

interface IMaterialCategoryTable {
  key: React.Key;
  pk: number;
  name: string;
  material_count?: number;
  price?: number;
  quantity?: number;
  warehouse_name?: string;
  unit_is_precision_point?: boolean;
  unit_name?: string;
  children: IMaterialTable[];
  is_expend?: boolean;
}

const RemainsMaterialsModal: React.FC<IRemainsMaterialsModal> = ({
  open,
  onOk,
  onCancel,
  disableMaterialsKeys = [],
  defaultCompatbility,
}) => {
  const DataMaterialService = new MaterialService();

  const [dataSource, setDataSource] = React.useState<IMaterialCategoryTable[]>([]);
  const [selectedMaterials, setSelectedMaterials] = React.useState<IMaterialTable[]>([]);

  const [updateCategory, setUpdateCategory] = React.useState<boolean>(true);
  const [loadingCategory, setLoadingCategory] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState<IRemainsMaterialDataFilter>({
    search_name: "",
    warehouse: undefined,
    compatbility: defaultCompatbility ? [defaultCompatbility] : undefined,
  });
  const [dataSearch, setDataSearch] = React.useState<IMaterialCategoryTable[]>([]);

  React.useEffect(() => {
    const onDataLoaded = (result: MaterialCategoryType[]) => {
      const data = result.map((category) => {
        return {
          key: `C-${category.pk}`,
          pk: category.pk,
          name: category.name,
          material_count: category.material_count,
          children: [],
        };
      }) as IMaterialCategoryTable[];

      setDataSource(data);
    };

    const onError = () => {
      setDataSource([]);
    };

    const onFinally = () => {
      setUpdateCategory(false);
      setLoadingCategory(false);
    };

    if (updateCategory) {
      setLoadingCategory(true);

      DataMaterialService.getMaterialCategoryes().then(onDataLoaded).catch(onError).finally(onFinally);
    }
  }, [updateCategory]);

  React.useEffect(() => {
    const onDataLoaded = (result: MaterialRemainsWarehouseType[]) => {
      const materials = result.map((material) => {
        return {
          key: `M-${material.pk}-${material.warehouse}`,
          pk: material.pk,
          name: material.name,
          unit_name: material.unit_name,
          unit_is_precision_point: material.unit_is_precision_point,
          category: material.category,
          compatbility: material.compatbility,
          warehouse: material.warehouse,
          warehouse_name: material.warehouse_name,
          quantity: material.quantity,
          price: material.price,
          sum: material.sum,
        };
      }) as IMaterialTable[];

      setDataSearch([
        {
          key: "C-0",
          pk: 0,
          name: "Поиск",
          children: materials,
        },
      ]);
    };

    const onError = () => {
      setDataSearch([]);
    };

    const onFinally = () => {
      setLoadingCategory(false);
    };

    if (filter.search_name.length >= 2) {
      DataMaterialService.getMaterialRemainsCategory({ ...filter })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    } else {
      if (dataSearch) {
        setDataSearch([]);
      }

      reloadAllMaterialCateroy();
    }
  }, [filter]);

  const columns: ColumnsType<IMaterialCategoryTable> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Остаток",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (text, record) =>
        "children" in record
          ? ""
          : quantityFormatter(record.quantity || 0, record.unit_is_precision_point || false, record.unit_name || ""),
    },
    {
      title: "Цена, руб.",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (text, record) => ("children" in record ? "" : record.price?.toFixed(2)),
    },
    {
      title: "Склад",
      dataIndex: "warehouse_name",
      key: "warehouse_name",
      width: 140,
    },
  ];

  const rowSelection: TableRowSelection<IMaterialCategoryTable> = {
    checkStrictly: false,
    hideSelectAll: true,
    selectedRowKeys: selectedMaterials.map((material) => {
      return material.key;
    }),
    getCheckboxProps: (record) => {
      const isCategory = record.hasOwnProperty("children");
      let isDisable = false;
      if (!isCategory) {
        isDisable = disableMaterialsKeys.indexOf(record.key) !== -1;
      }
      return {
        style: isCategory ? { display: "none" } : {},
        disabled: isCategory || isDisable ? true : false,
      };
    },
    onSelect: (record, selected, selectedRows) => {
      if (selected) {
        selectedMaterials.push(record as any as IMaterialTable);
      } else {
        const index = selectedMaterials.findIndex((item) => record.pk === item.pk);
        if (index >= 0) {
          selectedMaterials.splice(index, 1);
        }
      }

      setSelectedMaterials([...selectedMaterials]);
    },
  };

  const handleOk = () => {
    if (onOk) {
      const materials = selectedMaterials!.map((materialTable) => {
        return {
          pk: materialTable.pk,
          category: materialTable.category,
          name: materialTable.name,
          unit_name: materialTable.unit_name,
          unit_is_precision_point: materialTable.unit_is_precision_point,
          warehouse: materialTable.warehouse,
          warehouse_name: materialTable.warehouse_name,
          compatbility: materialTable.compatbility,
          quantity: materialTable.quantity,
          price: materialTable.price,
        };
      }) as MaterialRemainsWarehouseType[];

      onOk(materials);
    }
    onCancel();
  };

  const reloadAllMaterialCateroy = () => {
    for (let category of dataSource) {
      if (category.is_expend) {
        loadingMaterialsCategory(category.pk);
      }
    }
  };

  const loadingMaterialsCategory = (category_pk: number) => {
    const onDataLoaded = (result: MaterialRemainsWarehouseType[]) => {
      const data = result.map((material) => {
        return {
          key: `M-${material.pk}-${material.warehouse}`,
          pk: material.pk,
          name: material.name,
          unit_name: material.unit_name,
          unit_is_precision_point: material.unit_is_precision_point,
          category: material.category,
          compatbility: material.compatbility,
          warehouse: material.warehouse,
          warehouse_name: material.warehouse_name,
          quantity: material.quantity,
          price: material.price,
          sum: material.sum,
        };
      }) as IMaterialTable[];

      const category = dataSource.find((category) => category.key === `C-${category_pk}`);
      if (category) {
        category.children = data;
        category.is_expend = true;

        setDataSource([...dataSource]);
      }
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataMaterialService.getMaterialRemainsCategory({ category: category_pk, ...filter })
      .then(onDataLoaded)
      .catch(onError);
  };

  const handleExpand = (expanded: boolean, record: IMaterialCategoryTable) => {
    if (expanded && "children" in record) {
      loadingMaterialsCategory(record.pk);
    }
  };

  const searchMode = filter.search_name.length >= 2 && dataSearch.length > 0;

  return (
    <Modal
      title="Остаток материалов"
      open={open}
      onCancel={onCancel}
      maskClosable={selectedMaterials && selectedMaterials.length > 0 ? false : true}
      width={900}
      footer={[
        <Button key="select" type="primary" onClick={handleOk}>
          {`Выбрать ${selectedMaterials && selectedMaterials.length > 0 ? `(${selectedMaterials.length})` : ""}`}
        </Button>,
      ]}
    >
      <RemainsMaterialFilter filter={filter} setFilter={setFilter} />

      <Table
        className="table-handbook"
        size="small"
        columns={columns}
        rowSelection={{ ...rowSelection }}
        dataSource={searchMode ? dataSearch : dataSource}
        pagination={false}
        scroll={{ y: 450 }}
        expandable={{
          expandRowByClick: searchMode ? false : true,
          defaultExpandAllRows: true,
          expandedRowKeys: searchMode ? ["C-0"] : undefined,
          onExpand: !searchMode ? handleExpand : undefined,
        }}
        loading={loadingCategory}
      />
    </Modal>
  );
};

export default RemainsMaterialsModal;
