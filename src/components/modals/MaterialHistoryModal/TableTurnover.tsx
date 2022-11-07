import { Button, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React from "react";
import { ActionTypes } from "../../../helpers/types";
import TurnoverService from "../../../services/TurnoverService";
import { ResultResursePagation, TurnoverMaterialType } from "../../../services/types";
import { ITableParams } from "../../interface";
import EntranceModalForm from "../EntranceModal";
import OrderModalForm from "../OrderModal";

interface ITableTurnover {
  materialId: number;
  filterType?: number;
  filterWarehouse?: number;
  update: boolean;
  setUpdate: any;
}

const TableParamsDefault: ITableParams = {
  pagination: {},
  sortField: undefined,
  sortOrder: undefined,
  filters: undefined,
  search: {},
};

const TableTurnover: React.FC<ITableTurnover> = ({ materialId, filterType, filterWarehouse, update, setUpdate }) => {
  const DataTurnoverService = new TurnoverService();

  const [data, setData] = React.useState<TurnoverMaterialType[]>([]);
  const [tableParams, setTableParams] = React.useState<ITableParams>(TableParamsDefault);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [entranceOpenModal, setEntranceOpenModal] = React.useState<boolean>(false);
  const [entranceIdOpen, setEntranceIdOpen] = React.useState<number | null>(null);
  const [orderOpenModal, setOrderOpenModal] = React.useState<boolean>(false);
  const [orderIdOpen, setOrderIdOpen] = React.useState<number | null>(null);

  React.useEffect(() => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<TurnoverMaterialType>) => {
      tableParams.pagination = {
        ...tableParams.pagination,
        pageSize: page_size,
        total: count,
        current: numbers.current,
      };

      setData(results);
      setTableParams(tableParams);
    };

    const onError = (error: any) => {
      alert(error);
    };

    const onFinally = () => {
      setUpdate(false);
      setLoading(false);
    };

    if (update) {
      setLoading(true);

      DataTurnoverService.getTurnoversMaterial({
        material_id: materialId,
        turnover_type: filterType,
        warehouse: filterWarehouse,
        page: tableParams.pagination?.current,
        sortField: tableParams.sortField,
        sortOrder: tableParams.sortOrder,
      })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<TurnoverMaterialType> | SorterResult<TurnoverMaterialType>[]
  ) => {
    const _sorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setTableParams({
      ...tableParams,
      pagination: pagination,
      sortField: _sorter.columnKey,
      sortOrder: _sorter.order,
    });
    setUpdate(true);
  };

  const handleOpenEntrance = (entrance_id: number) => {
    setEntranceIdOpen(entrance_id);
    setEntranceOpenModal(true);
  };

  const handleCloseEntrance = () => {
    setEntranceIdOpen(null);
    setEntranceOpenModal(false);
  };

  const handleOpenOrder = (order_id: number) => {
    setOrderIdOpen(order_id);
    setOrderOpenModal(true);
  };

  const handleCloseOrder = () => {
    setOrderIdOpen(null);
    setOrderOpenModal(false);
  };

  const getBackgroundColor = (record: TurnoverMaterialType): string | undefined => {
    if (record.is_correction) {
      return "#ffffdc";
    } else if (record.type === 1) {
      return "#e1ffe1";
    } else if (record.type === 2) {
      return "#ffe1e1";
    }
    return undefined;
  };

  const columns: ColumnsType<TurnoverMaterialType> = [
    {
      title: "Дата",
      key: "date",
      dataIndex: "date",
      width: 90,
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Движение",
      key: "turnover_name",
      dataIndex: "turnover_name",
      render: (text, record) => {
        if (record.entrance) {
          return (
            <Button style={{ paddingLeft: "0px" }} type="link" onClick={() => handleOpenEntrance(record.entrance || 0)}>
              {text}
            </Button>
          );
        } else if (record.order) {
          return (
            <Button style={{ paddingLeft: "0px" }} type="link" onClick={() => handleOpenOrder(record.order || 0)}>
              {text}
            </Button>
          );
        }
        return text;
      },
    },
    {
      title: "Склад",
      key: "warehouse_name",
      dataIndex: "warehouse_name",
      width: 120,
    },
    {
      title: "Количество",
      key: "quantity",
      dataIndex: "quantity_with_unit",
      width: 100,
    },
    {
      title: "Цена, руб",
      key: "price",
      dataIndex: "price",
      width: 100,
      render: (_, record) => record.price.toFixed(2),
    },
    {
      title: "Сумма, руб",
      key: "sum",
      dataIndex: "sum",
      width: 100,
      render: (_, record) => record.sum.toFixed(2),
    },
  ];

  return (
    <>
      {entranceOpenModal && (
        <EntranceModalForm
          readOnlyMode
          entrance_pk={entranceIdOpen}
          open={entranceOpenModal}
          action={ActionTypes.EDIT}
          handleOk={handleCloseEntrance}
          handleCancel={handleCloseEntrance}
        />
      )}
      {orderOpenModal && orderIdOpen && (
        <OrderModalForm
          readOnlyMode
          orderPk={orderIdOpen}
          open={orderOpenModal}
          actionForm={ActionTypes.EDIT}
          handleOk={handleCloseOrder}
          handleCancel={handleCloseOrder}
        />
      )}

      <Table
        style={{ marginTop: "15px" }}
        bordered
        size="small"
        loading={loading}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        onChange={handleTableChange}
        scroll={{
          y: 400,
          scrollToFirstRowOnChange: true,
        }}
        pagination={{ ...tableParams.pagination, showSizeChanger: false }}
        locale={{ emptyText: "Движения материала не найдены" }}
        onRow={(record, rowIndex) => {
          return {
            style: { backgroundColor: getBackgroundColor(record) },
          };
        }}
      />
    </>
  );
};

export default TableTurnover;
