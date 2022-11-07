import React from "react";
import { Button, Input, Modal, Space, Tag } from "antd";
import { MaterialCategoryType, MaterialType } from "../../../services/types";
import MaterialService from "../../../services/MaterialService";
import Table, { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import MaterialModalForm from "../../forms/MaterialModalForm";
import showConfirmDialog from "../../common/ConfirmDialog";
import MaterialCategoryModalForm from "../../forms/MaterialCategoryModalForm";

interface IMaterialsModal {
  open: boolean;
  onOk?: (material?: MaterialType[]) => void;
  onCancel: () => void;
  selectMode?: boolean;
  disableMaterialsKeys?: React.Key[];
}

export interface IMaterialTable extends MaterialType {
  key: React.Key;
}

interface IMaterialCategoryTable {
  key: React.Key;
  pk: number;
  name: string;
  material_count?: number;
  children: IMaterialTable[];
}

const MaterialsModal: React.FC<IMaterialsModal> = ({
  open,
  onOk,
  onCancel,
  selectMode = false,
  disableMaterialsKeys = [],
}) => {
  const DataMaterialService = new MaterialService();

  const [dataSource, setDataSource] = React.useState<IMaterialCategoryTable[]>([]);
  const [selectedMaterials, setSelectedMaterials] = React.useState<IMaterialTable[]>([]);

  const [updateCategory, setUpdateCategory] = React.useState<boolean>(true);
  const [loadingCategory, setLoadingCategory] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [dataSearch, setDataSearch] = React.useState<IMaterialCategoryTable[]>([]);
  const [materialModalFormOpen, setMaterialModalFormOpen] = React.useState<boolean>(false);
  const [materialEdit, setMaterialEdit] = React.useState<IMaterialTable | null>(null);
  const [categoryModalFormOpen, setCategoryModalFormOpen] = React.useState<boolean>(false);
  const [categoryEdit, setCategoryEdit] = React.useState<IMaterialCategoryTable | null>(null);

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
    const onDataLoaded = (result: MaterialType[]) => {
      const materials = result.map((material) => {
        return {
          key: `M-${material.pk}`,
          pk: material.pk,
          name: material.name,
          unit_name: material.unit_name,
          unit_is_precision_point: material.unit_is_precision_point,
          category: material.category,
          compatbility: material.compatbility,
          delete_forbidden: material.delete_forbidden,
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

    if (search.length >= 2) {
      DataMaterialService.getMaterials({ general_search: search }).then(onDataLoaded).catch(onError).finally(onFinally);
    } else {
      setDataSearch([]);
    }
  }, [search]);

  const columns: ColumnsType<IMaterialCategoryTable> = selectMode
    ? [
        {
          title: "Наименование",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Совместимость",
          dataIndex: "compatbility",
          key: "compatbility",
          width: 200,
          render: (_, record) => {
            return "children" in record ? "" : (record as any as MaterialType).compatbility.join("; ");
          },
        },
      ]
    : [
        {
          title: "Наименование",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Совместимость",
          dataIndex: "compatbility",
          key: "compatbility",
          width: 200,
          render: (_, record) => {
            return "children" in record
              ? ""
              : (record as any as MaterialType).compatbility.map((car_tag) => <Tag>{car_tag}</Tag>);
          },
        },
        {
          title: "Действия",
          dataIndex: "action",
          key: "action",
          width: 105,
          render: (_, record) => {
            return "children" in record ? (
              // Редактирвоание категорий
              <Space size={5}>
                <Button className="action-button" type="link" onClick={() => handleEditCategory(record)}>
                  <EditOutlined />
                </Button>
                {!(record.material_count !== undefined && record.material_count > 0) && (
                  <Button className="action-button" type="link" onClick={() => handleDeleteCategory(record)}>
                    <DeleteOutlined />
                  </Button>
                )}
              </Space>
            ) : (
              // Редактирвоание работ
              <Space size={5} style={{ paddingLeft: "30px" }}>
                <Button
                  className="action-button"
                  type="link"
                  onClick={() => handleEditMaterial(record as any as IMaterialTable)}
                >
                  <EditOutlined />
                </Button>
                {!(record as any as IMaterialTable).delete_forbidden && (
                  <Button
                    className="action-button"
                    type="link"
                    onClick={() => handleDeleteMaterial(record as any as IMaterialTable)}
                  >
                    <DeleteOutlined />
                  </Button>
                )}
              </Space>
            );
          },
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
        };
      }) as MaterialType[];

      onOk(materials);
    }
    onCancel();
  };

  const handleAddMaterial = () => {
    setMaterialEdit(null);
    showFormMaterialModal();
  };

  const handleEditMaterial = (material: IMaterialTable) => {
    setMaterialEdit(material);
    showFormMaterialModal();
  };

  const handleDeleteMaterial = (record: IMaterialTable) => {
    showConfirmDialog({
      title: `Вы уверены, что хотите удалить материал "${record.name}"?`,
      onOk: () => {
        if (record?.pk) {
          DataMaterialService.deleteMaterial(record.pk)
            .then(() => {
              // Если удалили материал, то обновляем счетчик категории
              const category = dataSource.find((category) => record.category === category.pk);
              if (category?.material_count !== undefined) {
                category.material_count -= 1;
                setDataSource(dataSource);
              }

              reloadCategory(record.category);
            })
            .catch((error) => {
              alert(error);
            });
        }
      },
      onCancel: () => {},
    });
  };

  const handleAddCategory = () => {
    setCategoryEdit(null);
    showFormCategoryModal();
  };

  const handleEditCategory = (category: IMaterialCategoryTable) => {
    setCategoryEdit(category);
    showFormCategoryModal();
  };

  const handleDeleteCategory = (record: IMaterialCategoryTable) => {
    showConfirmDialog({
      title: `Вы уверены, что хотите удалить категорию "${record.name}"?`,
      onOk: () => {
        if (record?.pk) {
          DataMaterialService.deleteMaterialCategory(record.pk)
            .then(() => {
              // Ищем и удаляем категорию, чтобы не обновлять полностью таблицу
              const index = dataSource.findIndex((category) => record.pk === category.pk);
              dataSource.splice(index, 1);
              setDataSource([...dataSource]);
            })
            .catch((error) => {
              alert(error);
            });
        }
      },
      onCancel: () => {},
    });
  };

  const showFormMaterialModal = () => {
    setMaterialModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const showFormCategoryModal = () => {
    setCategoryModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const reloadCategory = (category_pk: number) => {
    // Если категория открыта (есть children) то обновляем
    const category = dataSource.find((category) => category_pk === category.pk);
    if (category && category.children.length > 0) {
      loadingMaterialsCategory(category_pk);
    }
  };

  const handleOkMaterialForm = (category_pk_update: number) => {
    // Если переместили материал в другую категорию, то обновляем две категории
    if (materialEdit?.category && materialEdit.category !== category_pk_update) {
      reloadCategory(materialEdit.category);
    }
    reloadCategory(category_pk_update);

    // Если добавили материал, то обновляем счетчик категории
    if (materialEdit === null && category_pk_update) {
      const category = dataSource.find((category) => category_pk_update === category.pk);
      if (category?.material_count !== undefined) {
        category.material_count += 1;
        setDataSource(dataSource);
      }
    }

    showFormMaterialModal();
  };

  const handleCancelMaterialForm = () => {
    showFormMaterialModal();
  };

  const handleOkCategoryForm = (category: MaterialCategoryType) => {
    // Если добавили категорию, то добавляем в массив, чтобы не обновлять таблицу полностью
    // Если изменяем наименование, то так же изменяем в массиве
    if (categoryEdit === null && category.pk) {
      const newCategory: IMaterialCategoryTable = {
        key: `C-${category.pk}`,
        pk: category.pk,
        name: category.name,
        material_count: 0,
        children: [],
      };

      setDataSource([...dataSource, newCategory]);
    } else if (category.pk) {
      const index = dataSource.findIndex((item) => category.pk === item.pk);
      if (index) {
        // Bug: Почему то не происходит ре-рендер если изменить только name, только если пересоздать объект
        dataSource[index] = {
          key: `C-${category.pk}`,
          pk: category.pk,
          name: category.name,
          material_count: dataSource[index].material_count,
          children: dataSource[index].children,
        };

        setDataSource([...dataSource]);
      }
    }

    showFormCategoryModal();
  };

  const handleCancelCategoryForm = () => {
    showFormCategoryModal();
  };

  const loadingMaterialsCategory = (category_pk: number) => {
    const onDataLoaded = (result: MaterialType[]) => {
      const data = result.map((material) => {
        return {
          key: `M-${material.pk}`,
          pk: material.pk,
          name: material.name,
          unit_name: material.unit_name,
          unit_is_precision_point: material.unit_is_precision_point,
          category: material.category,
          compatbility: material.compatbility,
          delete_forbidden: material.delete_forbidden,
        };
      }) as IMaterialTable[];

      dataSource.find((category) => category.key === `C-${category_pk}`)!.children = data;
      setDataSource([...dataSource]);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataMaterialService.getMaterials({ category: category_pk }).then(onDataLoaded).catch(onError);
  };

  const handleExpand = (expanded: boolean, record: IMaterialCategoryTable) => {
    if (expanded && "children" in record) {
      loadingMaterialsCategory(record.pk);
    }
  };

  const onChangeSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);
  };

  const searchMode = search.length >= 2 && dataSearch.length > 0;

  return (
    <Modal
      title="Список материалов"
      open={open}
      onCancel={onCancel}
      maskClosable={selectedMaterials && selectedMaterials.length > 0 ? false : true}
      width={750}
      footer={[
        selectMode ? (
          <Button key="select" type="primary" onClick={handleOk}>
            {`Выбрать ${selectedMaterials && selectedMaterials.length > 0 ? `(${selectedMaterials.length})` : ""}`}
          </Button>
        ) : (
          <Button key="close" type="default" onClick={onCancel}>
            Закрыть
          </Button>
        ),
      ]}
    >
      {materialModalFormOpen && (
        <MaterialModalForm
          pk={materialEdit?.pk || null}
          open={materialModalFormOpen}
          onOk={handleOkMaterialForm}
          onCancel={handleCancelMaterialForm}
        />
      )}

      {categoryModalFormOpen && (
        <MaterialCategoryModalForm
          pk={categoryEdit?.pk || null}
          open={categoryModalFormOpen}
          onOk={handleOkCategoryForm}
          onCancel={handleCancelCategoryForm}
        />
      )}

      <div style={{ display: "flex" }}>
        <Input placeholder="Поиск" allowClear onChange={onChangeSearch} />
        <Button className="ml-10" onClick={handleAddMaterial}>
          Добавить материал
        </Button>
        <Button className="ml-10" onClick={handleAddCategory}>
          Добавить категорию
        </Button>
      </div>
      <div className="mt-10">
        <Table
          className="table-handbook"
          size="small"
          columns={columns}
          rowSelection={selectMode ? { ...rowSelection } : undefined}
          dataSource={searchMode ? dataSearch : dataSource}
          pagination={false}
          scroll={{ y: 450 }}
          expandable={{
            expandRowByClick: searchMode || !selectMode ? false : true,
            defaultExpandAllRows: true,
            expandedRowKeys: searchMode ? ["C-0"] : undefined,
            onExpand: !searchMode ? handleExpand : undefined,
          }}
          loading={loadingCategory}
        />
      </div>
    </Modal>
  );
};

export default MaterialsModal;
