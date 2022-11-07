import { HistoryOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popover, Table, Tag, Tooltip } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React from "react";
import { ITableParams } from "../../components/interface";
import MaterialHistoryModal from "../../components/modals/MaterialHistoryModal";
import { quantityFormatter } from "../../helpers/utils";
import MaterialService from "../../services/MaterialService";
import { MaterialRemainsType, ResultResursePagation, WarehousesAvailability } from "../../services/types";
import RemainsFilter from "./RemainsFilter";

const TableParamsDefault: ITableParams = {
  pagination: {},
  sortField: undefined,
  sortOrder: undefined,
  filters: {},
  search: { hide_empty: "true" },
};

const WarehouseRemainsPage: React.FC = () => {
  const DataMaterialService = new MaterialService();

  const [dataSource, setDataSource] = React.useState<MaterialRemainsType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tableParams, setTableParams] = React.useState<ITableParams>(TableParamsDefault);
  const [update, setUpdate] = React.useState<boolean>(true);

  const [actionPk, setActionPk] = React.useState<number | undefined>(undefined);
  const [openHistoryModal, setOpenHistoryModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<MaterialRemainsType>) => {
      tableParams.pagination = {
        ...tableParams.pagination,
        pageSize: page_size,
        total: count,
        current: numbers.current,
      };

      setDataSource(results);
      setTableParams(tableParams);
    };

    const onError = () => {
      setDataSource([]);

      tableParams.pagination = {};
      setTableParams(tableParams);
    };

    const onFinally = () => {
      setUpdate(false);
      setLoading(false);
    };

    if (update) {
      setLoading(true);

      DataMaterialService.getMaterialRemains({
        page: tableParams.pagination?.current,
        sortField: tableParams.sortField,
        sortOrder: tableParams.sortOrder,
        ...tableParams.filters,
        ...tableParams.search,
      })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const getMaterialWarehouses = (
    warehouses_availability: WarehousesAvailability[],
    unit_is_precision_point: boolean,
    unit_name: string
  ) => {
    return (
      <ul>
        {warehouses_availability.map((warehouse) => (
          <li style={{ listStyleType: "none" }} key={warehouse.warehouse}>{`${
            warehouse.warehouse_name
          } - ${quantityFormatter(warehouse.quantity, unit_is_precision_point, unit_name)}`}</li>
        ))}
      </ul>
    );
  };

  const handleHistoryTurnover = (material_pk: number) => {
    setActionPk(material_pk);
    setOpenHistoryModal(true);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<MaterialRemainsType> | SorterResult<MaterialRemainsType>[]
  ) => {
    const _sorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setTableParams({
      ...tableParams,
      pagination: pagination,
      filters: filters,
      sortField: _sorter.columnKey,
      sortOrder: _sorter.order,
    });
    setUpdate(true);
  };

  const showHistoryDialog = () => {
    setOpenHistoryModal((prevOpenHistoryModal) => !prevOpenHistoryModal);
  };

  const handleOk = () => {
    showHistoryDialog();
    setActionPk(undefined);

    tableParams.pagination = {};
    setTableParams(tableParams);

    setUpdate(true);
  };

  const handleCancel = () => {
    showHistoryDialog();
    setActionPk(undefined);
  };

  const columns: ColumnsType<MaterialRemainsType> = [
    {
      title: "№ п/п",
      key: "number",
      width: 60,
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Наименование",
      key: "name",
      dataIndex: "name",
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Категория",
      key: "category_name",
      dataIndex: "category_name",
      width: 170,
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Совместимость",
      dataIndex: "compatbility",
      key: "compatbility",
      width: 180,
      render: (_, record) => {
        return record.compatbility.map((car_tag) => <Tag key={car_tag}>{car_tag}</Tag>);
      },
    },
    {
      title: () => (
        <div>
          <span>Остаток </span>
          <Popover content="Чтобы узнать остаток по складам, наведите на остаток">
            <QuestionCircleOutlined />
          </Popover>
        </div>
      ),
      key: "quantity",
      dataIndex: "quantity",
      width: 105,
      sorter: true,
      showSorterTooltip: false,
      render: (_, record) => (
        <Popover
          content={
            record.warehouses_availability &&
            record.warehouses_availability.length > 0 &&
            tableParams.search["warehouse"] === undefined
              ? getMaterialWarehouses(record.warehouses_availability, record.unit_is_precision_point, record.unit_name)
              : ""
          }
        >
          <span>{quantityFormatter(record.quantity, record.unit_is_precision_point, record.unit_name)}</span>
        </Popover>
      ),
    },
    {
      title: "Цена",
      key: "price",
      dataIndex: "price",
      width: 100,
      render: (_, record) => record.price.toFixed(2),
    },
    {
      title: "Сумма",
      key: "sum",
      dataIndex: "sum",
      width: 100,
      render: (_, record) => record.sum.toFixed(2),
    },
    {
      title: "Действия",
      key: "action",
      width: 85,
      render: (_, record) => (
        <div>
          <Tooltip title="История" mouseEnterDelay={0.6}>
            <Button className="action-button" type="link" onClick={() => handleHistoryTurnover(record.pk)}>
              <HistoryOutlined />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {openHistoryModal && actionPk && (
        <MaterialHistoryModal materialPk={actionPk} open={openHistoryModal} onOk={handleOk} onCancel={handleCancel} />
      )}

      <RemainsFilter tableParams={tableParams} setTableParams={setTableParams} updateTable={setUpdate} />
      <Table
        bordered
        size="small"
        rowKey={(record) => record.pk}
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
        loading={loading}
        pagination={{ ...tableParams.pagination, showSizeChanger: false }}
        scroll={{
          y: "calc(100vh - 310px)",
          scrollToFirstRowOnChange: true,
        }}
        locale={{ emptyText: "Остатки не найдены" }}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (event) => {
              handleHistoryTurnover(record.pk);
            },
          };
        }}
      />
    </>
  );
};

export default WarehouseRemainsPage;
