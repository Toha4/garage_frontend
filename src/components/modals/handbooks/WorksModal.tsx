import React from "react";
import { Button, Input, Modal, Space } from "antd";
import { WorkCategoryType, WorkType } from "../../../services/types";
import WorkService from "../../../services/WorkService";
import Table, { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import WorkModalForm from "../../forms/WorkModalForm";
import showDeleteConfirmDialog from "../../common/DeleteDialog";
import WorkCategoryModalForm from "../../forms/WorkCategoryModalForm";

interface IWorksModal {
  open: boolean;
  onOk?: (works?: WorkType[]) => void;
  onCancel: () => void;
  selectMode?: boolean;
  disableWorksKeys?: React.Key[];
}

export interface IWorkTable extends WorkType {
  key: React.Key;
}

interface IWorkCategoryTable {
  key: React.Key;
  pk: number;
  name: string;
  work_count?: number;
  children: IWorkTable[];
}

const WorksModal: React.FC<IWorksModal> = ({ open, onOk, onCancel, selectMode = false, disableWorksKeys = [] }) => {
  const DataWorkService = new WorkService();

  const [dataSource, setDataSource] = React.useState<IWorkCategoryTable[]>([]);
  const [selectedWorks, setSelectedWorks] = React.useState<IWorkTable[]>([]);

  const [updateCategory, setUpdateCategory] = React.useState<boolean>(true);
  const [loadingCategory, setLoadingCategory] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [dataSearch, setDataSearch] = React.useState<IWorkCategoryTable[]>([]);
  const [workModalFormOpen, setWorkModalFormOpen] = React.useState<boolean>(false);
  const [workEdit, setWorkEdit] = React.useState<IWorkTable | null>(null);
  const [categoryModalFormOpen, setCategoryModalFormOpen] = React.useState<boolean>(false);
  const [categoryEdit, setCategoryEdit] = React.useState<IWorkCategoryTable | null>(null);

  React.useEffect(() => {
    const onDataLoaded = (result: WorkCategoryType[]) => {
      const data = result.map((category) => {
        return {
          key: `C-${category.pk}`,
          pk: category.pk,
          name: category.name,
          work_count: category.work_count,
          children: [],
        };
      }) as IWorkCategoryTable[];

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

      DataWorkService.geWorktCategoryes().then(onDataLoaded).catch(onError).finally(onFinally);
    }
  }, [updateCategory]);

  React.useEffect(() => {
    const onDataLoaded = (result: WorkType[]) => {
      const works = result.map((work) => {
        return {
          key: `W-${work.pk}`,
          pk: work.pk,
          name: work.name,
          category: work.category,
          delete_forbidden: work.delete_forbidden,
        };
      }) as IWorkTable[];

      setDataSearch([
        {
          key: "C-0",
          pk: 0,
          name: "Поиск",
          children: works,
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
      DataWorkService.geWorks({ search_name: search }).then(onDataLoaded).catch(onError).finally(onFinally);
    } else {
      setDataSearch([]);
    }
  }, [search]);

  const columns: ColumnsType<IWorkCategoryTable> =
    selectMode
      ? [
          {
            title: "Наименование",
            dataIndex: "name",
            key: "name",
          },
        ]
      : [
          {
            title: "Наименование",
            dataIndex: "name",
            key: "name",
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
                  {!(record.work_count !== undefined && record.work_count > 0) && (
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
                    onClick={() => handleEditWork(record as any as IWorkTable)}
                  >
                    <EditOutlined />
                  </Button>
                  {!(record as any as IWorkTable).delete_forbidden && (
                    <Button
                      className="action-button"
                      type="link"
                      onClick={() => handleDeleteWork(record as any as IWorkTable)}
                    >
                      <DeleteOutlined />
                    </Button>
                  )}
                </Space>
              );
            },
          },
        ];

  const rowSelection: TableRowSelection<IWorkCategoryTable> = {
    checkStrictly: false,
    hideSelectAll: true,
    selectedRowKeys: selectedWorks.map((work) => {
      return work.key;
    }),
    getCheckboxProps: (record) => {
      const isCategory = record.hasOwnProperty("children");
      let isDisable = false;
      if (!isCategory) {
        isDisable = disableWorksKeys.indexOf(record.key) !== -1;
      }
      return {
        style: isCategory ? { display: "none" } : {},
        disabled: isCategory || isDisable ? true : false,
      };
    },
    onSelect: (record, selected, selectedRows) => {
      if (selected) {
        selectedWorks.push(record as any as IWorkTable);
      } else {
        const index = selectedWorks.findIndex((item) => record.pk === item.pk);
        if (index >= 0) {
          selectedWorks.splice(index, 1);
        }
      }

      setSelectedWorks([...selectedWorks]);
    },
  };

  const handleOk = () => {
    if (onOk) {
      const works = selectedWorks!.map((workTable) => {
        return { pk: workTable.pk, category: workTable.category, name: workTable.name };
      }) as WorkType[];

      onOk(works);
    }
    onCancel();
  };

  const handleAddWork = () => {
    setWorkEdit(null);
    showFormWorkModal();
  };

  const handleEditWork = (work: IWorkTable) => {
    setWorkEdit(work);
    showFormWorkModal();
  };

  const handleDeleteWork = (record: IWorkTable) => {
    showDeleteConfirmDialog({
      title: `Вы уверены, что хотите удалить работу "${record.name}"?`,
      onOk: () => {
        if (record?.pk) {
          DataWorkService.deleteWork(record.pk)
            .then(() => {
              // Если удалили работу, то обновляем счетчик категории
              const category = dataSource.find((category) => record.category === category.pk);
              if (category?.work_count !== undefined) {
                category.work_count -= 1;
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

  const handleEditCategory = (category: IWorkCategoryTable) => {
    setCategoryEdit(category);
    showFormCategoryModal();
  };

  const handleDeleteCategory = (record: IWorkCategoryTable) => {
    showDeleteConfirmDialog({
      title: `Вы уверены, что хотите удалить категорию "${record.name}"?`,
      onOk: () => {
        if (record?.pk) {
          DataWorkService.deleteWorkCategory(record.pk)
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

  const showFormWorkModal = () => {
    setWorkModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const showFormCategoryModal = () => {
    setCategoryModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const reloadCategory = (category_pk: number) => {
    // Если категория открыта (есть children) то обновляем
    const category = dataSource.find((category) => category_pk === category.pk);
    if (category && category.children.length > 0) {
      loadingWorksCategory(category_pk);
    }
  };

  const handleOkWorkForm = (category_pk_update: number) => {
    // Если переместили работу в другую категорию, то обновляем две категории
    if (workEdit?.category && workEdit.category !== category_pk_update) {
      reloadCategory(workEdit.category);
    }
    reloadCategory(category_pk_update);

    // Если добавили работу, то обновляем счетчик категории
    if (workEdit === null && category_pk_update) {
      const category = dataSource.find((category) => category_pk_update === category.pk);
      if (category?.work_count !== undefined) {
        category.work_count += 1;
        setDataSource(dataSource);
      }
    }

    showFormWorkModal();
  };

  const handleCancelWorkForm = () => {
    showFormWorkModal();
  };

  const handleOkCategoryForm = (category: WorkCategoryType) => {
    // Если добавили категорию, то добавляем в массив, чтобы не обновлять таблицу полность
    // Если изменяем наименование, то так же изменяем в массиве
    if (categoryEdit === null && category.pk) {
      const newCategory: IWorkCategoryTable = {
        key: `C-${category.pk}`,
        pk: category.pk,
        name: category.name,
        work_count: 0,
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
          work_count: dataSource[index].work_count,
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

  const loadingWorksCategory = (id_category: number) => {
    const onDataLoaded = (result: WorkType[]) => {
      const data = result.map((work) => {
        return {
          key: `W-${work.pk}`,
          pk: work.pk,
          name: work.name,
          category: work.category,
          delete_forbidden: work.delete_forbidden,
        };
      }) as IWorkTable[];

      dataSource.find((category) => category.key === `C-${id_category}`)!.children = data;
      setDataSource([...dataSource]);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataWorkService.geWorks({ category: id_category }).then(onDataLoaded).catch(onError);
  };

  const handleExpand = (expanded: boolean, record: IWorkCategoryTable) => {
    if (expanded && "children" in record) {
      loadingWorksCategory(record.pk);
    }
  };

  const onChangeSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);
  };

  const searchMode = search.length >= 2 && dataSearch.length > 0;

  return (
    <Modal
      title="Список работ"
      open={open}
      onCancel={onCancel}
      maskClosable={selectedWorks && selectedWorks.length > 0 ? false : true}
      width={600}
      footer={[
        selectMode ? (
          <Button key="select" type="primary" onClick={handleOk}>
            {`Выбрать ${selectedWorks && selectedWorks.length > 0 ? `(${selectedWorks.length})` : ""}`}
          </Button>
        ) : (
          <Button key="close" type="default" onClick={onCancel}>
            Закрыть
          </Button>
        ),
      ]}
    >
      {workModalFormOpen && (
        <WorkModalForm
          pk={workEdit?.pk || null}
          open={workModalFormOpen}
          onOk={handleOkWorkForm}
          onCancel={handleCancelWorkForm}
        />
      )}

      {categoryModalFormOpen && (
        <WorkCategoryModalForm
          pk={categoryEdit?.pk || null}
          open={categoryModalFormOpen}
          onOk={handleOkCategoryForm}
          onCancel={handleCancelCategoryForm}
        />
      )}

      <div style={{ display: "flex" }}>
        <Input placeholder="Поиск" allowClear onChange={onChangeSearch} />
        <Button className="ml-10" onClick={handleAddWork}>
          Добавить работу
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

export default WorksModal;
